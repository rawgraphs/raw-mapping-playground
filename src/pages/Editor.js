import React, { useState, useMemo, useCallback, useEffect } from "react";
import Header from "../components/Header";
import Computer from "../components/Computer";
import AceEditor from "react-ace";
import DataTable from "react-data-table-component";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isString from "lodash/isString";
import JSONTree from 'react-json-tree'



import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

import { parseDataset } from "raw-lib";
import { TextInput } from "@primer/components";
import { usePipeline } from "../state";
import isPlainObject from "lodash/isPlainObject";

function DataBoxCSV({ title, footerMessage, mode = "text", onChange }) {
  const pipeline = usePipeline();

  const setDsvLoader = useCallback(
    separator => {
      return pipeline.setLoaders([{ type: "dsv", separator }]);
    },
    [pipeline]
  );

  return (
    <div className="Box">
      <div className="Box-header d-flex flex-justify-between">
        <h3 className="Box-title">{title}</h3>
        <input
          className="form-control input-sm"
          type="text"
          placeholder="separator"
          aria-label="separator"
          value={pipeline.state.loaders[0].separator}
          onChange={e => setDsvLoader(e.target.value)}
        />
      </div>
      <div className="Box-body">
        <AceEditor
          mode={mode}
          theme="github"
          width="100%"
          height="300px"
          value={pipeline.state.data || ""}
          onChange={pipeline.setData}
          editorProps={{ $blockScrolling: true }}
        />
      </div>
      <div className="Box-footer">{footerMessage}</div>
    </div>
  );
}

function validateType(t){
  const types = ["number", "date", "string", "boolean"]
  if(isString(t) && types.indexOf(t) === -1){
    return false
  }
  if(isPlainObject(t) && (!t.type || types.indexOf(t.type) === -1)){
    return false
  }
  return true
}

function validateDataTypes(dt){
  Object.keys(dt).forEach(k => {
    const v = dt[k]
    if(!validateType(v)){
      throw new Error(`invalid type for ${k}`)
    }
  })
  
}

function DataBoxDataType({ title, footerMessage, mode = "text", onChange }) {
  const pipeline = usePipeline();
  const x = get(pipeline.state, 'parseDatasetResults.dataTypes')
  const currentDataTypes = get(pipeline.state, 'parser.dataTypes')
  const [dataTypes, setDataTypes] = useState("");
  
  useEffect(( ) => {
    if(!dataTypes && x){
      setDataTypes(JSON.stringify(x, null, 2))
    }
  }, [dataTypes, x])


  
  const parsedDataTypes = useMemo(() => {
    if (!dataTypes) {
      const out = { value: null };
      return out
    }
    try {
      const value = JSON.parse(dataTypes) 
      validateDataTypes(value)
      const out = { value };
      return out
    } catch (err) {
      return { error: err };
    }
  }, [dataTypes]);

  

  useEffect(() => {
    if(parsedDataTypes.error){
      return
    }
    if(isEqual(parsedDataTypes.value, currentDataTypes)){
      return 
    }
    pipeline.setDataTypes(parsedDataTypes.value)
  }, [currentDataTypes, parsedDataTypes, pipeline])

  return (
    <div className="Box">
      <div className="Box-header d-flex flex-justify-between">
        <h3 className="Box-title">{title}</h3>
        <button className="btn btn-sm mr-2" type="button">
          Empty
        </button>
      </div>
      <div className="Box-body">
        <AceEditor
          mode={mode}
          theme="github"
          width="100%"
          height="300px"
          value={dataTypes}
          onChange={setDataTypes}
          // name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
      </div>
      <div
        className={
          parsedDataTypes.error
            ? "Box-footer bg-red-light"
            : parsedDataTypes.value
            ? "Box-footer bg-green-light"
            : "Box-footer"
        }
      >
        {footerMessage}
      </div>
    </div>
  );
}

function Dataset() {
  const pipeline = usePipeline();

  const { state } = pipeline;
  const results = get(state, "parseDatasetResults");
  const currentDataTypes = get(pipeline.state, 'parser.dataTypes')
  console.log("results here", results);

  if (!results || !currentDataTypes) {
    return null;
  }

  const { dataset, dataTypes, errors } = results;
  console.log("dataTypes", dataTypes);
  console.log("errors", errors);
  

  const columns = Object.keys(currentDataTypes).map(name => ({
    name: `${name} [${currentDataTypes[name]}]`,
    selector: name,
    sortable: true
  }));

  return (
    <div className="Box">
      <div className="Box-header d-flex flex-justify-between">
        <h3 className="Box-title">EI</h3>
      </div>
      <div className="Box-body">
        <DataTable columns={columns} data={dataset} pagination />
      </div>
      <div className="Box-footer">
        <JSONTree data={dataset}></JSONTree>
      </div>
    </div>
  );
}

export default function Editor({ initialExample }) {
  return (
    <div className="fullpage with-header">
      <Header></Header>

      <div className="container-xl p-4">
        <div className="clearfix gutter-condensed">
          <div className="col-8 float-left">
            <DataBoxCSV title="Data" footerMessage="Paste CSV data here" />
          </div>
          <div className="col-4 float-left">
            <DataBoxDataType
              title="Data Types"
              footerMessage="Optional data types declaration (JSON)"
              mode="json"
            />
          </div>
        </div>

        <div className="clearfix gutter-condensed">
          <div className="col-8 float-left">
            <Dataset />
          </div>
          <div className="col-4 float-left">
            
          </div>
        </div>
      </div>

      <Computer />
    </div>
  );
}
