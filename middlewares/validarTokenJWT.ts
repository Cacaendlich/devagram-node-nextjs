import type {NextApiRequest, NextApiResponse, NextApiHandler } from "next"; // NextApiHandler é manipulador de API Next.js
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg';
import jwt, {JwtPayload} from "jsonwebtoken";

export const validarTokenJWT = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {

    try {
        
        const {MINHA_CHAVE_JWT} = process.env;

        if(!MINHA_CHAVE_JWT){
            return res.status(500).json({error: 'ENV chave jwt não informada na execução do projeto.' });
        }

        if (!req || !req.headers){
            // req.headers (que contém os cabeçalhos da requisição), nesse caso validando se são nulos.
            return res.status(401).json({error: 'Não foi possível validar o token de acesso.'});
        }

        if (req.method !== 'OPTIONS'){

            const authorization = req.headers['authorization'];//inicialização com o valor do cabeçalho "Authorization" da requisição. 
            if (!authorization){
                return res.status(401).json({error: 'Não foi possível validar o token de acesso.'});
            }

            const token = authorization.substring(7);//A função substring() retorna uma parte específica de uma string com base nos índices numéricos fornecidos.
            if (!token){
                return res.status(401).json({error: 'Não foi possível validar o token de acesso.'});
            }

            const decoded = await jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
            // A função jwt.verify() verifica e decodifica um token JWT. Recebe o token a ser verificado e a chave de assinatura e criptografia.
            // O tipo "JwtPayload" é usado para fazer a atribuição de tipo ao resultado decodificado do token JWT usando o operador "as" em TypeScript.

            if (!decoded){
                return res.status(401).json({error: 'Não foi possível validar o token de acesso.'});
            }

            if (!req.query){
                //checa se a requisição tem alguma query, se não tiver, criamos ela com o objeto(array) vazio.
                req.query = {};
            }

            req.query.userID = decoded._id;
            //A propriedade userID está sendo adicionada ao objeto req.query, se ela ainda não existir. Se já existir, seu valor será atualizado com o valor de decoded._id.
        }

    } catch(e) {
        console.log(e);
        return res.status(401).json({error: 'Não foi possível validar o token de acesso.'});

    }

    return handler(req, res);

}