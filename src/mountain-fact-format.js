export function formatMountainFact(fact){
 if(fact.status==='conflict')return 'Needs review'
 if(fact.value===null||fact.value===undefined)return 'Not yet sourced'
 if(typeof fact.value==='string'&&fact.value.trim())return fact.value.trim()
 if(!Number.isFinite(Number(fact.value)))return 'Not yet sourced'
 const qualifier=fact.qualifier==='>'||fact.qualifier==='more_than'?'Over ':fact.qualifier==='~'||fact.qualifier==='approximately'?'About ':''
 return `${qualifier}${Number(fact.value).toLocaleString()}${fact.qualifier==='+'?'+':''}${fact.unit==='%'?'':' '}${fact.unit}`.trim()
}
