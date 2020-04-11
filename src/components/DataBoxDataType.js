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
import { Panel, Divider, Message, Badge, Nav, Icon } from "rsuite";
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
  const { parser, data } = usePipelineState();
  const { parseDatasetResults } = usePipelineResults();

  const dt = get(parseDatasetResults, "dataTypes");
  const currentDataTypes = get(parser, "dataTypes");
  const [dataTypes, setUserDataTypes] = useState("");

  const [activeTab, setActiveTab] = useState("json");

  useEffect(() => {
    if (!dataTypes && dt) {
      setUserDataTypes(JSON.stringify(dt, null, 2));
    }
  }, [data, dataTypes, dt]);

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
  console.log("parsedDataTypes", parsedDataTypes);

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
          Log {parsedDataTypes.error && <Icon style={{ color: 'crimson' }} icon="exclamation-triangle" />}
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
          value={dataTypes}
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
      <Message
        description={footerMessage}
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
