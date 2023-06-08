import type {NextApiRequest, NextApiResponse} from 'next';
import { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import { cadastroRequisicao } from '../../types/cadastroRequisicao';
import {UsuarioModel} from '../../models/usuarioModel';
import {conectarMongpDB} from '../../middlewares/conectarMongoDB';
import md5 from 'md5';

const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
    //validaçãoas
    if (req.method === 'POST') {
        const usuario = req.body as (cadastroRequisicao);

        if (!usuario.nome || usuario.nome.length < 2){
            return res.status(400).json({error: 'Nome inválido.'});
        }

        if (!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')){
            return res.status(400).json({error: 'Email inválido.'});
        }

        if (!usuario.senha || usuario.senha.length < 4 ){
            return res.status(400).json({error: 'Senha inválido.'});
        }

        // validação se já existe usuário com o mesmo e-mail
        const usuariosComOMesmoEmail = await UsuarioModel.find({email: usuario.email});
        if (usuariosComOMesmoEmail && usuariosComOMesmoEmail.length > 0){
            return res.status(400).json({error: 'Já existe uma conta com o email informado.'});

        }

        // salvar no banco de dados
        const UsuarioASerSalvo = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha)
        }
        await UsuarioModel.create(UsuarioASerSalvo);
        return res.status(200).json({msg: 'Usuário cadastrado com sucesso.'});
    }
    return res.status(405).json({error: 'Método informado não é válido.'});
}

export default conectarMongpDB(endpointCadastro);