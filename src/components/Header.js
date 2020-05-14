import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Navbar, Nav, Dropdown, Icon, Loader } from "rsuite";
import { saveAs } from "file-saver";
import omit from "lodash/omit";
import {
  DISPERSION_PIPELINE_STATE,
  GROUP_AGGREGATE_STATE,
  GROUP_PIPELINE_STATE,
} from "../examplePipelines";
//import titanicDispersion from "../samples/titanic-dispersion.json";
import {
  usePipelineState,
  usePipelineActions,
  usePipelineInternals,
} from "../state";
import PipelineLoader from "./PipelineLoader";
import get from "lodash/get";
import find from "lodash/find";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import Gists from "gists";

export default function Header() {
  const { setPipeline } = usePipelineActions();
  const state = usePipelineState();

  const saveData = useCallback(() => {
    const value = JSON.stringify(omit(state, ["loadedAt", "computing"]));
    var blob = new Blob([value], { type: "application/json" });
    saveAs(blob, "pipeline.json");
  }, [state]);

  const { computing } = usePipelineInternals();

  let location = useLocation();

  const gistId = useMemo(() => {
    const params = qs.parse(location.search);
    return get(params, "gist");
  }, [location.search]);

  useEffect(() => {
    function getGist() {
      const gists = new Gists();
      return gists.get(gistId).then((data) => {
        const { body = {} } = data;
        const { files } = body;
        if (!files["pipeline.json"]) {
          const msg = `CANNOT PARSE GIST! ${gistId}: pipeline.json not found`;
          console.warn("Error in loading gist", msg);
          // throw new Error(msg);
          return;
        }
        try {
          let gistPipeline = JSON.parse(files["pipeline.json"].content);
          const dataCandidates = ["data.csv", "data.tsv", "data.dsv", "data"];
          const candidateData = find(dataCandidates, (key) => !!files[key]);
          if (candidateData) {
            data = files[candidateData].content;
            gistPipeline.data = data;
          }

          // const { grid, tileSet } = gistPipeline;

          // if (!grid) {
          //   throw new Error("grid description not found");
          // }
          // if (!tileSet) {
          //   throw new Error("tileSet description not found");
          // }
          setPipeline(gistPipeline);
        } catch (err) {
          const msg = `CANNOT PARSE GIST! ${gistId}: ${err}`;
          console.warn("Error in loading gist", msg);
          // throw new Error(msg);
        }
      });
    }

    if (gistId) {
      getGist();
    } else {
      setPipeline(DISPERSION_PIPELINE_STATE);
    }
  }, [setPipeline, gistId]);

  const [loaderShown, setLoaderShown] = useState(false);

  return (
    <>
      <PipelineLoader
        show={loaderShown}
        onHide={() => {
          setLoaderShown(false);
        }}
      ></PipelineLoader>
      <Navbar appearance="inverse">
        <Navbar.Body>
          <Nav>
            <Nav.Item
              onClick={() => {
                setLoaderShown(true);
              }}
              icon={<Icon icon="file-upload" />}
            >
              Load
            </Nav.Item>

            <Nav.Item
              onClick={() => {
                saveData();
              }}
              icon={<Icon icon="file-download" />}
            >
              Save
            </Nav.Item>
          </Nav>
          <Nav pullRight>
            <Nav.Item>{computing && <Loader center></Loader>}</Nav.Item>
            <Nav.Item>RAWGraphs Mapping Playground</Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
    </>
  );
}
