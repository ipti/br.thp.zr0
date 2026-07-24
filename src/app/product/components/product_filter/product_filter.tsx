'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Category } from '@/app/seller/product/type'
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search.trim()) {
        params.set('q', search.trim())
      } else {
        params.delete('q')
      }
      params.delete('page')
      router.replace(`/product?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timeout)
  }, [search, searchParams, router])

  const handleCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('categoryId', value)
    } else {
      params.delete('categoryId')
    }
    params.delete('page')
    router.replace(`/product?${params.toString()}`)
  }

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    router.replace(`/product?${params.toString()}`)
  }

  return (
    <div className="filters-container">
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

            <select
              value={categoryId}
              onChange={(e) => handleCategory(e.target.value)}
              className="filters-select"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="filters-select"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
