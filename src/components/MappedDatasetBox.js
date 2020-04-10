import React, { useState } from 'react'
import get from "lodash/get";
import { usePipelineMapperResults } from "../state";
import { Panel, Nav } from "rsuite";
import DataTable from "react-data-table-component";
import JSONTree from "react-json-tree";


export default function MappedDatasetBox({title}){

  const { mapperResults} = usePipelineMapperResults()

  if (!mapperResults) {
    return null;
  }
  
  return (
    <Panel shaded header={title} collapsible defaultExpanded>
      <div style={{height:500, overflowY: 'auto'}}><JSONTree data={mapperResults}></JSONTree></div>
    </Panel>
    
  );
}