import './App.css'
import { Routes, Route } from 'react-router'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import DashboardLayout from './layout/DashboardLayout'
import Services from './pages/services/Services'
import Project from './pages/project/Project'
import SiteManagement from './pages/sitesetting/SiteManagement'


function App() {

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/admin/dashboard' element={<DashboardLayout />}>
        <Route path='' element={<Dashboard />} />
        <Route path='services' element={<Services />} />
        <Route path='projects' element={<Project />} />
        <Route path='site-management' element={<SiteManagement />} />
      </Route>
    </Routes>
  )
}

export default App
