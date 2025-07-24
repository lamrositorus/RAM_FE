import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { postKeuangan, getKeuangan } from '../API/api'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'

const ITEMS_PER_PAGE = 10

export const Keuangan = () => {
  const [deskripsi, setDeskripsi] = useState('')
  const [nominal, setNominal] = useState('')
  const [tipe, setTipe] = useState('pemasukan')
  const [list, setList] = useState([])

  const [filterTipe, setFilterTipe] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { token } = useAuth()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!deskripsi || !nominal || !tipe) {
      toast.error('Semua field harus diisi')
      return
    }
    setPendingPayload({
      deskripsi,
      nominal: Number(nominal),
      tipe,
    })
    setIsModalOpen(true)
  }

  const confirmSave = async () => {
    setIsModalOpen(false)
    try {
      await postKeuangan(pendingPayload, token)
      toast.success('Data berhasil disimpan')
      setDeskripsi('')
      setNominal('')
      setTipe('pemasukan')
      fetchData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const cancelSave = () => {
    setIsModalOpen(false)
    setPendingPayload(null)
  }

const fetchData = async () => {
  try {
    const res = await getKeuangan(token)
    // res.data harus berupa array data transaksi
    const sorted = res.data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    setList(sorted)
  } catch (err) {
    toast.error(err.message)
  }
}


  useEffect(() => {
    fetchData()
  }, [])

  const filteredList = list.filter(item => {
    const itemDate = new Date(item.tanggal)
    const isTipeMatch = filterTipe === 'semua' || item.tipe === filterTipe
    const isStartValid = startDate ? itemDate >= new Date(startDate) : true
    const isEndValid = endDate ? itemDate <= new Date(endDate) : true
    return isTipeMatch && isStartValid && isEndValid
  })

  const summary = filteredList.reduce(
    (acc, cur) => {
      if (cur.tipe === 'pemasukan') acc.pemasukan += cur.nominal
      else if (cur.tipe === 'pengeluaran') acc.pengeluaran += cur.nominal
      return acc
    },
    { pemasukan: 0, pengeluaran: 0 }
  )
  summary.saldo = summary.pemasukan - summary.pengeluaran

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE)
  const paginatedList = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Input Data Keuangan</h2>

      {/* FORM INPUT */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Deskripsi"
          className="input input-bordered"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Nominal"
          className="input input-bordered"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
          required
        />
        <select
          className="select select-bordered"
          value={tipe}
          onChange={(e) => setTipe(e.target.value)}
        >
          <option value="pemasukan">Pemasukan</option>
          <option value="pengeluaran">Pengeluaran</option>
        </select>
        <div className="md:col-span-3">
          <button type="submit" className="btn btn-primary w-full">
            Simpan
          </button>
        </div>
      </form>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Konfirmasi Simpan"
        message="Apakah Anda yakin ingin menyimpan data ini?"
        onConfirm={confirmSave}
        onCancel={cancelSave}
      />

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-200 shadow-md p-4 rounded">
          <div className="stat-title">Total Pemasukan</div>
          <div className="stat-value text-success">Rp {summary.pemasukan.toLocaleString('id-ID')}</div>
        </div>
        <div className="stat bg-base-200 shadow-md p-4 rounded">
          <div className="stat-title">Total Pengeluaran</div>
          <div className="stat-value text-error">Rp {summary.pengeluaran.toLocaleString('id-ID')}</div>
        </div>
        <div className="stat bg-base-200 shadow-md p-4 rounded">
          <div className="stat-title">Saldo Akhir</div>
          <div className="stat-value text-primary">Rp {summary.saldo.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* FILTER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="label">Filter Tipe</label>
          <select
            className="select select-bordered w-full"
            value={filterTipe}
            onChange={(e) => {
              setFilterTipe(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="semua">Semua</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </div>
        <div>
          <label className="label">Dari Tanggal</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <div>
          <label className="label">Sampai Tanggal</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <div className="flex items-end">
          <button
            className="btn btn-outline w-full"
            onClick={() => {
              const today = new Date().toISOString().split('T')[0]
              setFilterTipe('semua')
              setStartDate(today)
              setEndDate(today)
              setCurrentPage(1)
            }}
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto mb-4">
        <table className="table table-zebra w-full min-w-[600px]">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Deskripsi</th>
              <th>Nominal</th>
              <th>Tipe</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length > 0 ? (
              paginatedList.map((item) => (
                <tr key={item.id}>
                  <td>
                    {new Date(item.tanggal).toLocaleString('id-ID', {
                      timeZone: 'Asia/Jakarta',
                      hour12: false,
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td>{item.deskripsi}</td>
                  <td>Rp {item.nominal.toLocaleString('id-ID')}</td>
                  <td>{item.tipe}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Tidak ada data transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            className="btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          <span className="text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            className="btn btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Keuangan
