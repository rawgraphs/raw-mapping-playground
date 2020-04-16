import React, { useEffect, useMemo, useContext } from 'react'
import { usePipelineState, usePipelineActions, usePipelineResults } from '../state'
import { dsvFormat, tsvParse } from "d3-dsv";
import get from 'lodash/get'
import { validateMapping, makeMapper } from 'raw-lib'

 


export default function Mapper(){

  const { setMapperResults } = usePipelineActions()

  const { mapping, data } =  usePipelineState()
  const { parseDatasetResults } = usePipelineResults()
  
  useEffect(() => {
    if(!mapping.config || !mapping.mapper || !get(parseDatasetResults, 'dataset' || !data)){
      return
    }
    try{
      validateMapping(mapping.mapper, mapping.config)  
      const mapper = makeMapper(mapping.mapper, mapping.config)
      const mappedData = mapper(parseDatasetResults.dataset)
      setMapperResults(mappedData)
      
    } catch(err){
      console.error(err)
    }
  }, [mapping.config, mapping.mapper, parseDatasetResults, setMapperResults, data])


  return null



}