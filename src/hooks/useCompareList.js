import {useCallback,useEffect,useState} from 'react'
import {MAX_COMPARE,normalizeCompareIds} from '../data/comparison.js'

const STORAGE_KEY='powder-files-compare'
const read=()=>{try{return normalizeCompareIds(JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'))}catch{return[]}}

export default function useCompareList(initial=[]){
  const [ids,setIds]=useState(()=>normalizeCompareIds(initial.length?initial:read()))
  useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(ids))},[ids])
  const toggle=useCallback(id=>setIds(current=>current.includes(id)?current.filter(value=>value!==id):current.length<MAX_COMPARE?[...current,id]:current),[])
  const remove=useCallback(id=>setIds(current=>current.filter(value=>value!==id)),[])
  const clear=useCallback(()=>setIds([]),[])
  return {ids,setIds,toggle,remove,clear,full:ids.length>=MAX_COMPARE}
}
