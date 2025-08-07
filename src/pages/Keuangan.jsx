import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { postKeuangan, getKeuangan, deleteKeuangan } from '../API/api'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import { FaSpinner, FaTrash, FaSearch } from 'react-icons/fa'
import Pagination from '../components/Pagination'

export const Keuangan = () => {
  const [deskripsi, setDeskripsi] = useState('')
  const [nominal, setNominal] = useState('')
  const [tipe, setTipe] = useState('pengeluaran')
  const [list, setList] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [filterTipe, setFilterTipe] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { token } = useAuth()

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)

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
    setIsSaveModalOpen(true)
  }

  const confirmSave = async () => {
    setIsSubmitting(true)
    try {
      await postKeuangan(pendingPayload, token)
      toast.success('Data berhasil disimpan')
      setDeskripsi('')
      setNominal('')
      setTipe('pengeluaran')
      fetchData()
      setCurrentPage(1)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
      setIsSaveModalOpen(false)
    }
  }

  const cancelSave = () => {
    setIsSaveModalOpen(false)
    setPendingPayload(null)
  }

  const handleDelete = (item) => {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteKeuangan(itemToDelete.id, token)
      toast.success('Data berhasil dihapus')
      fetchData()
      // Jika halaman terakhir hanya memiliki 1 item, kembali ke halaman sebelumnya
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setItemToDelete(null)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
  }

  const fetchData = async () => {
    try {
      const res = await getKeuangan(token)
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
    const isDeskripsiMatch = item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    return isTipeMatch && isStartValid && isEndValid && isDeskripsiMatch
  })

  // Calculate pagination
  const totalItems = filteredList.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const summary = filteredList.reduce(
    (acc, cur) => {
      if (cur.tipe === 'pemasukan') acc.pemasukan += cur.nominal
      else if (cur.tipe === 'pengeluaran') acc.pengeluaran += cur.nominal
      return acc
    },
    { pemasukan: 0, pengeluaran: 0 }
  )
  summary.saldo = summary.pemasukan - summary.pengeluaran

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Input Data Keuangan</h2>

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
          <option value="pengeluaran">Pengeluaran</option>
          <option value="pemasukan">Pemasukan</option>
        </select>
        <div className="md:col-span-3">
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" />
                Menyimpan...
              </span>
            ) : 'Simpan'}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={isSaveModalOpen}
        title="Konfirmasi Simpan"
        message="Apakah Anda yakin ingin menyimpan data ini?"
        onConfirm={confirmSave}
        onCancel={cancelSave}
        isLoading={isSubmitting}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus transaksi "${itemToDelete?.deskripsi}"?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
        confirmText="Hapus"
        cancelText="Batal"
      />

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
        <div className="relative">
          <label className="label">Cari Deskripsi</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari deskripsi..."
              className="input input-bordered w-full pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-end">
          <button
            className="btn btn-outline w-full"
            onClick={() => {
              setFilterTipe('semua')
              setStartDate('')
              setEndDate('')
              setSearchQuery('')
              setCurrentPage(1)
            }}
          >
            Reset Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="table table-zebra w-full min-w-[600px]">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Deskripsi</th>
              <th>Nominal</th>
              <th>Tipe</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
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
                  <td>
                    <span className={`badge ${item.tipe === 'pemasukan' ? 'badge-success' : 'badge-error'}`}>
                      {item.tipe}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-error btn-sm"
                        onClick={() => handleDelete(item)}
                        aria-label="Hapus"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Tidak ada data transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={paginate}
        />
      )}
    </div>
  )
}

export default Keuangan