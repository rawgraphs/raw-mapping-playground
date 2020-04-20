import React, { useState, useEffect, useMemo } from "react";
import AceEditor from "react-ace";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isString from "lodash/isString";
import { usePipelineActions, usePipelineState } from "../state";
import isPlainObject from "lodash/isPlainObject";
import { Panel, Divider, Message, Button, Nav, Icon } from "rsuite";

//#TODO: this should come from raw-lib
function validateMappingShape(mapper) {
  if (false) {
    throw new Error(`invalid mapper definition`);
  }
}

export default function DataBoxMappingConfig({ title, footerMessage }) {
  const { setMappingConfig } = usePipelineActions();
  const { mapping, mapperError, loadedAt } = usePipelineState();
  const [activeTab, setActiveTab] = useState("json");

  const currentConfig = get(mapping, "config");
  const [config, setConfig] = useState("");
  console.log("currentConfig", currentConfig);
  useEffect(() => {
    setConfig(JSON.stringify(currentConfig, null, 2));
  }, [loadedAt]);

  const parsedConfig = useMemo(() => {
    if(mapperError){
      return { error: mapperError}
    }
    if (!config) {
      const out = { value: null };
      return out;
    }
    try {
      const value = JSON.parse(config);
      //this is just a "formal" validation of the config, actual one depends 
      //on this configuration and the actual mapper definition
      validateMappingShape(value);
      const out = { value };
      return out;
    } catch (err) {
      return { error: err };
    }
  }, [config, mapperError]);

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
    <Panel shaded collapsible defaultExpanded header={title}>
      <Nav
        activeKey={activeTab}
        appearance="tabs"
        onSelect={setActiveTab}
        style={{ marginBottom: 18 }}
      >
        <Nav.Item eventKey="json">Definition</Nav.Item>
        <Nav.Item eventKey="log">
          Log{" "}
          {parsedConfig.error && (
            <Icon style={{ color: "crimson" }} icon="exclamation-triangle" />
          )}
        </Nav.Item>
      </Nav>

      {/* <div className="box-toolbar">
        <Button type="button">Reset</Button>
      </div> */}
      {activeTab === "json" && (<AceEditor
        mode="json"
        theme="github"
        width="100%"
        height="300px"
        value={config}
        onChange={(v) => {
          console.log("v");
          if (!isEqual(v, currentConfig)) {
            setConfig(v);
          }
        }}
        editorProps={{ $blockScrolling: true }}
      />)}
        {activeTab === "log" && (
        <div className="log-datatypes">
          {parsedConfig.error &&
            (parsedConfig.error.message || "Error parsing json")}
        </div>
      )}


      <Divider></Divider>
      <Message
        description={footerMessage}
        mode={
          parsedConfig.error ? "error" : parsedConfig.value ? "success" : "info"
        }
      ></Message>
    </Panel>
  );
}
