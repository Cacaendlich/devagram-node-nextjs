import type {NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose, { Mongoose } from "mongoose";
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg';

export const conectarMongpDB = (handler:NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) =>{
    //  conectarMongpDB é um middleware que recebe um manipulador (handler) de API Next.js como parâmetro.
    // verificar se o banco está conectado, se estiver segir para o endpoint ou para o proximo middleware.
    if (mongoose.connections[0].readyState) {
        return handler(req,res);
    }
    // Já que não está conctado, vamos conectar.
    // 1 - Obter a variável de ambiente preenchida do env.
    const {DB_CONEXAO_STRING} = process.env;
    // Se a env estiver vazia(não preenchida), aborte o uso do sistema e avide o programador.
    if(!DB_CONEXAO_STRING){
        return res.status(500).json({ error : 'ENV de configuração do banco, não informado.'});
    }
    
    mongoose.connection.on('connected', () => console.log('Banco de dados conectado.')); // Essa linha de código define um ouvinte de evento no objeto mongoose.connection para o evento 'connected'.
    // Quando a conexão com o banco de dados é estabelecida com sucesso, o evento 'connected' é disparado, e a função de callback associada a esse evento é executada. No caso desse código, a função de callback é uma arrow function () => console.log('Banco de dados conectado.'), que imprime a mensagem "Banco de dados conectado." no console.
    mongoose.connection.on('error', error => console.log(`Ocorreu erro ao conectar no banco: ${error}`));
    await mongoose.connect(DB_CONEXAO_STRING);

    // agora posso seguir para o endpoit, pois estou conectado no banco.
    return handler(req, res);
    // módulo de conexão com o banco de dados pronto.
}