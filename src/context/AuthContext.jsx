import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({
  token: null,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Clear token when window is closed or refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('token')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const login = (newToken) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)