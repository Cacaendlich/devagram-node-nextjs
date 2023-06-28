import type{NextApiRequest, NextApiResponse} from 'next';
import { conectarMongpDB } from '../../middlewares/conectarMongoDB';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import type {loginResposta} from '../../types/loginResposta';
import { UsuarioModel } from '../../models/usuarioModel';
import md5 from 'md5'; //criptográfia
import jwt from 'jsonwebtoken'; // gestão do token

    const endpointLogin = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | loginResposta>) => {

        const {MINHA_CHAVE_JWT} = process.env;
        if (!MINHA_CHAVE_JWT){
            return res.status(500).json({ error : 'ENV jwt não informada.'})
        }

        if (req.method === 'POST') {
            const {login, senha} = req.body; // quando o usuário interage com o sistema e fornece seu email e senha, esses valores são capturados no código através dessa linha.
            const usuariosEncontrados = await UsuarioModel.find({email: login, senha: md5(senha)});

            if (usuariosEncontrados && usuariosEncontrados.length > 0){
                //Se um usuário for encontrado, obtém o primeiro usuário (usuariosEncontrados[0])
                const usuarioEncontrado = usuariosEncontrados[0];

                const token = jwt.sign({_id: usuarioEncontrado._id}, MINHA_CHAVE_JWT);

                return res.status(200).json({nome: usuarioEncontrado.nome, email: usuarioEncontrado.email, token});

            } return res.status(400).json({error: 'Usuário ou Senha não encontrado.'});

        } return res.status(405).json({error: 'Método informado não é válido.'});
    }

export default conectarMongpDB (endpointLogin); //Exporta a função endpointLogin envolta na função conectarMongpDB, que é usada para conectar ao MongoDB antes de executar a função do endpoint.