import React, { useState } from 'react'
import api from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Provide email and password')
    try {
      const { data } = await api.post('/admin/login', { email, password })
      localStorage.setItem('admin_token', data.token)
      window.location.href = '/'
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="container">
      <form className="card" onSubmit={submit}>
        <h2>Admin Login</h2>
        {error && <div className="error">{error}</div>}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="primary" style={{ marginTop: 12 }}>Login</button>
        
         
      
      </form>
    </div>
  )
}
