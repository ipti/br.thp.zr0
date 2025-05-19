export type StateList = State[]

export interface State {
  id: number
  acronym: string
  name: string
  city: City[]
}

export interface City {
  id: number
  state_fk: number
  name: string
  cep_initial: string
  cep_final: string
  ddd1: number
  ddd2: number
}
