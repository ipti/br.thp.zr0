import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { requestUserToken } from './request'

export const useFetchUserToken = (enabled = true) => {
  const hasToken = Boolean(Cookies.get('access_token'))

  return useQuery(['useUserToken'], () => requestUserToken(), {
    enabled: enabled && hasToken,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  })
}
