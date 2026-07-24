import 'server-only'

import { fetchServerApi } from '@/service/server_api'
import { Profile } from './use_permission'

export async function getProfile(
  token: string
): Promise<Profile | undefined> {
  const response = await fetchServerApi('/user-bff/profile', {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok || response.status === 204) return undefined

  const body = await response.text()
  if (!body.trim()) return undefined

  return JSON.parse(body) as Profile
}
