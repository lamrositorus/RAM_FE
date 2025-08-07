import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const showingText = `Menampilkan ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, totalItems)} dari ${totalItems} data`

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getVisiblePages = () => {
    if (windowWidth < 640) { // Mobile
      if (currentPage === 1) return [1, 2, 3].filter(p => p <= totalPages)
      if (currentPage === totalPages) return [totalPages-2, totalPages-1, totalPages].filter(p => p >= 1)
      return [currentPage-1, currentPage, currentPage+1].filter(p => p >= 1 && p <= totalPages)
    } else { // Desktop/Tablet
      return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        if (currentPage <= 3) return i + 1
        if (currentPage >= totalPages - 2) return totalPages - 4 + i
        return currentPage - 2 + i
      }).filter(p => p >= 1 && p <= totalPages)
    }
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex flex-col items-center gap-4 mt-4 w-full">
      {/* Teks informasi di atas */}
      <div className="text-sm text-center w-full">
        {showingText}
      </div>
      
      {/* Navigasi halaman di bawah */}
      <div className="join flex-wrap justify-center">
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          «
        </button>
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>

        {!visiblePages.includes(1) && (
          <button className="join-item btn btn-sm disabled" disabled>
            ...
          </button>
        )}

        {visiblePages.map(number => (
          <button
            key={number}
            className={`join-item btn btn-sm ${currentPage === number ? 'btn-active' : ''}`}
            onClick={() => onPageChange(number)}
            aria-label={`Page ${number}`}
          >
            {number}
          </button>
        ))}

        {!visiblePages.includes(totalPages) && totalPages > 0 && (
          <button className="join-item btn btn-sm disabled" disabled>
            ...
          </button>
        )}

        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default Pagination