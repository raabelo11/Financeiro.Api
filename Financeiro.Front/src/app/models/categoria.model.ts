export interface Categoria {
  id: number;
  nome: string;
  icone: string;
  cor: string;
  quantidadeLancamentos: number;
}

export interface CategoriaPayload {
  nome: string;
  icone: string;
  cor: string;
}
