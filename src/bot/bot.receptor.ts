import { Update, Start, Help, Ctx, Command, On, Hears } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './bot.service';
import { extractArgs, parsePtBrNumber } from './utils';
import { ExpenseService } from 'src/expense/expense.service';
import { Message } from 'telegraf/types';

@Update()
export class BotReceptor {

  constructor(
    private readonly botService: BotService,
    private readonly expenseService: ExpenseService,
  ) { }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('🧟 💸 Huurrrr... Prazer, sou o FinanceZ, seu assistente financeiro, digite /help caso precise de ajuda');
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {

    const response = await this.botService.getHelpResponse();

    await ctx.reply(response);

  }

  @Hears(
    /^\/(?!start(?:\s|@|$)|help(?:\s|@|$)|ping(?:\s|@|$)|add(?:\s|@|$)|del(?:\s|@|$)|all(?:\s|@|$)|bym(?:\s|@|$)|byd(?:\s|@|$))[a-zA-Z0-9_]+(?:@.+)?(?:\s|$)/
  )
  async onUnknownCommand(@Ctx() ctx: Context) {
    const raw = (ctx.message as Message.TextMessage)?.text ?? '';
    const match = raw.match(/^\/([a-zA-Z0-9_]+)(?:@.+)?/);
    const cmd = match?.[1]?.toLowerCase();
    await ctx.reply(`🧟‍♂️: Hurrrr... Comando "/${cmd}" não reconhecido.\nDigite /help para ver os comandos disponíveis.`);
  }

  // 2) Fallback de texto: só casa mensagens que NÃO começam com "/"
  @Hears(/^[^/].+/)
  async onUnknownText(@Ctx() ctx: Context) {
    await ctx.reply('🧟‍♂️: Hurrrr.... Não entendi sua mensagem \nDigite /help para ver os comandos disponíveis.');
  }

  @On(['sticker', 'photo', 'document', 'audio', 'video', 'voice', 'location', 'contact'])
  async onUnsupported(@Ctx() ctx: Context) {
    await ctx.reply('🧟‍♂️: Hurrrr... No momento eu só entendo texto e comandos.\nDigite /help para ver os comandos disponíveis.');
  }

  @Command('ping')
  async onPingCmd(@Ctx() ctx: Context) {

    const response = await this.botService.getPingResponse(
      ctx.message?.from?.first_name || '',
      ctx.message?.from?.last_name || ''
    );

    await ctx.reply(response);
  }

  @Command('add')
  async onAddExpense(@Ctx() ctx: Context) {

    const args = extractArgs(ctx);

    if (!args) {
      ctx.reply('Uso: /add <valor> <descrição>\nEx: /add 150,20 Mensalidade');
      return;
    }

    const firstSpace = args.indexOf(' ');

    if (firstSpace === -1) {
      ctx.reply('Formato inválido. Ex: /add 150,20 Mensalidade');

      return;
    }

    const valueStr = args.slice(0, firstSpace);
    const description = args.slice(firstSpace + 1).trim();
    const value = parsePtBrNumber(valueStr);

    if (value === null || !description) {

      ctx.reply('Verifique o valor e a descrição. Ex: /add 150,20 Mensalidade');

      return;
    }

    console.log(`Adicionando: R$ ${value.toFixed(2).replace('.', ',')} — ${description}`);

    const newExpense = await this.expenseService.createExpense(value, description, ctx.message?.from?.first_name || '');

    ctx.reply(newExpense);

  }

  @Command('del')
  async onRemoveExpense(@Ctx() ctx: Context) {

    const args = extractArgs(ctx);

    if (!args) {
      ctx.reply('Uso: /rm <id>\nEx: /rm 3');
      return;
    }

    const id = parseInt(args.trim(), 10);

    if (isNaN(id)) {
      ctx.reply('ID inválido. Uso: /rm <id>\nEx: /rm 3');
      return;
    }

    const response = await this.expenseService.deleteExpenseById(id, ctx.message?.from?.first_name || '');

    ctx.reply(response);

  }

  @Command('all')
  async onGetAllExpenses(@Ctx() ctx: Context) {

    const response = await this.expenseService.getAllExpensesByUser(
      ctx.message?.from?.first_name || ''
    );
    ctx.reply(response);
  }


  @Command('bym')
  async onGetAllExpensesByMonth(@Ctx() ctx: Context) {

    const args = extractArgs(ctx);

    if (!args) {
      ctx.reply('Uso: /bym <mês> <ano>\nEx: /bym 5 2023');
      return;
    }

    const parts = args.trim().split(' ');

    if (parts.length !== 2) {
      ctx.reply('Formato inválido. Uso: /bym <mês> <ano>\nEx: /bym 5 2023');
      return;
    }

    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      ctx.reply('Mês ou ano inválido. Uso: /bym <mês> <ano>\nEx: /bym 5 2023');
      return;
    }

    const response = await this.expenseService.getAllMonthExpensesByUser(
      ctx.message?.from?.first_name || '',
      month,
      year
    );

    ctx.reply(response);

  }

  @Command('byd')
  async onGetAllExpensesByDescription(@Ctx() ctx: Context) {

    const args = extractArgs(ctx);

    if (!args) {
      ctx.reply('Uso: /by-description <descrição>\nEx: /by-description Mensalidade');

      return;
    }

    const description = args.trim();

    const response = await this.expenseService.getAllUserExpensesByDescription(
      ctx.message?.from?.first_name || '',
      description
    );

    ctx.reply(response);

  }

}
