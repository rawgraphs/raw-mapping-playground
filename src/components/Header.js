import React, { useCallback } from "react";
import { Navbar, Nav, Dropdown, Icon, Button } from "rsuite";
import { saveAs } from "file-saver";
import { Uploader } from 'rsuite';

import { usePipelineState } from "../state";

const FileSaver = ({ title }) => {
  const state = usePipelineState();

  const saveData = useCallback(() => {
    const value = JSON.stringify(state);

    var blob = new Blob([value], { type: "application/json" });
    saveAs(blob, "pipeline.json");
  }, [state]);

  return <span onClick={saveData}>{title}</span>;
};


const FileUploader = ({}) => {



}





export default function Header() {
  return (
    <Navbar appearance="inverse">
      <Navbar.Body>
        <Nav>
          {/* <Nav.Item icon={<Icon icon="file-upload" />}>Load file</Nav.Item>
      <Nav.Item icon={<Icon icon="file-download" />}>Save file</Nav.Item> */}

          <Dropdown icon={<Icon icon="file-upload" />} title="Load">
            <Dropdown.Item icon={<Icon icon="file-upload" />}>
              {/* Load file */}
              <Uploader></Uploader>
            </Dropdown.Item>
            <Dropdown.Item icon={<Icon icon="database" />}>
              Save to localstorage
            </Dropdown.Item>
            <Dropdown.Item icon={<Icon icon="th2" />}>
              Load sample
            </Dropdown.Item>
          </Dropdown>

          <Dropdown icon={<Icon icon="file-download" />} title="Save">
            <Dropdown.Item icon={<Icon icon="file-download" />}>
              <FileSaver title="Download file"></FileSaver>
            </Dropdown.Item>
            <Dropdown.Item icon={<Icon icon="database" />}>
              Save to localstorage
            </Dropdown.Item>
          </Dropdown>
        </Nav>
        <Nav pullRight>
          <Nav.Item>RAWGraphs Mapping Playground</Nav.Item>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
}
