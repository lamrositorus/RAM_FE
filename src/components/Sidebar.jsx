import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/signin')
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
    </div>
  )
}

export default Sidebar
