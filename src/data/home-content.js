export const itineraries = [
  { days:3,title:'A long weekend in the Finger Lakes',author:'Maya R.',stops:'Bristol Mountain · Canandaigua',cost:'$680',tone:'pine' },
  { days:5,title:'Vermont sampler for first-timers',author:'Theo K.',stops:'Stowe · Sugarbush',cost:'$1,240',tone:'blue' },
  { days:4,title:'Adirondack powder & Olympic history',author:'Jordan L.',stops:'Whiteface · Lake Placid',cost:'$920',tone:'amber' },
]
export const reviews = [
  { quote:'The kind of home mountain that rewards a midweek escape. Excellent snowmaking and a surprisingly long fall line.',name:'Elena M.',meta:'Bristol Mountain · illustrative example',rating:5 },
  { quote:'Easy to navigate with kids, and the sunset from the upper mountain was worth staying for night skiing.',name:'Chris T.',meta:'Bristol Mountain · illustrative example',rating:4 },
]
export const featuredMountain={
  id:'wikidata:item:Q1548153',name:'Heavenly',place:'Lake Tahoe · California / Nevada',
  eyebrow:'Featured mountain',
  summary:'Heavenly rises directly above Lake Tahoe and crosses the California–Nevada state line. Four base areas feed a sprawling, intermediate-friendly mountain, while Gunbarrel’s long mogul pitches and a substantial advanced share keep the upper terrain compelling for stronger skiers.',
  facts:[['Skiable terrain','4,800 acres'],['Trails','111'],['Lifts','28'],['Average snowfall','251 in']],
  source:'https://www.skiheavenly.com/the-mountain/about-the-mountain/mountain-info.aspx',reviewed:'6 Nov 2026',
  trailImage:'/data/trails/wikidata_item_Q1548153.svg',
  to:'/resorts/guide/wikidata%3Aitem%3AQ1548153',
}
// 2026–27 season calendar for the home page's raised card. Every date comes from the resort's own
// published schedule (Batch 028, checked 6 Nov 2026). An open end means the resort hasn't published a closing date.
// Status labels are re-evaluated against today's date (see heroStatus); the card hides after validUntil.
const guide=id=>`/resorts/guide/${encodeURIComponent(id)}`
export const seasonCalendar={
  title:'Season 2026–27',window:{start:'2026-11-01',end:'2027-05-31'},validUntil:'2027-05-31',
  resorts:[
    {name:'Valle Nevado',place:'Chile',to:guide('wikidata:item:Q3051592'),tone:'open',
      segments:[{from:'2026-11-01',to:'2026-12-01'}],note:'Extended to 1 Dec',
      status:{state:'open_now',checked_at:'2026-11-06',recheck_by:'2026-11-20',season_end:'2026-12-01',source_url:'https://www.vallenevado.com/es/extension-temporada-2/'}},
    {name:'Les 2 Alpes',place:'France',to:guide('wikidata:item:Q974478'),tone:'violet',
      segments:[{from:'2026-11-28',to:'2027-05-02'},{from:'2027-05-03',to:'2027-05-30',soft:true}],note:'Glacier to 30 May',
      status:{state:'announced',checked_at:'2026-11-06',opening_date:'2026-11-28',source_url:'https://www.les2alpes.com/hiver/skier-aux-2-alpes/'}},
    {name:'Courmayeur',place:'Italy',to:guide('wikidata:item:Q110821425'),tone:'gold',
      segments:[{from:'2026-11-28',to:'2027-04-11'}],
      status:{state:'announced',checked_at:'2026-11-06',opening_date:'2026-11-28',source_url:'https://www.courmayeur-montblanc.com/'}},
    {name:'LAAX',place:'Switzerland',to:guide('openstreetmap:way:599441663'),tone:'amber',
      segments:[{from:'2026-11-28',to:null}],note:'Closing date not published',
      status:{state:'announced',checked_at:'2026-11-06',opening_date:'2026-11-28',source_url:'https://www.laax.com/en'}},
    {name:'Livigno',place:'Italy',to:guide('wikidata:item:Q110811619'),tone:'cyan',
      segments:[{from:'2026-11-28',to:null}],note:'Closing date not published',
      status:{state:'announced',checked_at:'2026-11-06',opening_date:'2026-11-28',source_url:'https://www.skipasslivigno.com/en/events/free-ski-pass-livigno-december-2026-winter-season-opening/'}},
    {name:'La Clusaz',place:'France',to:guide('wikidata:item:Q530721'),tone:'teal',
      segments:[{from:'2026-12-05',to:'2026-12-06'},{from:'2026-12-12',to:'2027-04-25'}],note:'Opening weekend, then daily from 12 Dec',
      status:{state:'announced',checked_at:'2026-11-06',opening_date:'2026-12-05',source_url:'https://www.laclusaz.com/ski/ski-alpin/'}},
  ],
}
const DAY_MS=864e5
export const heroDate=value=>new Date(`${value}T12:00:00`)
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
