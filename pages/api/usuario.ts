//Rota de teste
//quando essa rota é acessada, o middleware validarTokenJWT verifica o token JWT e, se for válido, a função usuarioEndpoint é executada e retorna a mensagem de sucesso.
import { NextApiResponse, NextApiRequest } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';

const usuarioEndpoint = (req: NextApiRequest, res: NextApiResponse) =>{
    return res.status(200).json({msg: 'Usuario autenticado com sucesso.'})
}

export default validarTokenJWT(usuarioEndpoint);