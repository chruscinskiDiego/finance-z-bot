import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotReceptor } from './bot.receptor';
import { ExpenseModule } from 'src/expense/expense.module';

@Module({
  providers: [BotService, BotReceptor],
  imports: [ExpenseModule]
})
export class BotModule {}
