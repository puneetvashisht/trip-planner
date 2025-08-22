import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Home from './components/Home.jsx'
import ViewTrips from './components/ViewTrips.jsx'
import AddTrip from './components/AddTrip.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './components/Header.jsx'
import Trip from './components/Trip.jsx'

createRoot(document.getElementById('root')).render(
  // Router app having 3 routes
  <>
  <Header />

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/view-trips" element={<ViewTrips />} />
      <Route path="/add-trip" element={<AddTrip />} />
      <Route path="/trip/:id" element={<Trip />} />
    </Routes>
  </BrowserRouter>
  </>
);
