import { NextApiResponse, NextApiRequest } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';

const usuarioEndpoint = (req: NextApiRequest, res: NextApiResponse) =>{
    return res.status(200).json({msg: 'Usuario autenticado com sucesso.'})
}

export default validarTokenJWT(usuarioEndpoint);