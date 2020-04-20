import React, { useState, useEffect, useMemo } from "react";
import AceEditor from "react-ace";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isString from "lodash/isString";
import {
  usePipelineActions,
  usePipelineState,
  usePipelineResults,
} from "../state";
import isPlainObject from "lodash/isPlainObject";
import { Panel, Divider, Message, Toggle, Nav, Icon, Button } from "rsuite";
import { inferTypes } from "raw-lib";

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

export default function DataBoxDataType({
  title,
  footerMessage,
  mode = "text",
  onChange,
}) {
  const { setDataTypes } = usePipelineActions();
  const { parser, data, loaders, loadedAt } = usePipelineState();
  const { parseDatasetResults } = usePipelineResults();

  const dt = useMemo(() => {
    return get(parseDatasetResults, "dataTypes")
  }, [parseDatasetResults])
 
  const currentDataTypes = get(parser, "dataTypes");
  const [userDataTypes, setUserDataTypes] = useState("");

  const [activeTab, setActiveTab] = useState("json");

  const [autoReload, setAutoReload] = useState(false);

  useEffect(() => {
    if (!currentDataTypes && dt) {
      if(data){
        setUserDataTypes(JSON.stringify(dt, null, 2));
      } else {

      }
      
    }
  }, [currentDataTypes, data, dt]);

  useEffect(() => {
    if (autoReload) {
      setUserDataTypes("")
    }
  }, [data, loaders]);


  useEffect(() => {
    if (currentDataTypes) {
      setUserDataTypes(JSON.stringify(currentDataTypes, null, 2));
    } else {
      setUserDataTypes("");
    }
  }, [loadedAt]);

  
  const parsedDataTypes = useMemo(() => {
    if (!userDataTypes) {
      const out = { value: null };
      return out;
    }
    try {
      const value = JSON.parse(userDataTypes);
      validateDataTypes(value);
      const out = { value };
      return out;
    } catch (err) {
      return { error: err };
    }
  }, [userDataTypes]);

  useEffect(() => {
    if (parsedDataTypes.error) {
      return;
    }
    if (isEqual(parsedDataTypes.value, currentDataTypes)) {
      return;
    }
    setDataTypes(parsedDataTypes.value);
  }, [currentDataTypes, parsedDataTypes, setDataTypes]);

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
          {parsedDataTypes.error && (
            <Icon style={{ color: "crimson" }} icon="exclamation-triangle" />
          )}
        </Nav.Item>
      </Nav>
      {/* <div className="box-toolbar">
          <Button type="button">
            Reset
          </Button>
      </div> */}

      {activeTab === "json" && (
        <AceEditor
          mode={mode}
          theme="github"
          width="100%"
          height="300px"
          value={userDataTypes}
          onChange={setUserDataTypes}
          editorProps={{ $blockScrolling: true }}
        />
      )}

      {activeTab === "log" && (
        <div className="log-datatypes">
          {parsedDataTypes.error &&
            (parsedDataTypes.error.message || "Error parsing json")}
        </div>
      )}

      <Divider></Divider>
      <div className="message-toolbar">
        <div>
          <Toggle checked={autoReload} onChange={setAutoReload}></Toggle>
          {'  '}Autoreload
        </div>
        <Button onClick={() => { setUserDataTypes("") }}>Reload</Button>
      </div>

      <Message
        description={<div>{footerMessage}</div>}
        type={
          parsedDataTypes.error
            ? "error"
            : parsedDataTypes.value
            ? "success"
            : "info"
        }
      ></Message>
    </Panel>
  );
}
