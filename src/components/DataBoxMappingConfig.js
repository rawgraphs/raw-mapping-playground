import React, { useState, useEffect, useMemo } from 'react'
import AceEditor from "react-ace";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isString from "lodash/isString";
import { usePipelineActions, usePipelineState } from "../state";
import isPlainObject from "lodash/isPlainObject";
import { Panel, Divider, Message, Button } from "rsuite";


//#TODO: this should come from raw-lib
function validateMapping(mapper) {
  if (false) {
    throw new Error(`invalid mapper definition`);
  }
}

export default function DataBoxMappingConfig({ title, footerMessage }) {
  const {setMappingConfig} = usePipelineActions()
  const {mapping, loadedAt} = usePipelineState()

  const currentConfig = get(mapping, "config");
  const [config, setConfig] = useState("");
  console.log("currentConfig" , currentConfig)
  useEffect(() => {
    setConfig(JSON.stringify(currentConfig, null, 2));
  }, [loadedAt]);

  const parsedConfig = useMemo(() => {
    if (!config) {
      const out = { value: null };
      return out;
    }
    try {
      const value = JSON.parse(config);
      validateMapping(value);
      const out = { value };
      return out;
    } catch (err) {
      return { error: err };
    }
  }, [config]);

  useEffect(() => {
    if (parsedConfig.error) {
      return;
    }
    if (isEqual(parsedConfig.value, currentConfig)) {
      return;
    }
    setMappingConfig(parsedConfig.value);
  }, [currentConfig, parsedConfig, setMappingConfig]);

  return (
    <Panel
      shaded
      collapsible defaultExpanded
      header={title}
      >
      
      <div className="box-toolbar">
          <Button type="button">
            Reset
          </Button>
      </div>
      <AceEditor
        mode="json"
        theme="github"
        width="100%"
        height="300px"
        value={config}
        onChange={v => {
          console.log("v")
          if(!isEqual(v, currentConfig)){
            setConfig(v)
          }
        }}
        editorProps={{ $blockScrolling: true }}
      />
      <Divider></Divider>
      <Message
        description={footerMessage}
        mode={
          parsedConfig.error
            ? "error"
            : parsedConfig.value
            ? "success"
            : "info"
        }
      >
        
      </Message>
    </Panel>
  );
}