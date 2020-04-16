import React, { useCallback, useEffect, useState } from "react";
import { Navbar, Nav, Dropdown, Icon, Button } from "rsuite";
import { saveAs } from "file-saver";
import omit from 'lodash/omit'
import { Uploader } from 'rsuite';
import { DISPERSION_PIPELINE_STATE, GROUP_AGGREGATE_STATE, GROUP_PIPELINE_STATE } from '../examplePipelines'
//import titanicDispersion from "../samples/titanic-dispersion.json";
import { usePipelineState, usePipelineActions } from "../state";
import PipelineLoader from './PipelineLoader'

const FileSaver = ({ title }) => {
    const state = usePipelineState();
    const saveData = useCallback(() => {
    const value = JSON.stringify(omit(state, ['loadedAt']));

    var blob = new Blob([value], { type: "application/json" });
    saveAs(blob, "pipeline.json");
  }, [state]);

  return <span onClick={saveData}>{title}</span>;
};




export default function Header() {

  const { setPipeline } = usePipelineActions()
  const state = usePipelineState();

  const saveData = useCallback(() => {
    const value = JSON.stringify(omit(state, ['loadedAt']));

    var blob = new Blob([value], { type: "application/json" });
    saveAs(blob, "pipeline.json");
  }, [state]);

  
  useEffect(() => {
    setPipeline(DISPERSION_PIPELINE_STATE)
  }, [setPipeline])

  
  const [loaderShown, setLoaderShown] = useState(false)


  return (
    <>
    <PipelineLoader show={loaderShown} onHide={() => {setLoaderShown(false)}}></PipelineLoader>
    <Navbar appearance="inverse">
      <Navbar.Body>
        <Nav>
          
          <Nav.Item onClick={() => {
            setLoaderShown(true)
          }} icon={<Icon icon="file-upload" />}>Load</Nav.Item>


        <Nav.Item onClick={() => {
            saveData()
          }} icon={<Icon icon="file-download" />}>Save</Nav.Item>
          
        </Nav>
        <Nav pullRight>
          <Nav.Item>RAWGraphs Mapping Playground</Nav.Item>
        </Nav>
      </Navbar.Body>
    </Navbar>
    </>
  );
}
