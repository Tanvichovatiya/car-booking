import React, { useState } from 'react'
import userApi from '../userApi'
import '../styles.css'

export default function BookingModal({ car, onClose, onSuccess }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalDays, setTotalDays] = useState(0)
  const [totalCost, setTotalCost] = useState(0)

  const calculateCost = (start, end) => {
    if (!start || !end) return

    const startD = new Date(start)
    const endD = new Date(end)

    if (endD <= startD) {
      setError('End date must be after start date')
      setTotalDays(0)
      setTotalCost(0)
      return
    }

    setError('')
    const diffTime = Math.abs(endD - startD)
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    setTotalDays(days)
    setTotalCost(days * car.pricePerDay)
  }

  const handleStartDateChange = (e) => {
    const start = e.target.value
    setStartDate(start)
    calculateCost(start, endDate)
  }

  const handleEndDateChange = (e) => {
    const end = e.target.value
    setEndDate(end)
    calculateCost(startDate, end)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!startDate || !endDate) {
      return setError('Please select both start and end dates')
    }

    setLoading(true)
    try {
      const { data } = await userApi.post('/user/bookings', {
        carId: car.id,
        startDate,
        endDate
      })

      alert('Booking successful!')
      onSuccess()
    } catch (err) {
      setError(err?.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,.2)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
          Book {car.make} {car.model}
        </h2>
        {error && <div style={{ backgroundColor: '#ffecec', padding: '0.75rem', borderRadius: '4px', color: '#900', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            required
            min={new Date().toISOString().split('T')[0]}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '1.2rem',
              fontSize: '1rem'
            }}
          />

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            required
            min={startDate || new Date().toISOString().split('T')[0]}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '1.2rem',
              fontSize: '1rem'
            }}
          />

          {totalDays > 0 && (
            <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #e0e0e0' }}>
              <p style={{ margin: '0.5rem 0', color: '#333' }}><strong>Total Days:</strong> {totalDays}</p>
              <p style={{ margin: '0.5rem 0', color: '#333' }}><strong>Price per Day:</strong> ${car.pricePerDay}</p>
              <p style={{ fontSize: '1.3rem', color: '#27ae60', fontWeight: 'bold', margin: '1rem 0 0 0' }}>
                Total Cost: ${totalCost.toFixed(2)}
              </p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button
              type="submit"
              disabled={loading || totalDays === 0}
              style={{
                padding: '0.85rem',
                backgroundColor: '#27ae60',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: loading || totalDays === 0 ? 'not-allowed' : 'pointer',
                opacity: loading || totalDays === 0 ? 0.6 : 1,
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => !loading && totalDays > 0 && (e.target.style.backgroundColor = '#229954')}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.85rem',
                backgroundColor: '#95a5a6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
