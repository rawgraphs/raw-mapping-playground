import React, { useEffect, useMemo, useContext } from 'react'
import { usePipelineState, usePipelineActions, usePipelineResults } from '../state'
import { dsvFormat, tsvParse } from "d3-dsv";
import get from 'lodash/get'
import { validateMapping, makeMapper } from 'raw-lib'

 


export default function Mapper(){

  const { setMapperResults } = usePipelineActions()

  const { mapping } =  usePipelineState()
  const { parseDatasetResults } = usePipelineResults()

  

  console.log("mapping", mapping)
  
  
  useEffect(() => {
    if(!mapping.config || !get(parseDatasetResults, 'dataset')){
      return
    }
    try{
      validateMapping(mapping.mapper, mapping.config)  
      console.log("mapping ok!")
      const mapper = makeMapper(mapping.mapper, mapping.config)
      const mappedData = mapper(parseDatasetResults.dataset)
      console.log("mappedData", mappedData)
      setMapperResults(mappedData)
      
    } catch(err){
      console.error(err)
    }
  }, [mapping.config, mapping.mapper, parseDatasetResults, setMapperResults])


  return null



}