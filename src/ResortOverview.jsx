export default function ResortOverview({overview,compact=false}) {
  if(!overview?.text) return null
  return <div className={`mountain-overview${compact?' mountain-overview-compact':''}`}>
    <span className="overview-label">Mountain character</span>
    <p className="overview-copy">{overview.text}</p>
    <div className="overview-sources"><span>Powder Files summary · </span>{overview.sources.map((url,i)=><a key={url} href={url} target="_blank" rel="noreferrer" aria-label={`Mountain summary source ${i+1}`}>Source{overview.sources.length>1?` ${i+1}`:''} ↗</a>)}{!compact&&<span> · Reviewed {overview.reviewed_at}</span>}</div>
  </div>
}
