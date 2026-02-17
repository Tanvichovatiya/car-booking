import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import userApi from '../userApi'
import '../styles.css'

export default function UserRegister() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name || !formData.email || !formData.password) {
      return setError('Name, email, and password are required')
    }

    setLoading(true)
    try {
      const { data } = await userApi.post('/auth/register', formData)
      localStorage.setItem('user_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/user/cars')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <div className="error">{error}</div>}
        
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
        />
        
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
        />
        
        <label>Phone (Optional)</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1234567890"
        />
        
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </button>
        
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/user/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
