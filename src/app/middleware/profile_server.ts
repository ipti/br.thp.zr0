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

  if (!response.ok) return undefined
  return response.json()
}
