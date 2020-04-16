import React, { useState, useEffect, useMemo } from 'react'
import AceEditor from "react-ace";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isString from "lodash/isString";
import { usePipelineActions, usePipelineState } from "../state";
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

//#TODO: this should come from raw-lib
function validateMapper(mapper) {
  if (false) {
    throw new Error(`invalid mapper definition`);
  }
}

export default function DataBoxMapper({ title, footerMessage, mode = "text", onChange }) {
  
  const {setMapper} = usePipelineActions()
  const {mapping, loadedAt } = usePipelineState()

  const currentMapper = get(mapping, "mapper");
  const [userMapper, setUserMapper] = useState("");
  console.log("currentMapper" , currentMapper)

  const currentMapperString = useMemo(() => {
    return JSON.stringify(currentMapper, null, 2)
  }, [currentMapper])

  const parsedMapper = useMemo(() => {
    if (!userMapper) {
      const out = { value: null };
      return out;
    }
    try {
      const value = JSON.parse(userMapper);
      validateMapper(value);
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
        value={userMapper}
        onChange={v => {
          setUserMapper(v)
        }}
        editorProps={{ $blockScrolling: true }}
      />
      <Divider></Divider>
      <Message
        description={footerMessage}
        mode={
          parsedMapper.error
            ? "error"
            : parsedMapper.value
            ? "success"
            : "info"
        }
      >
        
      </Message>
    </Panel>
  );
}