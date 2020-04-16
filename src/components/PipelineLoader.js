import React, { useState, useCallback } from "react";
import { Modal, Nav, Grid, Row, Col, List } from "rsuite";
import { usePipelineState, usePipelineActions } from "../state";
import request from "superagent";

const SAMPLES = ["titanic-dispersion.json", "music-dispersion.json"];

export default function PipelineLoader({ show, onHide }) {
  const [active, setActive] = useState("sample");
  const { setPipeline } = usePipelineActions();

  const importSample = useCallback(
    (name) => {
      console.log("name");
      const fileName = `../samples/${name}`;
      request.get(fileName).then(({ body }) => {
        console.log("moo", body);
        setPipeline(body);
        onHide();
      });
    },
    [setPipeline]
  );

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>Load</Modal.Header>
      <Modal.Body>
        <Grid>
          <Row>
            <Col xs={3}>
              <Nav
                vertical
                appearance="tabs"
                activeKey={active}
                onSelect={setActive}
              >
                <Nav.Item eventKey="sample">Sample</Nav.Item>
                <Nav.Item eventKey="file">File</Nav.Item>
              </Nav>
            </Col>
            <Col xs={21} style={{ padding: 16 }}>
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
            </Col>
          </Row>
        </Grid>
      </Modal.Body>
    </Modal>
  );
}
