import React, { useState } from 'react'
import get from "lodash/get";
import { usePipeline } from "../state";
import { Panel, Nav } from "rsuite";
import DataTable from "react-data-table-component";
import JSONTree from "react-json-tree";


export default function DatasetBox(){

  const pipeline = usePipeline();
  const { state } = pipeline;
  const results = get(state, "parseDatasetResults");
  const currentDataTypes = get(pipeline.state, "parser.dataTypes");
  const [activeTab, setActiveTab] = useState("table")

  if (!results || !currentDataTypes) {
    return null;
  }

  const { dataset, dataTypes, errors } = results;
  
  const columns = Object.keys(currentDataTypes).map((name) => ({
    name: `${name} [${currentDataTypes[name]}]`,
    selector: name,
    sortable: true,
  }));
  
  return (
    <Panel shaded header="Parsed data" collapsible defaultExpanded>
      <Nav  activeKey={activeTab} appearance="tabs" onSelect={setActiveTab}>
        <Nav.Item eventKey="table">Table</Nav.Item>
        <Nav.Item eventKey="json">JSON</Nav.Item>
      </Nav>
      {activeTab === "table" && <DataTable columns={columns} data={dataset} pagination />}
      {activeTab==="json" && <JSONTree data={dataset}></JSONTree>}  
    </Panel>
    
  );
}