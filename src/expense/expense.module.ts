import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Expense])],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
