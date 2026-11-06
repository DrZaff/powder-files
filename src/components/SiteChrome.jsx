import {useEffect,useState} from 'react'
import {Link,NavLink,Outlet,useLocation} from 'react-router-dom'
import {ArrowRight,Menu,MountainSnow,Search,Snowflake,X} from 'lucide-react'

export function SiteLayout(){
  const [open,setOpen]=useState(false); const location=useLocation(); const nav=[['Resorts','/resorts'],['Itineraries','/itineraries'],['Community','/community'],['About','/about']]
  useEffect(()=>{window.scrollTo(0,0)},[location.pathname])
  return <div className="site-shell"><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><div className="container header-inner"><Brand/>
    <nav className="desktop-nav" aria-label="Primary navigation">{nav.map(([label,to])=><NavLink key={to} to={to}>{label}</NavLink>)}</nav>
    <div className="header-actions"><Link className="search-link" to="/search"><Search size={18}/><span>Search</span></Link><Link className="button button-small button-light" to="/sign-in">Sign in</Link><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open?'Close menu':'Open menu'}>{open?<X/>:<Menu/>}</button></div></div>
    {open&&<nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">{[...nav,['Search','/search'],['Sign in','/sign-in']].map(([label,to])=><NavLink key={to} to={to} onClick={()=>setOpen(false)}>{label}<ArrowRight size={18}/></NavLink>)}</nav>}
  </header><main id="main"><Outlet/></main><Footer/></div>
}
export function Brand(){return <Link className="brand" to="/" aria-label="Powder Files home"><span className="brand-mark"><MountainSnow size={23}/></span><span>Powder Files</span></Link>}
export function Footer(){return <footer className="footer"><div className="container footer-grid"><div><Brand/><p>Dream big. Plan well. Ski fast.</p></div><div><strong>Explore</strong><Link to="/resorts">Resorts</Link><Link to="/itineraries">Itineraries</Link><Link to="/community">Community</Link></div><div><strong>Powder Files</strong><Link to="/about">Our mission</Link><span>How it works</span><span>Contact</span></div><div className="footer-note"><Snowflake size={20}/><span>Independent field notes for better ski trips.</span></div></div><div className="container footer-bottom"><span>© 2026 Powder Files</span><span>Directory data: Wikidata (CC0) · © OpenStreetMap contributors (ODbL)</span></div></footer>}
