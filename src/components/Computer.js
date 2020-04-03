import React, { useEffect, useMemo } from 'react'
import { usePipeline } from '../state'
import { dsvFormat, tsvParse } from "d3-dsv";
import get from 'lodash/get'
import { parseDataset } from 'raw-lib'


function getLoader(loaders){
  console.log("loader getter", loaders)
  const loaderCfg = get(loaders, '[0]')
  if(!loaderCfg){
    return null
  }

  if (loaderCfg.type === 'dsv'){
    const separator = get(loaderCfg, 'separator', ',')
    // console.log("sep", separator,  String.raw({raw:separator}) === '\t', separator.length)
    if(separator === '\\t'){
      return dsvFormat("\t").parse
    }
    
    return dsvFormat(separator).parse
  }

  return null

}


export default function Computer(){

  const pipeline = usePipeline()

  const { state } = pipeline
  const { data, loaders } = state

  const loader = useMemo(() => {
    return getLoader(loaders)
  }, [loaders])

  const rawDataset = useMemo(() => {
    if(!data || !loader){
      return []
    }
    return loader(data)

  }, [data, loader])

  
  useEffect(() => {
    const [dataset, dataTypes, errors] = parseDataset(rawDataset, pipeline.state.parser.dataTypes)
    console.log("123", pipeline.state.parser.dataTypes)
    const results = {
      dataset,
      dataTypes,
      errors,
    }
    pipeline.setParseDatasetResults(results, dataTypes)
  }, [rawDataset,  pipeline.state.parser.dataTypes])


  return null



}