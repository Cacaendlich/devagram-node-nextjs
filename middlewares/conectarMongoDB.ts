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
    
    mongoose.connection.on('connected', () => console.log('Banco de dados conectado.'));
    mongoose.connection.on('error', error => console.log(`Ocorreu erro ao conectar no banco: ${error}`));
    //Essas duas linhas de código configuram os eventos 'connected' e 'error' para a conexão do Mongoose antes de estabelecer a conexão com o banco de dados usando await mongoose.connect(DB_CONEXAO_STRING). Isso garante que o código estará preparado para lidar com esses eventos assim que a conexão for estabelecida.
    await mongoose.connect(DB_CONEXAO_STRING);

    // agora posso seguir para o endpoit, pois estou conectado no banco.
    return handler(req, res);
    // módulo de conexão com o banco de dados pronto.
}