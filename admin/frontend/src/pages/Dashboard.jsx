import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Cars from '../components/Cars'
import Bookings from '../components/Bookings'

export default function Dashboard() {
  const navigate=useNavigate()
  const logout = () => {
    localStorage.removeItem('admin_token')
    window.location.href = '/login'
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>Admin</h3>
        <nav>
          <Link to="/dashboard">Cars</Link>
          <Link to="/dashboard/bookings">Bookings</Link>
        </nav>
        <button className="danger" onClick={logout}>Logout</button>
      </aside>
      <main className="main">
        <Routes>
          <Route index element={<Cars />} />
          <Route path="bookings" element={<Bookings />} />
        </Routes>
      </main>
    </div>
  )
}
