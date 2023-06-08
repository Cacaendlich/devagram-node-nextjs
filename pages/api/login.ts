import type{NextApiRequest, NextApiResponse} from 'next';
import { conectarMongpDB } from '../../middlewares/conectarMongoDB';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import { UsuarioModel } from '../../models/usuarioModel';
import md5 from 'md5';

    const endpointLogin = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        if (req.method === 'POST') {
            const {login, senha} = req.body; // quando o usuário interage com o sistema e fornece seu email e senha, esses valores são capturados no código através dessa linha.
            const usuariosEncontrados = await UsuarioModel.find({email: login, senha: md5(senha)});

            if (usuariosEncontrados && usuariosEncontrados.length > 0){
                //Se um usuário for encontrado, obtém o primeiro usuário (usuariosEncontrados[0])
                const usuarioEncontrado = usuariosEncontrados[0];
                return res.status(200).json({msg: `Usuário ${usuarioEncontrado.nome} autenticado com sucesso.`});
            } return res.status(400).json({error: 'Usuário ou Senha não encontrado.'});

        } return res.status(405).json({error: 'Método informado não é válido.'});
    }

export default conectarMongpDB (endpointLogin); //Exporta a função endpointLogin envolta na função conectarMongpDB, que é usada para conectar ao MongoDB antes de executar a função do endpoint.