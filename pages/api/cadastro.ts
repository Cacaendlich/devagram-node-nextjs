// Essas linhas importam os módulos e tipos necessários para a função de API.
import type { NextApiRequest, NextApiResponse } from 'next';
import { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import { cadastroRequisicao } from '../../types/cadastroRequisicao';
import { UsuarioModel } from '../../models/usuarioModel';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import md5 from 'md5';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';
import nc from "next-connect";

const handler = nc()
    .use(upload.single('file')) //Middleware para upload de arquivo único com o nome 'file'
    .post(
        async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
            try {
                //validações
                const usuario = req.body as (cadastroRequisicao); //As asserções de tipo (as(...);) em TypeScript, permitem especificar tipos mais específicos.


                //depois usar regex para as validações ↓

                // Validação do nome do usuário
                if (!usuario.nome || usuario.nome.length < 2) {
                    return res.status(400).json({ error: 'Nome inválido.' });
                }

                // Validação do e-mail do usuário
                if (!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')) {
                    return res.status(400).json({ error: 'Email inválido.' });
                }

                // Validação da senha do usuário
                if (!usuario.senha || usuario.senha.length < 4) {
                    return res.status(400).json({ error: 'Senha inválido.' });
                }

                // Verificação se já existe usuário com o mesmo e-mail
                const usuariosComOMesmoEmail = await UsuarioModel.find({ email: usuario.email });
                if (usuariosComOMesmoEmail && usuariosComOMesmoEmail.length > 0) {
                    return res.status(400).json({ error: 'Já existe uma conta com o email informado.' });

                }

                // enviar a imagem do multer para o cosmic
                //porcessamento da imagem
                const imagem = await uploadImagemCosmic(req);

                // salvar no banco de dados
                const UsuarioASerSalvo = {
                    nome: usuario.nome,
                    email: usuario.email,
                    senha: md5(usuario.senha), //// Criptografa a senha usando md5 antes de salvar
                    avatar: imagem?.media?.url
                }
                await UsuarioModel.create(UsuarioASerSalvo);
                return res.status(200).json({ msg: 'Usuário cadastrado com sucesso.' });
            } catch (e: any) {
                //console.log(e);
                return res.status(500).json({ error: e.toString() });
            }

        });
// mudando configuração padrão do next.js nessa API, pra que o bodyPArse não a transforne em json.
export const config = {
    api: {
        bodyParser: false
    }
};

export default conectarMongoDB(handler);