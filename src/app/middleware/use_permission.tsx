export interface Profile {
  id: number
  role: string
  createdAt: string
  updatedAt: string
  menu: Menu[]
  pages: Page[]
}

export interface Menu {
  id: number
  profileId: number
  label: string
  link: string
  icon: string
  order: number
}

export interface Page {
  id: number
  profileId: number
  page: string
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}
