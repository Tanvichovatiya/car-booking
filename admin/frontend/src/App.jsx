import React from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserLogin from './pages/UserLogin'
import UserRegister from './pages/UserRegister'
import UserDashboard from './pages/UserDashboard'

const AdminProtected = ({ children }) => {
  const token = localStorage.getItem('admin_token')
  return token ? children : <Navigate to="/login" />
}

const UserProtected = ({ children }) => {
  const token = localStorage.getItem('user_token')
  return token ? children : <Navigate to="/user/login" />
}

const AdminLogin = () => {
  const token = localStorage.getItem('admin_token')
  return token ? <Navigate to="/" /> : <Login />
}

const UserLoginPage = () => {
  const token = localStorage.getItem('user_token')
  return token ? <Navigate to="/user/cars" /> : <UserLogin />
}

const Home = () => {
  const navigate = useNavigate()

  // If admin is logged in, redirect to dashboard
  const adminToken = localStorage.getItem('admin_token')
  if (adminToken) {
    return <Navigate to="/dashboard" />
  }

  // If user is logged in, redirect to user dashboard
  const userToken = localStorage.getItem('user_token')
  if (userToken) {
    return <Navigate to="/user/cars" />
  }

  return (
    <div className="container">
      <div className="card" style={{ width: 420 }}>
        <h2 style={{ margin: 0 }}>Welcome to Car Booking</h2>
        <p style={{ color: '#666', marginTop: 8 }}>Manage cars and bookings easily.</p>

        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          <button className="primary" onClick={() => navigate('/login')}>
            Login as Admin
          </button>

          <button onClick={() => navigate('/user/register')} style={{ padding: '8px 12px' }}>
            Register as User
          </button>
        </div>

        <p style={{ marginTop: 12, color: '#999', fontSize: 13 }}>Click a button to continue.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Admin Routes */}
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/dashboard/*"
        element={
          <AdminProtected>
            <Dashboard />
          </AdminProtected>
        }
      />

      {/* User Routes */}
      <Route path="/user/login" element={<UserLoginPage />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route
        path="/user/*"
        element={
          <UserProtected>
            <UserDashboard />
          </UserProtected>
        }
      />
    </Routes>
  )
}