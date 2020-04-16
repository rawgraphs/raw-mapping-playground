// eslint-disable-next-line import/no-webpack-loader-syntax
import testDsv from "!raw-loader!./data/titanic.tsv";
import {
  dispersionMapper,
  dispersionMapping,
  groupMapper,
  groupMapping,
  groupAggregateMapper,
  groupAggregateMapping,
} from "./exampleConfigs";

function parseSeparator(separator) {
  if (separator === "\t") {
    return "\\t";
  }
  return separator;
}

export const DISPERSION_PIPELINE_STATE = {
  data: testDsv,

  loaders: [{ type: "dsv", separator: parseSeparator("\t") }],

  parser: {
    dataTypes: null,
  },

  mapping: {
    mapper: dispersionMapper,
    config: dispersionMapping,
  },
};

export const GROUP_PIPELINE_STATE = {
  data: testDsv,

  loaders: [{ type: "dsv", separator: parseSeparator("\t") }],

  parser: {
    dataTypes: null,
  },

  mapping: {
    mapper: groupMapper,
    config: groupMapping,
  },
};

export const GROUP_AGGREGATE_STATE = {
  data: testDsv,

  loaders: [{ type: "dsv", separator: parseSeparator("\t") }],

  parser: {
    dataTypes: null,
  },

  mapping: {
    mapper: groupAggregateMapper,
    config: groupAggregateMapping,
  },
};
