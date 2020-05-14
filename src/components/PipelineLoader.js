import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  Nav,
  FlexboxGrid,
  List,
  Uploader,
  Message,
} from "rsuite";
import { usePipelineState, usePipelineActions } from "../state";
import request from "superagent";

const SAMPLES = [
  "cities-group.json",
  "cities-groups.json",
  "cities-rollup.json",
  "cities-rollup-sum.json",
  "cities-rollups.json",
  "music-dispersion.json",
  "titanic-dispersion.json",
  "titanic-group.json",
  "titanic-groupAggregate.json",
  "titanic-rollup.json",
];

export default function PipelineLoader({ show, onHide }) {
  const [active, setActive] = useState("sample");
  const [currentFile, setCurrentFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const { setPipeline } = usePipelineActions();

  const handleFileLoad = useCallback(
    (event) => {
      try {
        const data = JSON.parse(event.target.result);
        //
        onHide();
        setFileError(null);
        setPipeline(data);
        setCurrentFile(null);
      } catch (err) {
        setFileError(`Cannot load json from file, sorry`);
        setCurrentFile(null);
        // setCurrentFile(null);
      }
    },
    [onHide, setPipeline]
  );

  const readFile = useCallback(
    (file) => {
      setFileError(null);
      const reader = new FileReader();
      reader.onload = handleFileLoad;
      reader.readAsText(file);
    },
    [handleFileLoad]
  );

  const importSample = useCallback(
    (name) => {
      const fileName = `../samples/${name}`;
      request.get(fileName).then(({ body }) => {
        setPipeline(body);
        onHide();
      });
    },
    [onHide, setPipeline]
  );

  useEffect(() => {
    setCurrentFile(null);
    setFileError(null);
  }, [active]);

  useEffect(() => {
    if (!currentFile) {
      return;
    }
    readFile(currentFile[0].blobFile);
  }, [currentFile, readFile]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>Load</Modal.Header>
      <Modal.Body>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={6}>
            <Nav
              vertical
              appearance="tabs"
              activeKey={active}
              onSelect={setActive}
            >
              <Nav.Item eventKey="sample">Sample</Nav.Item>
              <Nav.Item eventKey="file">File</Nav.Item>
            </Nav>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={18}>
            <div style={{ padding: "0px 16px" }}>
              {active === "sample" && (
                <List hover>
                  {SAMPLES.map((sample, i) => (
                    <List.Item
                      style={{ cursor: "pointer" }}
                      key={i}
                      onClick={() => {
                        importSample(sample);
                      }}
                    >
                      {sample}
                    </List.Item>
                  ))}
                </List>
              )}
              {active === "file" && (
                <div style={{ padding: 16 }}>
                  {!currentFile && (
                    <Uploader
                      draggable
                      fileList={currentFile || []}
                      autoUpload={false}
                      onChange={(value) => {
                        console.log(value);
                        setCurrentFile(value);
                      }}
                    >
                      <div style={{ lineHeight: "180px" }}>
                        Click or Drag files to this area to upload
                      </div>
                    </Uploader>
                  )}
                  {fileError && (
                    <Message type="error" description={fileError}></Message>
                  )}
                </div>
              )}
            </div>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Modal.Body>
    </Modal>
  );
}
