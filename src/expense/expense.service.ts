import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { money } from './utils';

@Injectable()
export class ExpenseService {

  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) { }

  async createExpense(value: number, description: string, user: string): Promise<string> {
    try {

      const createdExpense = await this.expenseRepository.create({ value, description, user });

      const savedExpense = await this.expenseRepository.save(createdExpense);

      const message = `Despesa adicionada! ✅ \nID: ${savedExpense.id_expense} \nR$: ${money(Number(value))} \nDescrição: ${description} \nData: ${savedExpense.created_at.toLocaleDateString('pt-BR')} `;

      return message;

    } catch (error) {

      return `❌ Erro ao adicionar despesa: ${error.message} ❌ `;

    }
  }

  async deleteExpenseById(idExpense: number, user: string): Promise<string> {
    const expense = await this.expenseRepository.findOne({
      where: { id_expense: idExpense, user }
    });

    if (!expense) {
      return `❌ Despesa com ID ${idExpense} não encontrada para o usuário ${user} ❌`;
    }

    await this.expenseRepository.remove(expense);
    return `Despesa com ID ${idExpense} removida com sucesso ✅`;
  }

  async getAllExpensesByUser(user: string): Promise<string> {

    const expenses = await this.expenseRepository.find(
      {
        where: { user },
        order: { created_at: 'ASC' }
      }
    );

    if (expenses.length === 0) {
      return '❌ Nenhuma despesa encontrada ❌ ';
    }

    const total = expenses.reduce((acc, e) => acc + Number(e.value), 0);

    const expensesList = expenses.map(exp =>
      `ID: ${exp.id_expense} | R$: ${money(Number(exp.value))} | ${exp.description} | Data: ${exp.created_at.toLocaleDateString('pt-BR')}`
    ).join('\n\n');

    const message = `💴 Suas despesas:\n\n${expensesList}\n\nTotal: R$ ${money(total)}`;

    return message;

  }

  async getAllMonthExpensesByUser(user: string, month: number, year: number): Promise<string> {

    const qb = this.expenseRepository.createQueryBuilder('expense')
      .where('expense."user" = :user', { user })
      .andWhere('expense.created_at >= make_date(:year, :month, 1)', { year, month })
      .andWhere('expense.created_at < (make_date(:year, :month, 1) + INTERVAL \'1 month\')', { year, month })
      .orderBy('expense.created_at', 'ASC');

    const expenses = await qb.getMany();

    if (expenses.length === 0) {
      return `❌ Nenhuma despesa encontrada para ${month}/${year} ❌ `;
    }

    const total = expenses.reduce((acc, e) => acc + Number(e.value), 0);

    const expensesList = expenses.map(exp =>
      `ID: ${exp.id_expense} | R$: ${money(Number(exp.value))} | ${exp.description} | Data: ${exp.created_at.toLocaleDateString('pt-BR')}`
    ).join('\n\n');

    return `💴 Suas despesas para ${month}/${year}:\n\n${expensesList}\n\nTotal: R$ ${money(total)}`;

  }

  async getAllUserExpensesByDescription(user: string, description: string): Promise<string> {

    const expenses = await this.expenseRepository.find({
      where: { user, description },
      order: { created_at: 'ASC' }
    });

    if (expenses.length === 0) {
      return `❌ Nenhuma despesa encontrada com a descrição "${description}" ❌ `;
    }

    const total = expenses.reduce((acc, e) => acc + Number(e.value), 0);

    const expensesList = expenses.map(exp =>
      `ID: ${exp.id_expense} | R$: ${money(Number(exp.value))} | ${exp.description} | Data: ${exp.created_at.toLocaleDateString('pt-BR')}`
    ).join('\n\n');

    const message = `💴 Suas despesas com a descrição "${description}":\n\n${expensesList}\n\nTotal: R$ ${money(total)}`;

    return message;
  }

}
