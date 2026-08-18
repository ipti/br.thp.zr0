import http from '@/service/axios'
import {
  PaginatedResponse,
  ProductionCapacity,
  ProductionItem,
  ProductionStatus,
} from './types'

const PAGE_LIMIT = 100

async function requestAllPages<T>(path: string, idWorkshop: string) {
  const params = {
    idTransformationWorkshop: idWorkshop,
    page: 1,
    limit: PAGE_LIMIT,
  }
  const firstResponse = await http.get<PaginatedResponse<T>>(path, { params })
  const firstPage = firstResponse.data

  if (firstPage.pagination.totalPages <= 1) return firstPage

  const remainingPages = await Promise.all(
    Array.from(
      { length: firstPage.pagination.totalPages - 1 },
      (_, index) => index + 2,
    ).map(page =>
      http.get<PaginatedResponse<T>>(path, { params: { ...params, page } }),
    ),
  )

  return {
    data: [
      ...firstPage.data,
      ...remainingPages.flatMap(response => response.data.data),
    ],
    pagination: firstPage.pagination,
  }
}

export async function requestProductions(idWorkshop: string) {
  return requestAllPages<ProductionItem>('/production', idWorkshop)
}

export async function requestCapacities(idWorkshop: string) {
  return requestAllPages<ProductionCapacity>(
    '/production-capacity',
    idWorkshop,
  )
}

export async function updateProduction(
  id: number,
  body: { producedQuantity: number; productionStatus?: ProductionStatus },
) {
  const response = await http.patch<ProductionItem>(`/production/${id}`, body)
  return response.data
}

export async function createProduction(body: {
  idTransformationWorkshop: number
  idProduct: number
  quantity: number
  productionStatus: ProductionStatus
}) {
  const response = await http.post<ProductionItem>('/production', body)
  return response.data
}

export async function updateCapacity(
  workshopId: number,
  productId: number,
  body: { monthlyCapacity: number; active: boolean },
) {
  const response = await http.patch<ProductionCapacity>(
    `/production-capacity/${workshopId}/${productId}`,
    body,
  )
  return response.data
}
