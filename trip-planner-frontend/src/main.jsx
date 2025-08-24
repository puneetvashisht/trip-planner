import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import ViewTrips from './components/ViewTrips.jsx'
import AddTrip from './components/AddTrip.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './components/Header.jsx'
import Trip from './components/Trip.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/view-trips" element={
            <ProtectedRoute>
              <ViewTrips />
            </ProtectedRoute>
          } />
          <Route path="/add-trip" element={
            <ProtectedRoute>
              <AddTrip />
            </ProtectedRoute>
          } />
          <Route path="/trip/:id" element={
            <ProtectedRoute>
              <Trip />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
