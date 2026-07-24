'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import type { Category } from '@/app/seller/product/type'
import ZDropdown from '@/components/dropdown/dropdown'
import './product_filter.css'

interface ProductFiltersProps {
  q: string
  categoryId: string
  sort: string
  categories: Category[]
}

const sortOptions = [
  { label: 'Relevancia', value: '' },
  { label: 'Menor preco', value: 'price_asc' },
  { label: 'Maior preco', value: 'price_desc' },
  { label: 'A-Z', value: 'name_asc' },
]

export function ProductFilters({
  q,
  categoryId,
  sort,
  categories,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(q)
  const [isPending, startTransition] = useTransition()
  const categoryOptions = [
    { label: 'Todas as categorias', value: '' },
    ...categories.map((category) => ({
      label: category.name,
      value: String(category.id),
    })),
  ]

  useEffect(() => {
    if (search.trim() === q.trim()) return

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search.trim()) {
        params.set('q', search.trim())
      } else {
        params.delete('q')
      }
      params.delete('page')
      startTransition(() => {
        router.replace(`/product?${params.toString()}`)
      })
    }, 300)

    return () => clearTimeout(timeout)
  }, [q, search, searchParams, router])

  const handleCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('categoryId', value)
    } else {
      params.delete('categoryId')
    }
    params.delete('page')
    startTransition(() => {
      router.replace(`/product?${params.toString()}`)
    })
  }

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    startTransition(() => {
      router.replace(`/product?${params.toString()}`)
    })
  }

  return (
    <div className="filters-container">
      {isPending && (
        <div className="filters-loading-overlay" role="status" aria-live="polite">
          <span className="filters-loading-spinner" aria-hidden="true" />
          <span>Carregando produtos...</span>
        </div>
      )}

      <div className="filters-content">
        <div className="filters-wrapper">
          <div className="search-box">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos por nome ou descricao"
              className="search-input"
            />
          </div>

          <div className="filters-right">
            <div className="filters-label">
              <i className="pi pi-filter" />
              <span>Filtros:</span>
            </div>

            <ZDropdown
              value={categoryId}
              options={categoryOptions}
              onChange={(e) => handleCategory(e.value)}
              optionLabel="label"
              optionValue="value"
              disabled={isPending}
              className="filters-select"
            />

            <ZDropdown
              value={sort}
              options={sortOptions}
              onChange={(e) => handleSort(e.value)}
              optionLabel="label"
              optionValue="value"
              disabled={isPending}
              className="filters-select"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
