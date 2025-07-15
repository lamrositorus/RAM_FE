import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { signin } from '../API/api'

export const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email.includes('@') || password.length < 6) {
      const msg = 'Email atau password tidak valid'
      setError(msg)
      toast.error(msg)
      return
    }

    try {
      const token = await signin({ email, password })
      login(token)
      toast.success('Login berhasil')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.message
      setError(msg)
      toast.error(msg)
    }
  }

  return (
    <main className="card w-96 bg-base-100 shadow-xl mx-auto mt-20" role="main" aria-labelledby="signin-title">
      <div className="card-body">
        <h2 className="card-title" id="signin-title">Masuk</h2>
        {error && <div className="alert alert-error" role="alert" aria-live="assertive">{error}</div>}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} aria-label="Formulir Masuk">
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
              aria-required="true"
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
              aria-required="true"
            />
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary" type="submit" aria-label="Tombol Masuk">
              Masuk
            </button>
          </div>
        </form>
        <p className="text-center mt-4">
          Belum punya akun? <Link to="/signup" className="link link-primary">Daftar</Link>
        </p>
      </div>
    </main>
  )
}

export default Signin
