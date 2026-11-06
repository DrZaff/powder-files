import {Link} from 'react-router-dom'
import {Compass,MountainSnow} from 'lucide-react'

export function PlaceholderPage({eyebrow,title,copy}){return <section className="placeholder-page"><div className="contour-lines"/><div className="container"><span className="eyebrow light">{eyebrow}</span><h1>{title}</h1><p>{copy}</p><div className="placeholder-card"><Compass/><strong>Preview foundation ready</strong><span>This destination will be developed in a later milestone.</span><Link className="button button-light" to="/">Return home</Link></div></div></section>}
export function NotFound(){return <main className="not-found"><MountainSnow/><span className="eyebrow">Trail not found</span><h1>That route isn’t on the map.</h1><p>The page may have moved, or the link may no longer be available.</p><Link className="button button-primary" to="/">Return home</Link></main>}
