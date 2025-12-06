import { Controller, Get, Param, Query } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";

@Controller("pokemon") // Define a rota base como /pokemon
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  /**
   * Rota: GET /pokemon
   * Rota: GET /pokemon?page=2&perPage=10
   * Lista Pokémons com paginação opcional.
   */
  @Get()
  async list(
    @Query("page") page: string = "1", // Pega 'page' do Query String (default 1)
    @Query("perPage") perPage: string = "20" // Pega 'perPage' do Query String (default 20)
  ) {
    // Converte as strings do Query para números inteiros
    const pageNum = parseInt(page, 10);
    const perPageNum = parseInt(perPage, 10);

    return this.pokemonService.list(pageNum, perPageNum);
  }

  /**
   * Rota: GET /pokemon/:nameOrId
   * Ex: GET /pokemon/pikachu ou GET /pokemon/25
   * Busca detalhes de um Pokémon específico.
   */
  @Get(":nameOrId")
  async detail(@Param("nameOrId") nameOrId: string) {
    return this.pokemonService.detail(nameOrId);
  }
}
