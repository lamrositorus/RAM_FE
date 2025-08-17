import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Sidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogout = () => {
    setShowConfirm(true)
  }

  const confirmLogout = () => {
    logout()
    navigate('/signin')
    setShowConfirm(false)
  }

  const cancelLogout = () => {
    setShowConfirm(false)
  }

  return (
    <div className="drawer-side z-40">
      <label htmlFor="sidebar" className="drawer-overlay"></label>
      <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content">
        <li className="menu-title">
          <span>RAM</span>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/keuangan">Laporan Keuangan</Link>
        </li>
        <li>
          <Link to="/modal">Estimasi Modal</Link>
        </li>
        <li>
          <Link to="/keuntungan">Estimasi Keuntungan</Link>
        </li>
        <li>
          <Link to="/susut">Susut Timbangan</Link>
        </li>
        <li className="mt-auto">
          <button className="btn btn-error w-full" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>

{/* Confirmation Modal with Daisy UI */}
{showConfirm && (
  <div className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300">
    {/* Backdrop with fade effect */}
    <div 
      className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
      onClick={cancelLogout}
    ></div>
    
    {/* Modal with slide-down animation */}
    <div className="modal modal-open">
      <div className="modal-box transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-4 p-3 bg-error/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold mb-2">Konfirmasi Logout</h3>
          <p className="text-gray-500 mb-6">Anda akan keluar dari akun Anda</p>
          
          <div className="modal-action w-full">
            <div className="flex justify-end space-x-3 w-full">
              <button 
                onClick={cancelLogout}
                className="btn btn-ghost  w-1/2"
              >
                Batal
              </button>
              <button 
                onClick={confirmLogout}
                className="btn btn-error text-white w-1/2 hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default Sidebar