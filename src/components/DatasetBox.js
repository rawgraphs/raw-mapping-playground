import React, { useState } from "react";
import get from "lodash/get";
import { usePipelineState, usePipelineResults } from "../state";
import { Panel, Nav, Table } from "rsuite";
import JSONTree from "react-json-tree";

const { Column, HeaderCell, Cell, Pagination } = Table;

const DataTable = ({ data, columns }) => {
  return (
    data && (
      <Table height={400} data={data} virtualized>
        {columns.map((column, i) => (
          <Column key={i} width={200}>
            <HeaderCell>{column.name}</HeaderCell>
            <Cell>
              { rowData => {
                return (get(rowData, column.selector) || '').toString()
              }}
            </Cell>
          </Column>
        ))}
      </Table>
    )
  );
};

export default function DatasetBox() {
  const { parser } = usePipelineState();
  const { parseDatasetResults } = usePipelineResults();

  const currentDataTypes = get(parser, "dataTypes");
  const [activeTab, setActiveTab] = useState("table");

  if (!parseDatasetResults || !currentDataTypes) {
    return null;
  }

  const { dataset, dataTypes, errors } = parseDatasetResults;

  const columns = Object.keys(currentDataTypes).map((name) => ({
    name: `${name} [${currentDataTypes[name]}]`,
    selector: name,
    sortable: true,
  }));

  return (
    <Panel shaded header="Parsed data" collapsible defaultExpanded>
      <Nav activeKey={activeTab} appearance="tabs" onSelect={setActiveTab}>
        <Nav.Item eventKey="table">Table</Nav.Item>
        <Nav.Item eventKey="json">JSON</Nav.Item>
      </Nav>
      {activeTab === "table" && (
        <DataTable columns={columns} data={dataset} pagination />
      )}
      {activeTab === "json" && (
        <div style={{ height: 500, overflowY: "auto" }}>
          <JSONTree data={dataset}></JSONTree>
        </div>
      )}
    </Panel>
  );
}
