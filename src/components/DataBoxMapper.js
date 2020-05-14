import React, { useState, useEffect, useMemo } from "react";
import AceEditor from "react-ace";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isString from "lodash/isString";
import { usePipelineActions, usePipelineState } from "../state";
import isPlainObject from "lodash/isPlainObject";
import { Panel, Divider, Message, Button, Nav, Icon } from "rsuite";
import { validateMapperDefinition } from 'raw-lib'
 

export default function DataBoxMapper({
  title,
  footerMessage,
  mode = "text",
  onChange,
}) {
  const { setMapper } = usePipelineActions();
  const { mapping, loadedAt } = usePipelineState();

  const [activeTab, setActiveTab] = useState("json");

  const currentMapper = get(mapping, "mapper");
  const [userMapper, setUserMapper] = useState("");

  const currentMapperString = useMemo(() => {
    return JSON.stringify(currentMapper, null, 2);
  }, [currentMapper]);

  const parsedMapper = useMemo(() => {
    if (!userMapper) {
      const out = { value: null };
      return out;
    }
    try {
      const value = JSON.parse(userMapper);
       validateMapperDefinition(value);
      const out = { value };
      return out;
    } catch (err) {
      return { error: err };
    }
  }, [userMapper]);

  useEffect(() => {
    setUserMapper(currentMapperString);
  }, [loadedAt]);

  // useEffect(() => {
  //   if ((!userMapper && currentMapper)) {
  //     setUserMapper(currentMapperString);
  //   }
  // }, [userMapper, currentMapper, currentMapperString]);

  // useEffect(() => {
  //   if ((userMapper && currentMapperString === "null")) {
  //     setUserMapper("");
  //   }
  // }, [userMapper, currentMapper, currentMapperString]);

  useEffect(() => {
    if (parsedMapper.error) {
      return;
    }
    if (isEqual(parsedMapper.value, currentMapper)) {
      return;
    }
    setMapper(parsedMapper.value);
  }, [currentMapper, parsedMapper, setMapper]);

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
          {parsedMapper.error && (
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
          mode="json"
          theme="github"
          width="100%"
          height="300px"
          value={userMapper}
          onChange={(v) => {
            setUserMapper(v);
          }}
          editorProps={{ $blockScrolling: true }}
        />
      )}
      {activeTab === "log" && (
        <div className="log-datatypes">
          {parsedMapper.error &&
            (parsedMapper.error.message || "Error parsing json")}
        </div>
      )}

      <Divider></Divider>

      <Message
        description={footerMessage}
        mode={
          parsedMapper.error ? "error" : parsedMapper.value ? "success" : "info"
        }
      ></Message>
    </Panel>
  );
}
