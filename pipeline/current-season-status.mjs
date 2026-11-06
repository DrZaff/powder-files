const checked='2026-11-06'
const status=(state,label,source_url,extra={})=>({state,label,checked_at:checked,source_url,...extra})
const statuses=new Map([
 ['wikidata:item:Q1548153',status('announced','Opens 20 Nov 2026','https://www.skiheavenly.com/explore-the-resort/about-the-resort/hours-of-operation.aspx',{opening_date:'2026-11-20'})],
 ['wikidata:item:Q4251293',status('announced','2026–27 season announced','https://www.happo-one.jp/en/news/39750/')],
 ['wikidata:item:Q109412412',status('announced','2026–27 season announced','https://www.skitaos.com/')],
 ['wikidata:item:Q1547750',status('announced','2026–27 season announced','https://www.sugarloaf.com/')],
 ['openstreetmap:way:866496711',status('announced','2026–27 season announced','https://www.skihood.com/explore/help/FAQ')],
 ['wikidata:item:Q1231413',status('not_confirmed','Season dates not confirmed','https://mont-sainte-anne.com/en/mont-sainte-anne-mountain-statistics/')],
 ['wikidata:item:Q2255843',status('announced','Opens 27 Nov 2026','https://www.schweitzer.com/',{opening_date:'2026-11-27'})],
 ['wikidata:item:Q60777517',status('announced','Winter 2027 passes announced','https://www.thredbo.com.au/the-mountain/')],
 ['wikidata:item:Q111983623',status('not_confirmed','Season dates not confirmed','https://www.fallscreek.com.au/?season=winter')],
 ['wikidata:item:Q6919901',status('announced','2027 season announced','https://www.mtbuller.com.au/winter/lift-passes/season-memberships')],
 ['wikidata:item:Q7837389',status('not_confirmed','Season dates not confirmed','https://cardrona-treblecone.com/treblecone')],
 ['wikidata:item:Q167843',status('announced','2027 season announced','https://skiportillo.com/')],
 ['wikidata:item:Q3051592',status('open_now','Open now','https://www.vallenevado.com/es/extension-temporada-2/',{season_end:'2026-12-01',recheck_by:'2026-11-20'})],
 ['wikidata:item:Q214364',status('not_confirmed','Season dates not confirmed','https://www.alpedhuez.com/fr/')],
 ['wikidata:item:Q974478',status('announced','Opens 28 Nov 2026','https://www.les2alpes.com/hiver/skier-aux-2-alpes/',{opening_date:'2026-11-28',season_end:'2027-05-02'})],
 ['wikidata:item:Q530721',status('announced','Opens 5 Dec 2026','https://www.laclusaz.com/ski/ski-alpin/',{opening_date:'2026-12-05',season_end:'2027-04-25'})],
 ['openstreetmap:way:599441663',status('announced','Opens 28 Nov 2026','https://www.laax.com/en',{opening_date:'2026-11-28'})],
 ['wikidata:item:Q138779655',status('announced','Partial opening 28 Nov 2026','https://www.mycma.ch/',{opening_date:'2026-11-28'})],
 ['openstreetmap:way:1362257705',status('not_confirmed','Season dates not confirmed','https://www.engelberg.ch/en/winter/ski-snowboard/')],
 ['openstreetmap:way:508236935',status('announced','2026–27 season announced','https://www.gurgl.com/en/activities/winter/skiing-snowboarding/highlights-in-the-ski-area/night-skiing')],
 ['wikidata:item:Q110811619',status('announced','Opens 28 Nov 2026','https://www.skipasslivigno.com/en/events/free-ski-pass-livigno-december-2026-winter-season-opening/',{opening_date:'2026-11-28'})],
 ['wikidata:item:Q1789966',status('not_confirmed','Season dates not confirmed','https://www.kronplatz.com/news')],
 ['wikidata:item:Q110821425',status('announced','Opens 28 Nov 2026','https://www.courmayeur-montblanc.com/',{opening_date:'2026-11-28',season_end:'2027-04-11'})],
])

export function applyCurrentSeasonStatuses(records,{today=new Date('2026-11-06T12:00:00Z')}={}){let applied=0,downgraded=0;for(const record of records){const evidence=statuses.get(record.stable_id);if(!evidence)continue;const ageDays=(today-new Date(`${evidence.checked_at}T12:00:00Z`))/86400000,seasonEnded=evidence.season_end&&today>new Date(`${evidence.season_end}T23:59:59Z`);record.current_season_status=structuredClone(evidence);if(ageDays>45||seasonEnded){record.current_season_status={state:'not_confirmed',label:'Season dates not confirmed',checked_at:evidence.checked_at,source_url:evidence.source_url,stale:true};downgraded++}record.field_provenance.current_season_status={...record.current_season_status,batch:'official-028-status'};applied++}return{reviewed_at:checked,profiles:applied,downgraded,statuses:Object.fromEntries([...statuses].map(([id,value])=>[id,value.state]))}}

export {statuses as currentSeasonStatuses}
