import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getDashboardData } from '../API/api';
import React from 'react';

// Komponen ErrorBoundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-500">Terjadi kesalahan pada komponen</div>;
    }
    return this.props.children;
  }
}



// Komponen Card
const Card = ({ title, value }) => (
  <ErrorBoundary>
    <div className="bg-base-100 shadow-lg rounded-xl p-6 text-center border border-base-300">
      <h2 className="text-lg font-semibold text-base-content mb-2">{title}</h2>
      <p className="text-2xl font-bold text-primary">
        Rp {Number(value || 0).toLocaleString('id-ID')}
      </p>
    </div>
  </ErrorBoundary>
);

// Komponen utama Dashboard
export const Dashboard = () => {
  const [data, setData] = useState({
    saldo_akhir: 0,
    total_pemasukan: 0,
    total_pengeluaran: 0,
    total_modal: 0,
    total_untung: 0,
    statistik_susut: {
      total_transaksi: 0,
      total_susut: 0,
      total_kelebihan: 0,
      avg_persentase_susut: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await getDashboardData(token);
        
        console.log('API Response:', res); // Debugging
        
        if (res.success) {
          setData({
            ...res.data,
            statistik_susut: {
              ...res.data.statistik_susut,
              avg_persentase_susut: Number(res.data.statistik_susut?.avg_persentase_susut || 0)
            }
          });
        } else {
          toast.error(res.error || 'Gagal mengambil data');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan sistem');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Memuat data...</div>;
  }

  // Fungsi untuk format persentase
  const formatPercentage = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00%' : `${num.toFixed(2)}%`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Statistik Keuangan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="💰 Saldo Akhir" value={data.saldo_akhir} />
        <Card title="💸 Total Pemasukan" value={data.total_pemasukan} />
        <Card title="🧾 Total Pengeluaran" value={data.total_pengeluaran} />
        <Card title="📊 Total Modal" value={data.total_modal} />
        <Card title="📈 Total Keuntungan" value={data.total_untung} />
      </div>


    </div>
  );
};

export default Dashboard;