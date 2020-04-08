import React, { useState, useEffect, useMemo } from 'react'
import AceEditor from "react-ace";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isString from "lodash/isString";
import { usePipeline } from "../state";
import isPlainObject from "lodash/isPlainObject";
import { Panel, Divider, Message, Button } from "rsuite";


function validateType(t) {
  const types = ["number", "date", "string", "boolean"];
  if (isString(t) && types.indexOf(t) === -1) {
    return false;
  }
  if (isPlainObject(t) && (!t.type || types.indexOf(t.type) === -1)) {
    return false;
  }
  return true;
}

function validateDataTypes(dt) {
  Object.keys(dt).forEach((k) => {
    const v = dt[k];
    if (!validateType(v)) {
      throw new Error(`invalid type for ${k}`);
    }
  });
}

export default function DataBoxDataType({ title, footerMessage, mode = "text", onChange }) {
  const pipeline = usePipeline();
  const x = get(pipeline.state, "parseDatasetResults.dataTypes");
  const currentDataTypes = get(pipeline.state, "parser.dataTypes");
  const [dataTypes, setDataTypes] = useState("");

  useEffect(() => {
    if (!dataTypes && x) {
      setDataTypes(JSON.stringify(x, null, 2));
    }
  }, [dataTypes, x]);

  const parsedDataTypes = useMemo(() => {
    if (!dataTypes) {
      const out = { value: null };
      return out;
    }
    try {
      const value = JSON.parse(dataTypes);
      validateDataTypes(value);
      const out = { value };
      return out;
    } catch (err) {
      return { error: err };
    }
  }, [dataTypes]);

  useEffect(() => {
    if (parsedDataTypes.error) {
      return;
    }
    if (isEqual(parsedDataTypes.value, currentDataTypes)) {
      return;
    }
    pipeline.setDataTypes(parsedDataTypes.value);
  }, [currentDataTypes, parsedDataTypes, pipeline]);

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
        mode={mode}
        theme="github"
        width="100%"
        height="300px"
        value={dataTypes}
        onChange={setDataTypes}
        editorProps={{ $blockScrolling: true }}
      />
      <Divider></Divider>
      <Message
        description={footerMessage}
        mode={
          parsedDataTypes.error
            ? "error"
            : parsedDataTypes.value
            ? "success"
            : "info"
        }
      >
        
      </Message>
    </Panel>
  );
}