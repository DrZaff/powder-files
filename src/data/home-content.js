export const itineraries = [
  { days:3,title:'A long weekend in the Finger Lakes',author:'Maya R.',stops:'Bristol Mountain · Canandaigua',cost:'$680',tone:'pine' },
  { days:5,title:'Vermont sampler for first-timers',author:'Theo K.',stops:'Stowe · Sugarbush',cost:'$1,240',tone:'blue' },
  { days:4,title:'Adirondack powder & Olympic history',author:'Jordan L.',stops:'Whiteface · Lake Placid',cost:'$920',tone:'amber' },
]
export const reviews = [
  { quote:'The kind of home mountain that rewards a midweek escape. Excellent snowmaking and a surprisingly long fall line.',name:'Elena M.',meta:'Bristol Mountain · illustrative example',rating:5 },
  { quote:'Easy to navigate with kids, and the sunset from the upper mountain was worth staying for night skiing.',name:'Chris T.',meta:'Bristol Mountain · illustrative example',rating:4 },
]
// Featured resorts shared by the desktop holographic panel and the mobile "Featured now" strip.
// Facts come from Batch 028 official sources; status is re-evaluated against today's date (see heroStatus).
export const featuredResorts=[
  {id:'wikidata:item:Q3051592',name:'Valle Nevado',short:'Valle Nevado',place:'Chile',to:'/resorts/guide/wikidata%3Aitem%3AQ3051592',x:71,y:29,
    summary:'Extended season to Dec 1',
    status:{state:'open_now',checked_at:'2026-11-06',recheck_by:'2026-11-20',season_end:'2026-12-01',source_url:'https://www.vallenevado.com/es/extension-temporada-2/'},
    facts:[{label:'Season',value:'Extended to 1 Dec 2026'},{label:'Opened',value:'1988'}]},
  {id:'wikidata:item:Q110811619',name:'Livigno',short:'Livigno',place:'Italy',to:'/resorts/guide/wikidata%3Aitem%3AQ110811619',x:39,y:51,
    summary:'Over 115 km · 31 lifts',
    status:{state:'announced',checked_at:'2026-11-06',opening_date:'2026-11-28',source_url:'https://www.skipasslivigno.com/en/events/free-ski-pass-livigno-december-2026-winter-season-opening/'},
    facts:[{label:'Slopes',value:'Over 115 km',scope:'Whole valley'},{label:'Lifts',value:'31',scope:'Whole valley'}]},
  {id:'wikidata:item:Q4251293',name:'Hakuba Happo-one',short:'Happo-one',place:'Japan',to:'/resorts/guide/wikidata%3Aitem%3AQ4251293',x:63,y:70,
    summary:'1,831 m lift-served top',
    status:{state:'announced',label:'2026–27 season announced',checked_at:'2026-11-06',source_url:'https://www.happo-one.jp/en/news/39750/'},
    facts:[{label:'Top lift',value:'1,831 m',scope:'Lift-served'},{label:'Longest course',value:'8,000 m'}]},
]
const DAY_MS=864e5
const heroDate=value=>new Date(`${value}T12:00:00`)
export const formatHeroDate=(value,options={day:'numeric',month:'short'})=>heroDate(value).toLocaleDateString('en-GB',options)
// Status rules: never "Closed"; expire "Open now" at recheck_by/season_end; anything checked more than 45 days ago is unconfirmed.
export function heroStatus(status,now=new Date()){
  const unconfirmed={state:'unconfirmed',label:'Season dates not confirmed'}
  if(!status?.checked_at||(now-heroDate(status.checked_at))/DAY_MS>45)return unconfirmed
  if(status.state==='open_now'){
    if((status.recheck_by&&now>heroDate(status.recheck_by))||(status.season_end&&now>heroDate(status.season_end)))return unconfirmed
    return {state:'open_now',label:'Open now'}
  }
  if(status.state==='announced'){
    if(!status.opening_date)return {state:'announced',label:status.label||'Season announced'}
    const opens=formatHeroDate(status.opening_date)
    return {state:'announced',label:now<heroDate(status.opening_date)?`Opens ${opens}`:`Scheduled to open ${opens}`}
  }
  return unconfirmed
}
