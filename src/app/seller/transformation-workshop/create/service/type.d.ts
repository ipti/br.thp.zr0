export interface CreateTransformationWorkshopTypes {
  name: string;
  cnpj: string;

  address?: string;

  cep?: string;

  number?: string;

  complement?: string;

  neighborhood?: string;

  city_fk?: number;

  state_fk?: number;
}
