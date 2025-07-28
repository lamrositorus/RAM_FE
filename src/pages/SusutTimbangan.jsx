import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { postSusutTimbangan, getSusutTimbangan } from '../API/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import ConfirmModal from '../components/ConfirmModal'
import { FaSpinner } from 'react-icons/fa'

export const SusutTimbangan = () => {
  const { token } = useAuth()

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [filter, setFilter] = useState({
    tanggal: '',
    nomor_polisi: '',
    nama_supir: '',
  })

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

    setIsConfirmOpen(true)
  }

  const confirmSubmit = async () => {
    setIsConfirmOpen(false)
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
      setCurrentPage(1) // Reset to first page after adding new data
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter data based on filter criteria
  const filteredData = list.filter(item => {
    const cocokTanggal = !filter.tanggal || item.tanggal.startsWith(filter.tanggal)
    const cocokPolisi = item.nomor_polisi.toLowerCase().includes(filter.nomor_polisi.toLowerCase())
    const cocokSupir = item.nama_supir.toLowerCase().includes(filter.nama_supir.toLowerCase())
    return cocokTanggal && cocokPolisi && cocokSupir
  })

  // Calculate pagination
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Input Data Susut Timbangan</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        <div className="md:col-span-2">
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
        isOpen={isConfirmOpen}
        title="Konfirmasi Simpan Data"
        message="Apakah Anda yakin ingin menyimpan data susut timbangan ini?"
        onConfirm={confirmSubmit}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={isSubmitting}
      />

      <h2 className="text-xl font-semibold mb-2">Filter Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          name="tanggal"
          className="input input-bordered"
          value={filter.tanggal}
          onChange={(e) => {
            setFilter(prev => ({ ...prev, tanggal: e.target.value }))
            setCurrentPage(1) // Reset to first page when filtering
          }}
        />
        <input
          type="text"
          placeholder="Filter Nomor Polisi"
          className="input input-bordered"
          value={filter.nomor_polisi}
          onChange={(e) => {
            setFilter(prev => ({ ...prev, nomor_polisi: e.target.value }))
            setCurrentPage(1) // Reset to first page when filtering
          }}
        />
        <input
          type="text"
          placeholder="Filter Nama Supir"
          className="input input-bordered"
          value={filter.nama_supir}
          onChange={(e) => {
            setFilter(prev => ({ ...prev, nama_supir: e.target.value }))
            setCurrentPage(1) // Reset to first page when filtering
          }}
        />
        <button
          className="btn btn-secondary"
          onClick={() => {
            setFilter({ tanggal: '', nomor_polisi: '', nama_supir: '' })
            setCurrentPage(1) // Reset to first page when resetting filter
          }}
        >
          Reset Filter
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Data Susut Timbangan</h2>
      {loading ? (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : list.length === 0 ? (
        <p>Tidak ada data</p>
      ) : (
        <>
          <div className="overflow-x-auto mb-4">
            <table className="table table-zebra w-full min-w-[800px]">
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
                  <th>Persentase (%)</th>
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
                    <td>{item.status}</td>
                    <td>{formatAngka(item.persentase)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div>
              Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} dari {totalItems} data
            </div>
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              <button
                className="join-item btn"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  className={`join-item btn ${currentPage === number ? 'btn-active' : ''}`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              ))}
              <button
                className="join-item btn"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
              <button
                className="join-item btn"
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SusutTimbangan