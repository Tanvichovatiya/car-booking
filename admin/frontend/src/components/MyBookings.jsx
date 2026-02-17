import React, { useEffect, useState } from 'react'
import userApi from '../userApi'
import '../styles.css'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await userApi.get('/user/bookings')
      setBookings(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      await userApi.patch(`/user/bookings/${bookingId}/cancel`)
      fetchBookings()
      alert('Booking cancelled successfully!')
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to cancel booking')
    }
  }

  const canCancel = (booking) => {
    const startDate = new Date(booking.startDate)
    const now = new Date()
    return startDate > now && booking.status !== 'CANCELLED'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return '#3498db'
      case 'APPROVED':
        return '#27ae60'
      case 'COMPLETED':
        return '#95a5a6'
      case 'CANCELLED':
        return '#e74c3c'
      case 'REJECTED':
        return '#e67e22'
      case 'PENDING':
        return '#f39c12'
      default:
        return '#333'
    }
  }

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading bookings...</p>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (bookings.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>You have no bookings yet. <a href="#" onClick={() => window.location.href = '/user/cars'}>Browse cars</a> to make your first booking!</p>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>My Bookings</h2>
      {bookings.map(booking => (
        <div 
          key={booking.id} 
          style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 4px rgba(0,0,0,.06)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              {booking.car.make} {booking.car.model}
            </h3>
            
            {booking.car.images && booking.car.images.length > 0 && (
              <img 
                src={booking.car.images[0]} 
                alt={`${booking.car.make} ${booking.car.model}`}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '1rem'
                }}
              />
            )}
            
            <p style={{ color: '#666', margin: '0.5rem 0' }}>
              <strong>Year:</strong> {booking.car.year}
            </p>
            {booking.car.type && (
              <p style={{ color: '#666', margin: '0.5rem 0' }}>
                <strong>Type:</strong> {booking.car.type}
              </p>
            )}
            <p style={{ color: '#666', margin: '0.5rem 0' }}>
              <strong>Price per Day:</strong> {booking.car.pricePerDay}
            </p>
          </div>

          <div>
            <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
              <p style={{ margin: '0.5rem 0', color: '#333' }}>
                <strong>📅 Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}
              </p>
              <p style={{ margin: '0.5rem 0', color: '#333' }}>
                <strong>📅 End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}
              </p>
              <p style={{ margin: '0.5rem 0', color: '#333' }}>
                <strong>💰 Total Cost:</strong> ${booking.totalCost?.toFixed(2) || 'N/A'}
              </p>
              <p style={{ margin: '0.5rem 0', color: '#333' }}>
                <strong>Status:</strong> <span style={{
                  backgroundColor: getStatusColor(booking.status) + '20',
                  color: getStatusColor(booking.status),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  {booking.status}
                </span>
              </p>
            </div>

            {canCancel(booking) && (
              <button
                onClick={() => handleCancel(booking.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                Cancel Booking
              </button>
            )}
            {!canCancel(booking) && booking.status !== 'CANCELLED' && (
              <p style={{ color: '#e74c3c', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>
                ⏳ Cannot cancel after booking start date
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
