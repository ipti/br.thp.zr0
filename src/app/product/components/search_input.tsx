'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SearchInput({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set('q', value.trim())
      } else {
        params.delete('q')
      }

      router.replace(`/product${params.toString() ? `?${params.toString()}` : ''}`)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [router, searchParams, value])

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Buscar produtos por nome ou descricao"
      className="w-full md:w-30rem p-3 border-round border-1 surface-border"
    />
  )
}
