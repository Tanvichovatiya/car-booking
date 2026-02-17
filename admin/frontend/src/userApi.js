import axios from 'axios'

const BASE = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE
  : 'http://localhost:5000'

const userApi = axios.create({ baseURL: BASE })

userApi.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('user_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default userApi
