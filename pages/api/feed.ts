import { NextApiResponse, NextApiRequest } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg'
import { UsuarioModel } from '../../models/usuarioModel';
import { PublicacaoModel } from '../../models/publicacaoModel';
import publicacao from "./publicacao";

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) => {
    try {
        if(req.method === 'GET'){
            if(req?.query?.id){
                
                const usuario = await UsuarioModel.findById(req?.query?.id); //o método "findById" do modelo "UsuarioModel" é usado para buscar um usuário no banco de dados com base no "userId" fornecido.
                if(!usuario)[
                    //agora que eu tenho o id usuario. valido se ele é válido(existe)
                    res.status(400).json({error: 'Usuário não encontrado.'})  
                ]

                //buscar publicacoes
                const publicacoes = await PublicacaoModel
                    .find({idUsuario : usuario._id}) //listar
                    .sort({data : -1}); // e ordenar '-1' é decrescente

                return res.status(200).json(publicacoes);
            }
        } 
        return res.status(405).json({error: 'Método informado não é válido.'
    })
    } catch (e) {
        console.log(e);
        res.status(400).json({error: 'Não foi possível obter o feed.'})
    }
}

export default validarTokenJWT(conectarMongoDB(feedEndpoint));