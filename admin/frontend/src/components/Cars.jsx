
// cars (Manage cars - add, edit, delete  )
import React, { useEffect, useState } from 'react'
import api from '../api'

function CarForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({ make:'', model:'', year:'2020', pricePerDay:'0', images:[], ...initial })
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  useEffect(()=> setForm(f => ({...f,...initial})),[initial])

  useEffect(()=>{
    if (!files || files.length===0) return setPreviews([])
    const ps = files.map(f => URL.createObjectURL(f))
    setPreviews(ps)
    return ()=> ps.forEach(url => URL.revokeObjectURL(url))
  },[files])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.make || !form.model) return alert('Make and model required')
    // if files present send FormData
    if (files && files.length) {
      const fd = new FormData()
      fd.append('make', form.make)
      fd.append('model', form.model)
      fd.append('year', form.year)
      fd.append('pricePerDay', form.pricePerDay)
      // include existing images if editing and they exist
      if (form.images && form.images.length) fd.append('images', JSON.stringify(form.images))
      files.forEach(f=> fd.append('images', f))
      await onSubmit(fd)
    } else {
      await onSubmit({ ...form, year: Number(form.year), pricePerDay: Number(form.pricePerDay) })
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <label>Make</label>
      <input value={form.make} onChange={e=>setForm({...form,make:e.target.value})} />
      <label>Model</label>
      <input value={form.model} onChange={e=>setForm({...form,model:e.target.value})} />
      <label>Year</label>
      <input value={form.year} onChange={e=>setForm({...form,year:e.target.value})} />
      <label>Price / day</label>
      <input value={form.pricePerDay} onChange={e=>setForm({...form,pricePerDay:e.target.value})} />

      <label>Upload Images</label>
      <input type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files))} />

      {form.images && form.images.length > 0 && (
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
          {form.images.map((u,i)=> <img key={i} src={u} alt="existing" style={{width:120,height:80,objectFit:'cover',borderRadius:6}} />)}
        </div>
      )}

      {previews && previews.length>0 && (
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
          {previews.map((u,i)=> <img key={i} src={u} alt="preview" style={{width:120,height:80,objectFit:'cover',borderRadius:6}} />)}
        </div>
      )}

      <div style={{display:'flex',gap:8}}>
        <button className="primary" type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default function Cars(){
  const [cars, setCars] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = async ()=>{
    const { data } = await api.get('/cars')
    setCars(data)
  }

  useEffect(()=>{ load() }, [])

  const add = async (payload) => {
    if (payload instanceof FormData) {
      await api.post('/cars', payload)
    } else {
      await api.post('/cars', payload)
    }
    setShowForm(false)
    load()
  }

  const save = async (payload) => {
    if (payload instanceof FormData) {
      await api.put(`/cars/${editing.id}`, payload)
    } else {
      await api.put(`/cars/${editing.id}`, payload)
    }
    setEditing(null)
    setShowForm(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete car?')) return
    await api.delete(`/cars/${id}`)
    load()
  }

  return (
    <div>
      <header className="row">
        <h2>Cars</h2>
        <div>
          <button className="primary" onClick={()=>{setEditing(null); setShowForm(true)}}>Add new car</button>
        </div>
      </header>

      {showForm && (
        <CarForm initial={editing||{}} onSubmit={editing?save:add} onCancel={()=>{setShowForm(false); setEditing(null)}} />
      )}

      <div className="grid">
        {cars.map(c=> (
          <div key={c.id} className="card">
            <h4>{c.make} {c.model} ({c.year})</h4>
            <div>Price: {c.pricePerDay}</div>
            <div>Available: {c.available ? 'Yes' : 'No'}</div>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button onClick={()=>{setEditing(c); setShowForm(true)}}>Edit</button>
              <button className="danger" onClick={()=>remove(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
