import React, { useCallback, useContext} from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import testDsv from '!raw-loader!./data/titanic.tsv'
import { dispersionMapper, groupMapper, groupAggregateMapper } from './exampleConfigs'
import { config } from "ace-builds";
import pick from 'lodash/pick'

function parseSeparator(separator){
  if(separator === '\t'){
    return '\\t'
  }
  return separator
}



const groupAggregateMapping = {
  x: {
    value: 'Fare',
    config: {
      aggregation: 'mean',
    }
  },
  y: {
    value: 'Age',
  },
  groupAgg: {
    value: ['Gender', 'Destination']
  },

}

const EMPTY_PIPELINE = {
  data: testDsv,

  loaders: [{ type: "dsv", separator: parseSeparator("\t") }],

  parser: {
    dataTypes: null
  },

  mapping: {
    mapper: groupAggregateMapper,
    config: groupAggregateMapping
  },

  parseDatasetResults : null,
  mapperResults : null,

};

const PipelineContext = React.createContext();
const PipelineResultsContext = React.createContext();
const PipelineMapperResultsContext = React.createContext();
const PipelineStateContext = React.createContext();
const PipelineActionsContext = React.createContext();


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
    case "SET_MAPPING_CONFIG": {
      return { ...state, mapping: {...state.mapping, config: action.payload} };
    }
    case "SET_MAPPER_RESULTS": {
      return { ...state, mapperResults: action.payload };
    }
    default: {
      throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}

export function PipelineProvider(props) {
  const [state, dispatch] = React.useReducer(pipelineReducer, EMPTY_PIPELINE);
  const value = React.useMemo(() => [state, dispatch], [state]);
  return <PipelineContext.Provider value={value} {...props} />;
}


export function PipelineStateProvider(props) {
  const [state, dispatch] = useContext(PipelineContext)
  const value = React.useMemo(() => pick(state, ['data', 'loaders', 'parser', 'mapping']), [state]);
  return <PipelineStateContext.Provider value={value} {...props} />;
}

export function PipelineResultsProvider(props) {
  const [state, dispatch] = useContext(PipelineContext)
  const value = React.useMemo(() => pick(state, ['parseDatasetResults']), [state]);
  return <PipelineResultsContext.Provider value={value} {...props} />;
}

export function PipelineMapperResultsProvider(props) {
  const [state, dispatch] = useContext(PipelineContext)
  const value = React.useMemo(() => pick(state, ['mapperResults']), [state]);
  return <PipelineMapperResultsContext.Provider value={value} {...props} />;
}



export function PipelineActionsProvider(props) {
  const [state, dispatch] = useContext(PipelineContext)
  

  const setData = useCallback(data => dispatch({ type: "SET_DATA", payload: data }), [dispatch]) 
  const setLoaders = useCallback(loaders =>
    dispatch({ type: "SET_LOADERS", payload: loaders }), [dispatch])
  const setDataTypes = useCallback(dataTypes => dispatch({ type: "SET_DATA_TYPES", payload: dataTypes }), [dispatch]);
  const setMapper = useCallback(mapper => dispatch({ type: "SET_MAPPER", payload: mapper }), [dispatch])
  const setMappingConfig = useCallback(config => dispatch({ type: "SET_MAPPING_CONFIG", payload: config }), [dispatch])
  const setParseDatasetResults = useCallback(results => dispatch({ type: "SET_PARSE_DATASET_RESULTS", payload: results }), [dispatch]) 
  const setMapperResults = useCallback(results => dispatch({ type: "SET_MAPPER_RESULTS", payload: results }), [dispatch]) 
  
  const value = React.useMemo(() => ({
    setData,
    setLoaders,
    setParseDatasetResults,
    setDataTypes,
    setMapper,
    setMappingConfig,
    setMapperResults,
    
  }), [setData, setDataTypes, setLoaders, setMapper, setMappingConfig, setParseDatasetResults]);

  return <PipelineActionsContext.Provider value={value} {...props} />;
}



export function usePipelineState() {
  const context = React.useContext(PipelineStateContext);
  if (!context) {
    throw new Error(`usePipeline must be used within a PipelineStateProvider`);
  }
  return context
}



export function usePipelineActions() {
  const context = React.useContext(PipelineActionsContext);
  if (!context) {
    throw new Error(`usePipeline must be used within a PipelineActionsProvider`);
  }
  return context
}


export function usePipelineResults() {
  const context = React.useContext(PipelineResultsContext);
  if (!context) {
    throw new Error(`usePipeline must be used within a PipelineResultsProvider`);
  }
  return context
}

export function usePipelineMapperResults() {
  const context = React.useContext(PipelineMapperResultsContext);
  if (!context) {
    throw new Error(`usePipeline must be used within a PipelineMapperResultsProvider`);
  }
  return context
}