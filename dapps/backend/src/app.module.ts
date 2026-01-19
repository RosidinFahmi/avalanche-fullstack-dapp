import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  imports: [ConfigModule.forRoot({ isGlobal: true }), BlockchainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
