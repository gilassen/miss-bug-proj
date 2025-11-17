
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { AdminPage } from './cmps/AdminPage.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { UserIndex } from './pages/UserIndex.jsx'
import { UserDetails } from './pages/UserDetails.jsx'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'

export function App() {
    return (
        <Router>
            <AppHeader />
            <main className='container'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/bug' element={<BugIndex />} />
                    <Route path='/bug/:bugId' element={<BugDetails />} />
                    <Route path='/about' element={<AboutUs />} />
                    <Route path="/user" element={<UserIndex />} />
                    <Route path="/user/:userId" element={<UserDetails />} />
                    <Route path="/profile" element={<UserDetails />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </main>
            <AppFooter />
        </Router>
    )
}
