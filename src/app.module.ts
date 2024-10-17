import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './common/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfiguration ]}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public')
    }),
    MongooseModule.forRoot( process.env.MONGO_DB ),
    PokemonModule,
    CommonModule,
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
