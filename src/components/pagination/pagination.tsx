import Link from 'next/link'
import './pagination.css'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  buildHref: (page: number) => string
}

export default function Pagination({
  page,
  totalPages,
  total,
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Paginacao de produtos">
      <div className="pagination-info">
        <span>{total} produtos</span>
        <span>Pagina {page} de {totalPages}</span>
      </div>

      <div className="pagination-controls">
        {page > 1 ? (
          <Link href={buildHref(page - 1)} className="pagination-btn pagination-btn-prev">
            ← Anterior
          </Link>
        ) : (
          <span className="pagination-btn pagination-btn-disabled">
            ← Anterior
          </span>
        )}

        {page < totalPages ? (
          <Link href={buildHref(page + 1)} className="pagination-btn pagination-btn-next">
            Proxima →
          </Link>
        ) : (
          <span className="pagination-btn pagination-btn-disabled">
            Proxima →
          </span>
        )}
      </div>
    </nav>
  )
}
