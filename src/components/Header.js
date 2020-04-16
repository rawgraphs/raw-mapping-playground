import React, { useCallback, useEffect } from "react";
import { Navbar, Nav, Dropdown, Icon, Button } from "rsuite";
import { saveAs } from "file-saver";
import omit from 'lodash/omit'
import { Uploader } from 'rsuite';
import { DISPERSION_PIPELINE_STATE, GROUP_AGGREGATE_STATE, GROUP_PIPELINE_STATE } from '../examplePipelines'

import titanicDispersion from "../samples/titanic-dispersion.json";

import { usePipelineState, usePipelineActions } from "../state";

const FileSaver = ({ title }) => {
  const state = usePipelineState();

  const saveData = useCallback(() => {
    const value = JSON.stringify(omit(state, ['loadedAt']));

    var blob = new Blob([value], { type: "application/json" });
    saveAs(blob, "pipeline.json");
  }, [state]);

  return <span onClick={saveData}>{title}</span>;
};


const FileUploader = ({}) => {

  
}


export default function Header() {

  const { setPipeline } = usePipelineActions()

  useEffect(() => {
    setPipeline(DISPERSION_PIPELINE_STATE)
  }, [setPipeline])


  return (
    <Navbar appearance="inverse">
      <Navbar.Body>
        <Nav>
          {/* <Nav.Item icon={<Icon icon="file-upload" />}>Load file</Nav.Item>
      <Nav.Item icon={<Icon icon="file-download" />}>Save file</Nav.Item> */}

          <Dropdown icon={<Icon icon="file-upload" />} title="Load">
            {/*<Dropdown.Item icon={<Icon icon="file-upload" />}>
               Load file
              <Uploader></Uploader>
            </Dropdown.Item> */}
            <Dropdown.Item onClick={() => { setPipeline(titanicDispersion) }} icon={<Icon icon="database" />}>
              Load example - Titanic/dispersion
            </Dropdown.Item>
            <Dropdown.Item onClick={() => { setPipeline(GROUP_PIPELINE_STATE) }} icon={<Icon icon="th2" />}>
              Load example - Titanic/group
            </Dropdown.Item>
            <Dropdown.Item onClick={() => { setPipeline(GROUP_AGGREGATE_STATE) }} icon={<Icon icon="th2" />}>
              Load example - Titanic/groupAggregate
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
