import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar'
import { Signup, Dashboard, Signin, Keuangan, SusutTimbangan, Estimasikeuntungan, Modal, NotFound } from './pages'
import { useAuth } from './context/AuthContext'

export const App = () => {
  const { token } = useAuth()

  return (
    <div data-theme="retro" className="flex flex-col min-h-screen">
      <Router>
        <div className={`drawer ${token ? 'lg:drawer-open' : ''}`}>
          <input id="sidebar" type="checkbox" className="drawer-toggle" />

          {/* CONTENT */}
          <div className="drawer-content flex flex-col">
            {/* Top navbar only if token exists */}
            {token && (
              <div className="w-full navbar bg-base-100 shadow-md lg:hidden">
                <div className="flex-none">
                  <label htmlFor="sidebar" className="btn btn-square btn-ghost">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </label>
                </div>
                <div className="flex-1 px-2 text-xl font-bold">RAM System</div>
              </div>
            )}

            <main className="flex-1 p-4">
              <Routes>
                <Route path="/" element={<Signin />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<NotFound />} />

                {/* Protected routes */}
                {token && (
                  <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/keuangan" element={<Keuangan />} />
                    <Route path="/susut" element={<SusutTimbangan />} />
                    <Route path="/keuntungan" element={<Estimasikeuntungan />} />
                    <Route path="/modal" element={<Modal />} />
                  </>
                )}
              </Routes>
            </main>
          </div>

          {/* SIDEBAR only if token exists */}
          {token && <Sidebar />}
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </div>
  )
}

export default App