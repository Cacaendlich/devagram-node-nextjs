//Rota de teste
//quando essa rota é acessada, o middleware validarTokenJWT verifica o token JWT e, se for válido, a função usuarioEndpoint é executada e retorna a mensagem de sucesso.
import { NextApiResponse, NextApiRequest } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import { UsuarioModel } from '../../models/usuarioModel';

const usuarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) =>{
    
    try {
        //pegar os dados do usuario pela _id
        const {userId} = req?.query;
        const usuario = await UsuarioModel.findById(userId); //o método "findById" do modelo "UsuarioModel" é usado para buscar um usuário no banco de dados com base no "userId" fornecido.
        usuario.senha = null;
        return res.status(200).json(usuario);
        
    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({error: 'Erro 400: Não foi possível obter dados do usuário.'});
}

export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));