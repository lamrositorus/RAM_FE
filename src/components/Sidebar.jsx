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
          <Link to="/api/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/api/keuangan">Laporan Keuangan</Link>
        </li>
        <li>
          <Link to="/api/modal">Estimasi Modal</Link>
        </li>
        <li>
          <Link to="/api/keuntungan">Estimasi Keuntungan</Link>
        </li>
        <li>
          <Link to="/api/susut">Susut Timbangan</Link>
        </li>
        <li className="mt-auto">
          <button className="btn btn-error w-full" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Konfirmasi Logout</h3>
            <p className="mb-6">Apakah Anda yakin ingin keluar dari sistem?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelLogout}
                className="btn btn-outline"
              >
                Batal
              </button>
              <button 
                onClick={confirmLogout}
                className="btn btn-error"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar