import React, { useEffect, useMemo, useContext } from "react";
import {
  usePipelineState,
  usePipelineActions,
  usePipelineResults,
} from "../state";
import get from "lodash/get";
import { validateMapping, makeMapper } from "raw-lib";

export default function Mapper() {
  const { setMapperResults, setComputing, setMapperError } = usePipelineActions();

  const { mapping, data } = usePipelineState();
  const { parseDatasetResults } = usePipelineResults();

  useEffect(() => {
    if (
      !mapping.config ||
      !mapping.mapper ||
      !get(parseDatasetResults, "dataset" || !data)
    ) {
      setMapperError(null)
      return;
    }
    try {
      setComputing(true);
      validateMapping(mapping.mapper, mapping.config);
      const mapper = makeMapper(mapping.mapper, mapping.config);
      const mappedData = mapper(parseDatasetResults.dataset);
      setMapperResults(mappedData);
      setComputing(false);
      setMapperError(null)
    } catch (err) {
      console.error(err);
      setComputing(false);
      setMapperError(err)
    }
  }, [mapping.config, mapping.mapper, parseDatasetResults, setMapperResults, data, setComputing, setMapperError]);

  return null;
}
