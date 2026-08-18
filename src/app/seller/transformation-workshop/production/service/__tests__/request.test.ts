import http from '@/service/axios'
import { requestProductions } from '../request'

jest.mock('@/service/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}))

const mockedGet = http.get as jest.MockedFunction<typeof http.get>

describe('consultas paginadas da produção', () => {
  beforeEach(() => mockedGet.mockReset())

  it('respeita o limite máximo da API e reúne todas as páginas', async () => {
    mockedGet
      .mockResolvedValueOnce({
        data: {
          data: [{ id: 1 }],
          pagination: { page: 1, limit: 100, total: 101, totalPages: 2 },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [{ id: 2 }],
          pagination: { page: 2, limit: 100, total: 101, totalPages: 2 },
        },
      })

    const result = await requestProductions('7')

    expect(mockedGet).toHaveBeenNthCalledWith(1, '/production', {
      params: { idTransformationWorkshop: '7', page: 1, limit: 100 },
    })
    expect(mockedGet).toHaveBeenNthCalledWith(2, '/production', {
      params: { idTransformationWorkshop: '7', page: 2, limit: 100 },
    })
    expect(result.data.map(item => item.id)).toEqual([1, 2])
  })
})
