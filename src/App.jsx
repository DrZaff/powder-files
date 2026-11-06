import {Route,Routes} from 'react-router-dom'
import {SiteLayout} from './components/SiteChrome.jsx'
import Home from './pages/Home.jsx'
import {ResortDirectory} from './pages/Directory.jsx'
import {BristolDetail,ResortFieldGuide} from './pages/FieldGuide.jsx'
import {AuthLayout,CheckEmail,ForgotPassword,Register,ResetPassword,SignIn} from './pages/Auth.jsx'
import {NotFound,PlaceholderPage} from './pages/Misc.jsx'

export default function App(){return <Routes>
  <Route element={<SiteLayout/>}>
    <Route path="/" element={<Home/>}/><Route path="/resorts" element={<ResortDirectory/>}/><Route path="/resorts/bristol-mountain" element={<BristolDetail/>}/><Route path="/resorts/guide/:resortId" element={<ResortFieldGuide/>}/>
    <Route path="/itineraries" element={<PlaceholderPage eyebrow="Community field notes" title="Public itineraries" copy="Explore thoughtful trip plans from skiers who have already mapped the mountain, the meals, and the miles between."/>}/>
    <Route path="/community" element={<PlaceholderPage eyebrow="Built by skiers" title="The Powder Files community" copy="Honest resort reviews and reusable itineraries help every skier arrive better prepared."/>}/>
    <Route path="/about" element={<PlaceholderPage eyebrow="Our mission" title="Less tab-juggling. More mountain time." copy="Powder Files brings reliable resort facts, firsthand reviews, and practical trip plans into one clear field guide."/>}/>
    <Route path="/search" element={<ResortDirectory focusSearch/>}/>
  </Route>
  <Route element={<AuthLayout/>}><Route path="/sign-in" element={<SignIn/>}/><Route path="/register" element={<Register/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/check-email" element={<CheckEmail/>}/><Route path="/reset-password" element={<ResetPassword/>}/></Route>
  <Route path="*" element={<NotFound/>}/>
</Routes>}
