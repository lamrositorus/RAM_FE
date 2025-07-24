// src/api/auth.js
import axios from 'axios'

const BASE_URL = 'https://ram-be-express.vercel.app'

// Helper untuk handle error response
const handleApiError = (error) => {
  console.error('API Error:', error.response?.data || error.message)
  
  // Ekstrak pesan error dari BE atau gunakan default
  const errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      'Terjadi kesalahan pada server'

  // Throw error yang lebih spesifik
  throw new Error(errorMessage)
}

// Auth APIs
export const signup = async ({ username, email, password }) => {
  try {
    const res = await axios.post(`${BASE_URL}/signup`, {
      username,
      email,
      password,
    })
    return res.data
  } catch (error) {
    return handleApiError(error)
  }
}

export const signin = async ({ email, password }) => {
  try {
    const res = await axios.post(`${BASE_URL}/signin`, {
      email,
      password,
    })
    return res.data.token
  } catch (error) {
    return handleApiError(error)
  }
}

// Keuangan APIs
export const postKeuangan = async (data, token) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/keuangan`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return res.data
  } catch (error) {
    return handleApiError(error)
  }
}

export const getKeuangan = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/keuangan`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  } catch (error) {
    return handleApiError(error)
  }
}

// Susut Timbangan APIs
export const postSusutTimbangan = async (data, token) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/susut-timbangan`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return res.data
  } catch (error) {
    return handleApiError(error)
  }
}

export const getSusutTimbangan = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/susut-timbangan`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return res.data
  } catch (error) {
    return handleApiError(error)
  }
}

// Dashboard API
export const getDashboardData = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  } catch (error) {
    return handleApiError(error)
  }
}