import React, { useState, useMemo, useCallback, useEffect } from "react";
import NavTop from "../components/Header";
import Computer from "../components/Computer";
import DatasetBox from "../components/DatasetBox";
import DataBoxCSV from "../components/DataBoxCSV";
import DataBoxDataType from "../components/DataBoxDataType";
import DataBoxMapper from "../components/DataBoxMapper";
import DataBoxMappingConfig from "../components/DataBoxMappingConfig";


import { Container, Header, Content } from "rsuite";
import { Grid, Row, Col } from "rsuite";

export default function Editor({ initialExample }) {
  return (
    <Container>
      <Header>
        <NavTop></NavTop>
      </Header>
      <Content>
        <Grid>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col sm={16}>
              <DataBoxCSV title="Data" footerMessage="Paste CSV data here" />
            </Col>
            <Col sm={8}>
              <DataBoxDataType
                title="Data Types"
                footerMessage="Optional data types (JSON)"
                mode="json"
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col sm={24}>
              <DatasetBox />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col sm={12}>
              <DataBoxMapper title={'Mapper'} />
            </Col>
            <Col sm={12}>
              <DataBoxMappingConfig title={'Mapping configuration'} />
            </Col>
          </Row>
        </Grid>
        <Computer />
      </Content>
    </Container>
  );
}
