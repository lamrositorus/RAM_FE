import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { signup } from '../API/api'
import { FaSpinner } from 'react-icons/fa'

export const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email.includes('@') || password.length < 6 || username.length < 3) {
      const msg = 'Email valid, username min. 3 karakter, dan password min. 6 karakter'
      setError(msg)
      toast.error(msg)
      return
    }

    setIsLoading(true)
    try {
      await signup({ username, email, password })
      toast.success('Pendaftaran berhasil, silakan masuk')
      navigate('/signin')
    } catch (err) {
      const msg = err.message
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="card w-96 bg-base-100 shadow-xl mx-auto mt-20" role="main" aria-labelledby="signup-title">
      <div className="card-body">
        <h2 className="card-title" id="signup-title">Daftar Akun</h2>
        {error && <div className="alert alert-error" role="alert" aria-live="assertive">{error}</div>}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} aria-label="Formulir Daftar">
          <div className="form-control">
            <label className="label" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="password">Kata Sandi</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered"
              required
              disabled={isLoading}
            />
          </div>
          <div className="card-actions justify-end mt-4">
            <button 
              className="btn btn-primary w-full" 
              type="submit" 
              disabled={isLoading}
              aria-label={isLoading ? "Sedang mendaftarkan" : "Tombol Daftar"}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Membuat akun...
                </span>
              ) : 'Daftar'}
            </button>
          </div>
        </form>
        <p className="text-center mt-4">
          Sudah punya akun? <Link to="/signin" className="link link-primary">Masuk</Link>
        </p>
      </div>
    </main>
  )
}

export default Signup