import React from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import testDsv from '!raw-loader!./data/titanic.tsv'
import { dispersionMapper } from './exampleConfigs'

function parseSeparator(separator){
  if(separator === '\t'){
    return '\\t'
  }
  return separator
}


const EMPTY_PIPELINE = {
  data: testDsv,

  loaders: [{ type: "dsv", separator: parseSeparator("\t") }],

  parser: {
    dataTypes: null
  },

  mapping: {
    mapper: dispersionMapper,
    config: {}
  },

  parseDatasetResults : null,

};

const PipelineContext = React.createContext();


function pipelineReducer(state, action) {
  switch (action.type) {
    case "SET_DATA": {
      return { ...state, data: action.payload };
    }
    case "SET_DATA_TYPES": {
      return { ...state, parser: {...state.parser, dataTypes:action.payload} };
    }
    case "SET_LOADERS": {
      const loaders = action.payload.map(item => ({...item, separator: parseSeparator(item.separator)}))
      return { ...state, loaders: loaders };
    }
    case "SET_PARSE_DATASET_RESULTS": {
      return { ...state, parseDatasetResults: action.payload };
    }
    case "SET_MAPPER": {
      return { ...state, mapping: {...state.mapping, mapper: action.payload} };
    }
    default: {
      throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}

export function PipelineProvider(props) {
  const [state, dispatch] = React.useReducer(pipelineReducer, EMPTY_PIPELINE);
  console.log("state", state)
  const value = React.useMemo(() => [state, dispatch], [state]);
  return <PipelineContext.Provider value={value} {...props} />;
}

export function usePipeline() {
  const context = React.useContext(PipelineContext);
  if (!context) {
    throw new Error(`usePipeline must be used within a PipelineProvider`);
  }
  const [state, dispatch] = context;
  const setData = data => dispatch({ type: "SET_DATA", payload: data });
  const setLoaders = loaders =>
    dispatch({ type: "SET_LOADERS", payload: loaders });
  const setParseDatasetResults = results => dispatch({ type: "SET_PARSE_DATASET_RESULTS", payload: results });
  const setDataTypes = dataTypes => dispatch({ type: "SET_DATA_TYPES", payload: dataTypes });

  const setMapper = mapper => dispatch({ type: "SET_MAPPER", payload: mapper });



  return {
    state,
    dispatch,
    setData,
    setLoaders,
    setParseDatasetResults,
    setDataTypes,
    setMapper,
  };
}
