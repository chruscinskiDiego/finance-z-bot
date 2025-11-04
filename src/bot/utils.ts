import { Context } from "telegraf";

export function extractArgs(ctx: Context): string {
  const msg = (ctx.message as any);
  const text: string = msg?.text ?? '';
  const cmdEnt = msg?.entities?.find((e: any) => e.type === 'bot_command' && e.offset === 0);
  if (cmdEnt) return text.slice(cmdEnt.length).trim();
  return text.replace(/^\/\w+(?:@\w+)?\s*/, '').trim();
}

export function parsePtBrNumber(token: string): number | null {
  const cleaned = token
    .trim()
    .replace(/^R\$\s?/i, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}