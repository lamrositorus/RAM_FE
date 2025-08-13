import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { postSusutTimbangan, getSusutTimbangan, deleteSusutTimbangan } from '../API/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import ConfirmModal from '../components/ConfirmModal'
import { FaSpinner, FaTrash, FaSearch } from 'react-icons/fa'
import Pagination from '../components/Pagination'

export const SusutTimbangan = () => {
  const { token } = useAuth()

  // Format functions
  const formatTanggal = (tanggalStr) => {
    try {
      const parsedDate = new Date(tanggalStr)
      return format(parsedDate, "dd/MM/yyyy", { locale: id })
    } catch {
      return tanggalStr
    }
  }

  const formatAngka = (num) => {
    return parseFloat(num) % 1 === 0 ? parseInt(num) : parseFloat(num)
  }

  // State management
  const [form, setForm] = useState({
    tanggal: '',
    nomor_polisi: '',
    nama_supir: '',
    sp_pabrik: '',
    buah_pulangan: '',
    sp_ram: '',
  })

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [filter, setFilter] = useState({
    tanggal: '',
    nomor_polisi: '',
    nama_supir: '',
    searchQuery: ''
  })

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getSusutTimbangan(token)
      setList(res?.data ?? [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    for (const key in form) {
      if (form[key] === '') {
        toast.error(`Field ${key.replace(/_/g, ' ')} wajib diisi`)
        return
      }
    }

    setIsSaveModalOpen(true)
  }

  const confirmSubmit = async () => {
    setIsSaveModalOpen(false)
    setIsSubmitting(true)
    
    try {
      const payload = {
        ...form,
        sp_pabrik: parseFloat(form.sp_pabrik),
        buah_pulangan: parseFloat(form.buah_pulangan),
        sp_ram: parseFloat(form.sp_ram),
        tanggal: form.tanggal
      }

      await postSusutTimbangan(payload, token)
      toast.success('Data susut timbangan berhasil disimpan')
      setForm({
        tanggal: '',
        nomor_polisi: '',
        nama_supir: '',
        sp_pabrik: '',
        buah_pulangan: '',
        sp_ram: '',
      })
      fetchData()
      setCurrentPage(1)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (item) => {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteSusutTimbangan(itemToDelete.id, token)
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

  // Filter and pagination
  const filteredData = list.filter(item => {
    const cocokTanggal = !filter.tanggal || item.tanggal.startsWith(filter.tanggal)
    const cocokPolisi = item.nomor_polisi.toLowerCase().includes(filter.nomor_polisi.toLowerCase())
    const cocokSupir = item.nama_supir.toLowerCase().includes(filter.nama_supir.toLowerCase())
    const cocokSearch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(filter.searchQuery.toLowerCase())
    )
    return cocokTanggal && cocokPolisi && cocokSupir && cocokSearch
  })

  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Input Data Susut Timbangan</h2>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input
          type="date"
          name="tanggal"
          className="input input-bordered"
          value={form.tanggal}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nomor_polisi"
          placeholder="Nomor Polisi"
          className="input input-bordered"
          value={form.nomor_polisi}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nama_supir"
          placeholder="Nama Supir"
          className="input input-bordered"
          value={form.nama_supir}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="sp_pabrik"
          placeholder="SP Pabrik"
          className="input input-bordered"
          value={form.sp_pabrik}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="buah_pulangan"
          placeholder="Buah Pulangan"
          className="input input-bordered"
          value={form.buah_pulangan}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="sp_ram"
          placeholder="SP RAM"
          className="input input-bordered"
          value={form.sp_ram}
          onChange={handleChange}
          required
        />
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

      {/* Save Confirmation Modal */}
      <ConfirmModal
        isOpen={isSaveModalOpen}
        title="Konfirmasi Simpan Data"
        message="Apakah Anda yakin ingin menyimpan data susut timbangan ini?"
        onConfirm={confirmSubmit}
        onCancel={() => setIsSaveModalOpen(false)}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Konfirmasi Hapus Data"
        message={`Apakah Anda yakin ingin menghapus data untuk ${itemToDelete?.nomor_polisi}?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
        confirmText="Hapus"
        cancelText="Batal"
      />

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          name="tanggal"
          className="input input-bordered"
          value={filter.tanggal}
          onChange={(e) => {
            setFilter(prev => ({ ...prev, tanggal: e.target.value }))
            setCurrentPage(1)
          }}
        />
        <input
          type="text"
          placeholder="Filter Nomor Polisi"
          className="input input-bordered"
          value={filter.nomor_polisi}
          onChange={(e) => {
            setFilter(prev => ({ ...prev, nomor_polisi: e.target.value }))
            setCurrentPage(1)
          }}
        />
        <input
          type="text"
          placeholder="Filter Nama Supir"
          className="input input-bordered"
          value={filter.nama_supir}
          onChange={(e) => {
            setFilter(prev => ({ ...prev, nama_supir: e.target.value }))
            setCurrentPage(1)
          }}
        />
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari..."
              className="input input-bordered w-full pl-10"
              value={filter.searchQuery}
              onChange={(e) => {
                setFilter(prev => ({ ...prev, searchQuery: e.target.value }))
                setCurrentPage(1)
              }}
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>
        <button
          className="btn btn-outline md:col-span-4"
          onClick={() => {
            setFilter({ tanggal: '', nomor_polisi: '', nama_supir: '', searchQuery: '' })
            setCurrentPage(1)
          }}
        >
          Reset Filter
        </button>
      </div>

      {/* Data Table */}
      <h2 className="text-xl font-semibold mb-4">Data Susut Timbangan</h2>
      {loading ? (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : list.length === 0 ? (
        <p className="text-center py-4">Tidak ada data</p>
      ) : (
        <>
          <div className="overflow-x-auto mb-4">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Nomor Polisi</th>
                  <th>Nama Supir</th>
                  <th>SP Pabrik</th>
                  <th>Buah Pulangan</th>
                  <th>SP RAM</th>
                  <th>Selisih</th>
                  <th>Status</th>
                  <th>Persentase</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(item => (
                  <tr key={item.id}>
                    <td>{formatTanggal(item.tanggal)}</td>
                    <td>{item.nomor_polisi}</td>
                    <td>{item.nama_supir}</td>
                    <td>{formatAngka(item.sp_pabrik)}</td>
                    <td>{formatAngka(item.buah_pulangan)}</td>
                    <td>{formatAngka(item.sp_ram)}</td>
                    <td>{formatAngka(item.selisih)}</td>
                    <td>
                        <span className={`badge ${
                          item.status === 'normal' || item.status === 'kelebihan'
                            ? 'badge-success'
                            : 'badge-error'
                        }`}>
                          {item.status}
                        </span>

                    </td>
                    <td>{formatAngka(item.persentase)}%</td>
                    <td>
                      <button 
                        className="btn btn-error btn-sm"
                        onClick={() => handleDelete(item)}
                        aria-label="Hapus"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={paginate}
            />
          )}
        </>
      )}
    </div>
  )
}

export default SusutTimbangan