import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './modules/member/member.module';
import { BorrowingModule } from './modules/borrowing/borrowing.module';
import { BookModule } from './modules/book/book.module';
import { AuthorModule } from './modules/author/author.module';
import { MembershipCardModule } from './modules/membership-card/membership-card.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import dbConfig from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
      load: [appConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // entities: [User],
        type: 'postgres',
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'),
        port: configService.get('database.port'),
        host: configService.get('database.host'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
      }),
    }),
    MemberModule,
    MembershipCardModule,
    AuthorModule,
    BookModule,
    BorrowingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
