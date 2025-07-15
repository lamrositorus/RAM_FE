import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getDashboardData } from '../API/api'

export const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await getDashboardData(token)
        setData(res)
      } catch (err) {
        toast.error('Gagal mengambil data dashboard')
        console.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) return <div className="text-center mt-10">Loading...</div>
  if (!data) return <div className="text-center mt-10">Tidak ada data</div>

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="💰 Saldo Akhir" value={data.saldo_akhir} />
      <Card title="💸 Total Pemasukan" value={data.total_pemasukan} />
      <Card title="🧾 Total Pengeluaran" value={data.total_pengeluaran} />
      <Card title="📊 Total Modal" value={data.total_modal} />
      <Card title="📈 Total Keuntungan" value={data.total_untung} />
    </div>
  )
}

const Card = ({ title, value }) => (
  <div className="bg-base-100 shadow-lg rounded-xl p-6 text-center border border-base-300">
    <h2 className="text-lg font-semibold text-base-content mb-2">{title}</h2>
    <p className="text-2xl font-bold text-primary">
      Rp {value.toLocaleString('id-ID')}
    </p>
  </div>
)

export default Dashboard
