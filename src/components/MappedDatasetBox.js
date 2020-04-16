import React from "react";
import { usePipelineMapperResults } from "../state";
import { Panel, Nav } from "rsuite";
import JSONTree from "react-json-tree";

export default function MappedDatasetBox({ title }) {
  const { mapperResults } = usePipelineMapperResults();

  if (!mapperResults) {
    return null;
  }

  return (
    <Panel shaded header={title} collapsible defaultExpanded>
      <div style={{ height: 500, overflowY: "auto" }}>
        <JSONTree data={mapperResults}></JSONTree>
      </div>
    </Panel>
  );
}
