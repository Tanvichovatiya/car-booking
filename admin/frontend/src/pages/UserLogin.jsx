import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import userApi from '../userApi'
import '../styles.css'

export default function UserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      return setError('Email and password required')
    }

    setLoading(true)
    try {
      const { data } = await userApi.post('/auth/login', { email, password })
      localStorage.setItem('user_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/user/cars')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h2>User Login</h2>
        {error && <div className="error">{error}</div>}
        
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/user/register">Register</Link>
        </p>
      </form>
    </div>
  )
}
