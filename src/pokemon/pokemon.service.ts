import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private default_limit: number;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ){
    this.default_limit = this.configService.get<number>('default_limit');
  }
 
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto); 
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const {limit = this.default_limit, offset = 0} = pagination; 
    return this.pokemonModel.find().limit(limit).skip(offset);
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    try{
      if (!isNaN(+term)) {
        pokemon = await this.pokemonModel.findOne({ no: term });
      }
      if ( !pokemon && isValidObjectId(term) ) {
        pokemon = await this.pokemonModel.findOne({ _id: term });
      }
      if ( !pokemon) {
        pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
      }
      if(!pokemon) throw new NotFoundException(`Not found pokemon with ${term}`);
      return pokemon;
    } catch(error){
      console.log(error);
      throw new InternalServerErrorException(`Pokemon not found.`);
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const modPoke = await this.findOne(term);
    try {
      if ( updatePokemonDto.name ){
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }
      await modPoke.updateOne( updatePokemonDto);
      
    } catch (error) {
      this.handleExceptions(error);
    }
    return { ...modPoke.toJSON(), ...updatePokemonDto };
  }

  async remove(id: string) {
    const result = await this.pokemonModel.deleteOne({ _id: id })
    if (result.deletedCount === 0) throw new BadRequestException(`Pokemon with id ${id} not found`);
    return result;
  }

  async removeAll(){
    await this.pokemonModel.deleteMany({});
  }

  private handleExceptions(error: any){
    console.log(error);
      if (error.code == 11000) throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)} `);
      throw new InternalServerErrorException({'error':error});
  }
}
