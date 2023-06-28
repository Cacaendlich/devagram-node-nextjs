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

            const authorization = req.headers['authorization'];
            if (!authorization){
                return res.status(401).json({error: 'Não foi possível validar o token de acesso.'});
            }

            const token = authorization.substring(7);
            if (!token){
                return res.status(401).json({error: 'Não foi possível validar o token de acesso.'});
            }

            const decoded = await jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
            if (!decoded){
                return res.status(401).json({error: 'Não foi possível validar o token de acesso.'});
            }

            if (!req.query){
                req.query = {};
            }

            req.query.userID = decoded._id;
        }

    } catch(e) {
        console.log(e);
        return res.status(401).json({error: 'Não foi possível validar o token de acesso.'});

    }

    return handler(req, res);

}