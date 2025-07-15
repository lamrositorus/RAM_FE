import { Cog6ToothIcon } from '@heroicons/react/24/outline'

export const Modal = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-6">
      <div className="max-w-md text-center">
        {/* Ikon 3D / outline dari Heroicons */}
        <Cog6ToothIcon className="mx-auto mb-6 w-24 h-24 text-warning animate-spin-slow" />
        
        <h1 className="text-3xl font-bold mb-4 text-warning">Halaman Sedang Dalam Pengembangan</h1>
        <p className="text-base-content mb-6">
          Kami sedang menyiapkan fitur terbaik untuk Anda. Silakan kembali lagi nanti. Terima kasih atas kesabarannya!
        </p>
        <a href="/dashboard" className="btn btn-outline btn-primary">
          Kembali ke Beranda
        </a>
      </div>
    </div>
  )
}