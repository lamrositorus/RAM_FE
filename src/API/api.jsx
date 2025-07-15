// src/api/auth.js
import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:3000'

export const signup = async ({ username, email, password }) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/signup`, {
      username,
      email,
      password,
    })
    return res.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Signup gagal. Silakan coba lagi.')
  }
}

export const signin = async ({ email, password }) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/signin`, {
      email,
      password,
    })
    return res.data.token
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Signin gagal. Periksa email dan password Anda.')
  }
}

export const getDashboardData = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Gagal mengambil data dashboard.')
  }
}

// API baru: POST keuangan
// src/api/auth.js

export const postKeuangan = async (data, token) => {
  try {
    const res = await axios.post(`${BASE_URL}/keuangan`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return res.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Gagal menyimpan data keuangan.')
  }
}
// src/API/api.js
export const getKeuangan = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/keuangan`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Gagal mengambil data keuangan.')
  }
}


