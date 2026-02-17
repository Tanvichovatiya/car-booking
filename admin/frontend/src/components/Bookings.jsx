// bokkings (View and manage all bookings - admin)
import React, { useEffect, useState } from 'react'
import api from '../api'
import { overlaps } from '../utils/dateOverlap'

export default function Bookings(){
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async ()=>{
    setLoading(true)
    const { data } = await api.get('/bookings')
    setBookings(data)
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  const changeStatus = async (b, status) => {
    // Prevent approving if overlapping approved booking exists
    if (status === 'APPROVED'){
      const others = bookings.filter(x=> x.id !== b.id && x.carId === b.carId && x.status === 'APPROVED')
      const conflict = others.find(o => overlaps(o.startDate, o.endDate, b.startDate, b.endDate))
      if (conflict) return alert('Cannot approve — car already booked for these dates')
    }
    try{
      await api.patch(`/bookings/${b.id}/status`, { status })
      load()
    }catch(e){ alert(e?.response?.data?.message || 'Failed') }
  }

  return (
    <div>
      <header className="row">
        <h2>Bookings</h2>
      </header>
      {loading ? <div>Loading...</div> : (
        <div className="list">
          {bookings.map(b=> (
            <div key={b.id} className="card">
              <div><strong>Car:</strong> {b.car ? `${b.car.make} ${b.car.model} (${b.car.year})` : b.carId}</div>
              <div><strong>User:</strong> {b.user ? `${b.user.name} (${b.user.email})` : b.userId}</div>
              <div><strong>Phone:</strong> {b.user?.phone || 'N/A'}</div>
              <div><strong>From:</strong> {new Date(b.startDate).toLocaleString()}</div>
              <div><strong>To:</strong> {new Date(b.endDate).toLocaleString()}</div>
              <div><strong>Total Cost:</strong> ${b.totalCost?.toFixed(2) || '0.00'}</div>
              <div><strong>Status:</strong> {b.status}</div>
              <div style={{marginTop:8}}>
                <select value={b.status} onChange={(e)=>changeStatus(b,e.target.value)}>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVE</option>
                  <option value="REJECTED">REJECT</option>
                  <option value="COMPLETED">COMPLETE</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
