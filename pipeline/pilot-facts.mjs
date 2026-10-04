// Manually transcribed factual observations, not copied descriptions or images.
const checked='2026-08-30'
const bristol='https://www.bristolmountain.com/about-the-mountain/'
const stowe='https://www.stowe.com/the-mountain/about-the-mountain/mountain-info.aspx'
const stoweFaq='https://www.stowe.com/Explore%20the%20Resort/About%20the%20Resort/Guest%20Services.aspx'
const cardrona='https://cardrona-treblecone.com/mountains'
function fact(key,label,value,unit,source,note='',status='source_checked'){return {key,label,value,unit,source,retrieved_at:checked,source_published_at:null,status,confidence:status==='conflict'?'low':'medium',note}}
export const pilotFacts={
  'powderfiles:verified:bristol-mountain':[
    fact('vertical','Vertical rise',1200,'ft',bristol),
    fact('area','Skiable terrain',138,'acres',bristol,'Published total includes Nordic terrain; downhill-only acreage is not supplied.'),
    fact('trails','Slopes and trails',39,'',bristol,'Resort-reported combined count.'),
    fact('snowmaking','Snowmaking coverage',100,'%',bristol),
    fact('lighting','Trail lighting',97,'%',bristol,'During the night operating season.'),
  ],
  'wikidata:item:Q7620695':[
    fact('area','Skiable terrain',485,'acres',stowe),
    fact('trails','Trails',116,'',stowe),
    fact('summit','Mountain summit',4395,'ft',stowe,'Mountain summit, not the highest skiing elevation.'),
    fact('skiing_elevation','Highest skiing elevation',3625,'ft',stowe),
    fact('lifts','Lifts',12,'',stowe),
    fact('base','Base skiing elevation',1280,'ft',stoweFaq),
    fact('vertical','Advertised vertical drop',2160,'ft',stoweFaq,'Published FAQ value; not calculated from elevations.'),
    {...fact('snowfall','Average annual snowfall',null,'in',stowe,'Official mountain page reports 314 inches; official FAQ reports 333 inches. Withheld pending clarification.','conflict'),alternatives:[{value:314,source:stowe},{value:333,source:stoweFaq}]},
  ],
  'wikidata:item:Q5038784':[
    fact('vertical','Vertical rise',600,'m',cardrona,'Do not calculate from the base-area elevation; it is not the lowest skiing point.'),
    fact('area','Skiable terrain',615,'ha',cardrona,'Total across five basins; includes Soho expansion. One passage says over 615 ha.'),
    fact('trails','Groomable runs',47,'',cardrona,'Groomable runs, not all possible ski routes.'),
    fact('skiing_elevation','Highest lifted point',1860,'m',cardrona),
    fact('base','Base area elevation',1670,'m',cardrona,'Base facilities elevation, not necessarily bottom of lift-served terrain.'),
    fact('chairlifts','Chairlifts',6,'',cardrona,'Other lifts: three carpets, one T-bar and one platter tow.'),
  ],
}
export function applyPilotFacts(records){
  for(const [id,observations] of Object.entries(pilotFacts)){
    const record=records.find(r=>r.stable_id===id)
    if(!record)throw new Error(`Pilot resort missing: ${id}`)
    record.mountain_observations=structuredClone(observations)
    for(const observation of observations)record.field_provenance[`mountain.${observation.key}`]={...structuredClone(observation),source_record_ids:[observation.source]}
    for(const url of new Set(observations.flatMap(o=>[o.source,...(o.alternatives||[]).map(a=>a.source)])))record.source_records.push({source:'official_resort',record_id:url,url,license:'factual-observations-only; page copyright retained by publisher',collected_at:checked})
  }
}
