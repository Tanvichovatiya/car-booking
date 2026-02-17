import React from 'react'
import '../styles.css'

export default function CarsList({ cars, onBook }) {
  if (cars.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '2rem' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>No cars found matching your filters.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
      {cars.map(car => (
        <div 
          key={car.id} 
          style={{ 
            backgroundColor: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 1px 4px rgba(0,0,0,.06)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.06)'
          }}
        >
          {car.images && car.images.length > 0 && (
            <img
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
          )}
          
          <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
              {car.make} {car.model}
            </h3>
            
            <p style={{ color: '#666', margin: '0.3rem 0', fontSize: '0.9rem' }}>
              <strong>Year:</strong> {car.year}
            </p>
            
            {car.type && (
              <p style={{ color: '#666', margin: '0.3rem 0', fontSize: '0.9rem' }}>
                <strong>Type:</strong> {car.type}
              </p>
            )}
            
            {car.description && (
              <p style={{ color: '#888', margin: '0.5rem 0', fontSize: '0.85rem', lineHeight: '1.4' }}>
                {car.description.substring(0, 60)}...
              </p>
            )}
            
            <div style={{ marginTop: 'auto', marginBottom: '1rem', paddingTop: '0.5rem' }}>
              <p style={{ margin: 0 }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                  {car.pricePerDay}
                </span>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>/day</span>
              </p>
            </div>
            
            <button
              onClick={() => onBook(car)}
              style={{
                padding: '0.75rem',
                backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background-color 0.2s',
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
