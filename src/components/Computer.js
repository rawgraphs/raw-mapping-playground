import React, { useEffect, useMemo } from "react";
import { usePipelineState, usePipelineActions } from "../state";
import { dsvFormat, tsvParse } from "d3-dsv";
import get from "lodash/get";
import { parseDataset } from "raw-lib";

function getLoader(loaders) {
  const loaderCfg = get(loaders, "[0]");
  if (!loaderCfg) {
    return null;
  }

  if (loaderCfg.type === "dsv") {
    const separator = get(loaderCfg, "separator", ",");
    if (separator === "\\t") {
      return dsvFormat("\t").parse;
    }

    return dsvFormat(separator).parse;
  }

  return null;
}

export default function Computer() {
  const { setParseDatasetResults, setComputing } = usePipelineActions();

  const { data, loaders, parser } = usePipelineState();

  const loader = useMemo(() => {
    return getLoader(loaders);
  }, [loaders]);

  // const rawDataset = useMemo(() => {

  //   // setComputing(true)
  //   const d = loader(data)
  //   // setComputing(false)
  //   return d

  // }, [data, loader])

  useEffect(() => {
    if (!data || !loader) {
      return;
    }

    setComputing(true);
    const rawDataset = loader(data);
    const [dataset, dataTypes, errors] = parseDataset(
      rawDataset,
      parser.dataTypes
    );

    const results = {
      dataset,
      dataTypes,
      errors,
    };
    setParseDatasetResults(results);
    setComputing(false);
  }, [parser.dataTypes, setParseDatasetResults, setComputing, data, loader]);

  return null;
}
