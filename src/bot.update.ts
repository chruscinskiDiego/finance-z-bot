import { Update, Start, Help, Hears, On, Ctx, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('Olá 👋 Eu estou vivo! Envie "ping" para testar.');
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply('Comandos:\n/start - iniciar\n/ping - testar\n/help - ajuda');
  }

  @Command('ping')
  async onPingCmd(@Ctx() ctx: Context) {
    await ctx.reply('salve tchola do comando ' + ctx.message?.from?.first_name + ' ' + ctx.message?.from?.last_name);
  }

  /*@Hears('ping')
  async onPingText(@Ctx() ctx: Context) {
    await ctx.reply('salve tchola');
  }*/

  // exemplo: ecoa texto após "/echo ..."
  @Hears(/^\/echo (.+)/)
  async onEcho(@Ctx() ctx: Context & { match: RegExpExecArray }) {
    const text = ctx.match[1];
    if (text) await ctx.reply(text);
  }

  // captura qualquer mensagem (útil para logs)
  @On('message')
  async onAny(@Ctx() ctx: Context) {
    // console.log(ctx.message); // se quiser inspecionar
  }
}
