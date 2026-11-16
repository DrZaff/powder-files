export const MAX_COMPARE=4

export const comparisonRows=[
  {id:'season',label:'Season status',type:'season'},
  {id:'vertical',label:'Published vertical',keys:['vertical']},
  {id:'skiing_elevation',label:'Lift-served elevation',keys:['skiing_elevation']},
  {id:'summit',label:'Summit elevation',keys:['summit']},
  {id:'terrain_area',label:'Skiable terrain',keys:['terrain_area','area']},
  {id:'piste_length',label:'Marked pistes',keys:['piste_length']},
  {id:'trails',label:'Runs / trails',keys:['trails']},
  {id:'lifts',label:'Lifts',keys:['lifts']},
  {id:'snowfall',label:'Published snowfall',keys:['snowfall']},
  {id:'longest_run',label:'Longest run',keys:['longest_run']},
  {id:'difficulty_mix',label:'Difficulty mix',keys:['difficulty_mix']},
]

export function findFact(resort,row){
  if(row.type==='season')return null
  return row.keys.map(key=>resort.mf?.find(fact=>fact.key===key)).find(Boolean)||null
}

export function isComparable(facts){
  const present=facts.filter(Boolean)
  if(present.length<2||present.some(f=>f.status==='conflict'||f.qualifier==='disputed'))return false
  const scopes=new Set(present.map(f=>f.scope||'local_resort'))
  const labels=new Set(present.map(f=>f.label?.toLocaleLowerCase()))
  const units=new Set(present.map(f=>f.unit||''))
  return scopes.size===1&&labels.size===1&&units.size===1
}

export function normalizeCompareIds(values=[]){
  return [...new Set(values.filter(Boolean))].slice(0,MAX_COMPARE)
}

export function scopeLabel(scope){
  return ({linked_domain:'Whole domain',lift_served:'Lift-served',named_run:'Single run',hike_to:'Hike-to',other:'Special scope'})[scope]||null
}
