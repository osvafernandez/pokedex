import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeData } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {

  constructor(private readonly pokemonService: PokemonService) {}

  private readonly axios: AxiosInstance = axios;

  async executeSeed(){
    const { data } = await this.axios.get<PokeData>(`https://pokeapi.co/api/v2/pokemon?limit=500`);
    data.results.forEach( ({name, url})=>{
      const segment = url.split('/');
      const no: number = +segment[ segment.length - 2 ];
      this.pokemonService.create({no: no, name: name});
    } );
    return data.results;
  }
}
