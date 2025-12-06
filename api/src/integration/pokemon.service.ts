import { Injectable } from "@nestjs/common";
import axios from "axios";
@Injectable()
export class PokemonService {
  private base = "https://pokeapi.co/api/v2";
  async list(page = 1, perPage = 20) {
    const offset = (page - 1) * perPage;
    const url = `${this.base}/pokemon?limit=${perPage}&offset=${offset}`;
    const r = await axios.get(url);
    return r.data;
  }
  async detail(nameOrId: string) {
    const url = `${this.base}/pokemon/${encodeURIComponent(nameOrId)}`;
    const r = await axios.get(url);
    return r.data;
  }
}
