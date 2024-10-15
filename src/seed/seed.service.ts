import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeData } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/interfaces/adapters/axios.adapter';


@Injectable()
export class SeedService {

  constructor(
    private readonly pokemonService: PokemonService,
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  private readonly axios: AxiosInstance = axios;

  async executeSeed(){
    // this.pokemonService.removeAll();
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeData>(`https://pokeapi.co/api/v2/pokemon?limit=20`);
    const pokemonToInsert: {name: string, no: number}[] = []; 

    data.results.forEach( ({name, url})=> {
      const segment = url.split('/');
      const no: number = +segment[ segment.length - 2 ];
      pokemonToInsert.push({name: name, no:no});
      // this.pokemonService.create({no: no, name: name});
    } );
    await this.pokemonModel.insertMany(pokemonToInsert);
    return data.results;
  }
}
