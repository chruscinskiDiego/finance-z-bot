import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {

    constructor(){}

    async getPingResponse(userFirstName: string, userLastName: string): Promise<string> {
        return `✅ Servidor online, pode utilizar a aplicação à vontade ${userFirstName} ${userLastName}!`;
    }

    async getHelpResponse(): Promise<string> {
        return '💡 Comandos:'
        + '\n/ping - testar conexão'
        + '\n/help - ajuda' 
        + '\n/add <valor> <descrição> - adicionar despesa'
        + '\n/del <id> - remover despesa pelo ID'
        + '\n/all - listar todas as despesas'
        + '\n/bym <mês> <ano> - listar despesas do mês e ano (ex: /bym 03 2024)'
        + '\n/byd <descrição> - listar despesas pela descrição (ex: /byd mercado)';
    }

}
