import { Module } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { PokemonController } from "./pokemon.controller"; // Importe o Controller

@Module({
  // ⭐️ Declare o Controller aqui ⭐️
  controllers: [PokemonController],
  // O Service já estava aqui
  providers: [PokemonService],
})
export class PokemonModule {}
