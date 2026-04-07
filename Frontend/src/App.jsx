import { useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AuthLoader from './components/AuthLoader'
import Login from './pages/Login'
import HRDashboard from './pages/HRDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import SuperAdminPanel from './pages/AdminDashboard'
import Home from './pages/Home'

function App() {
  return (
    <>
    <BrowserRouter>
    <AuthLoader>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin/dashboard" element={<SuperAdminPanel />} />
      </Route>
    </Routes>
    </AuthLoader>
    </BrowserRouter>
    </>
  )
}

export default App
