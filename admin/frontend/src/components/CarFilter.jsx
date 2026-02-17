import React, { useState } from 'react'
import '../styles.css'

export default function CarFilter({ onFilter }) {
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', type: '' })

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const handleReset = () => {
    const resetFilters = { minPrice: '', maxPrice: '', type: '' }
    setFilters(resetFilters)
    onFilter(resetFilters)
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '1rem',
      borderRadius: '8px',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,.06)'
    }}>
      <div style={{ flex: '1', minWidth: '150px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Min Price</label>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="$0"
          min="0"
          style={{ 
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ flex: '1', minWidth: '150px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Max Price</label>
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="$1000"
          min="0"
          style={{ 
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ flex: '1', minWidth: '150px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Car Type</label>
        <input
          type="text"
          name="type"
          value={filters.type}
          onChange={handleChange}
          placeholder="SUV, Sedan, Truck"
          style={{ 
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <button
        onClick={handleReset}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#95a5a6',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '500',
          height: '36px'
        }}
      >
        Reset
      </button>
    </div>
  )
}
