import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
      <div className="text-center max-w-md">
        {/* Icon atau gambar */}
        <div className="text-9xl font-bold text-error mb-4">404</div>
        
        {/* Judul */}
        <h1 className="text-3xl font-bold mb-2">Halaman Tidak Ditemukan</h1>
        
        {/* Deskripsi */}
        <p className="text-lg mb-6">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        
        {/* Tombol kembali */}
        <Link 
          to="/" 
          className="btn btn-primary"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}