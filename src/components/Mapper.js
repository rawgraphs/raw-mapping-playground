import React, { useEffect, useMemo, useContext } from "react";
import {
  usePipelineState,
  usePipelineActions,
  usePipelineResults,
} from "../state";
import get from "lodash/get";
import { validateMapping, makeMapper } from "raw-lib";

export default function Mapper() {
  const { setMapperResults, setComputing } = usePipelineActions();

  const { mapping, data } = usePipelineState();
  const { parseDatasetResults } = usePipelineResults();

  useEffect(() => {
    if (
      !mapping.config ||
      !mapping.mapper ||
      !get(parseDatasetResults, "dataset" || !data)
    ) {
      return;
    }
    try {
      setComputing(true);
      validateMapping(mapping.mapper, mapping.config);
      const mapper = makeMapper(mapping.mapper, mapping.config);
      const mappedData = mapper(parseDatasetResults.dataset);
      setMapperResults(mappedData);
      setComputing(false);
    } catch (err) {
      console.error(err);
      setComputing(false);
    }
  }, [
    mapping.config,
    mapping.mapper,
    parseDatasetResults,
    setMapperResults,
    data,
    setComputing,
  ]);

  return null;
}
