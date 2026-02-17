import React, { useEffect, useState } from 'react'
import userApi from '../userApi'
import CarsList from '../components/CarsList'
import CarFilter from '../components/CarFilter'
import BookingModal from '../components/BookingModal'
import MyBookings from '../components/MyBookings'
import '../styles.css'

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('cars')
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', type: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCar, setSelectedCar] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await userApi.get('/cars')
      setCars(data)
      setFilteredCars(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    applyFilters(cars, newFilters)
  }

  const applyFilters = (carList, appliedFilters) => {
    let filtered = carList

    if (appliedFilters.minPrice) {
      filtered = filtered.filter(car => car.pricePerDay >= Number(appliedFilters.minPrice))
    }

    if (appliedFilters.maxPrice) {
      filtered = filtered.filter(car => car.pricePerDay <= Number(appliedFilters.maxPrice))
    }

    if (appliedFilters.type) {
      filtered = filtered.filter(car => car.type && car.type.toLowerCase().includes(appliedFilters.type.toLowerCase()))
    }

    setFilteredCars(filtered)
  }

  const handleBookClick = (car) => {
    setSelectedCar(car)
    setShowBookingModal(true)
  }

  const handleBookingSuccess = () => {
    setShowBookingModal(false)
    setSelectedCar(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('user_token')
    localStorage.removeItem('user')
    window.location.href = '/user/login'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{ backgroundColor: '#2c3e50', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,.1)' }}>
        <h1 style={{ margin: 0 }}>🚗 Car Booking</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.95rem' }}>Welcome, <strong>{user.name}</strong>!</span>
          <button onClick={handleLogout} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd', padding: '0', boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', padding: '1rem 2rem' }}>
          <button
            onClick={() => setActiveTab('cars')}
            style={{
              padding: '0.75rem 1.5rem',
              marginRight: '1rem',
              backgroundColor: activeTab === 'cars' ? '#3498db' : 'transparent',
              color: activeTab === 'cars' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeTab === 'cars' ? '600' : '500',
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}
          >
            🚙 Browse Cars
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === 'bookings' ? '#3498db' : 'transparent',
              color: activeTab === 'bookings' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeTab === 'bookings' ? '600' : '500',
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}
          >
            📋 My Bookings
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {error && <div style={{ backgroundColor: '#ffecec', padding: '1rem', borderRadius: '6px', color: '#900', marginBottom: '1rem' }}>{error}</div>}

        {activeTab === 'cars' && (
          <>
            <CarFilter onFilter={handleFilter} />
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#666' }}>Loading cars...</p>
              </div>
            ) : (
              <CarsList cars={filteredCars} onBook={handleBookClick} />
            )}
          </>
        )}

        {activeTab === 'bookings' && <MyBookings />}
      </div>

      {showBookingModal && selectedCar && (
        <BookingModal
          car={selectedCar}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedCar(null)
          }}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  )
}
