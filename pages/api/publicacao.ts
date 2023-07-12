import type {NextApiResponse } from 'next';
import { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import nc from 'next-connect'; //precisa dele pras imagens
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'; // pra usar o use precisa od service.
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import {PublicacaoModel} from '../../models/publicacaoModel';
import {UsuarioModel} from '../../models/usuarioModel';

const handler = nc()
    .use(upload.single('file')) // esse 'file' pode ter outro nome se eu quiser, na aula vamos usar file, mas poderia ser 'publicacao'
    .post(async (req: any, res: NextApiResponse<respostaPadraoMsg>) => {
        
        try {
            const {userId} = req.query; // o JWT joga o usuário pro req.query, peguei no 'validarToken' como chamei o usuario(userId)
            const usuario = await UsuarioModel.findById(userId); //buscar o usuario e bater com o banco.
            
            if(!usuario){ //validar se o usuario existe
                return res.status(400).json({ error: 'Usuário não encontrado!' });
            }

            if(!req || !req.body){
                return res.status(400).json({ error: 'Parâmetros de entrada não informados!' });
            }

            const { descricao } = req?.body;

            if (!descricao || descricao.length < 2) {
                return res.status(400).json({ error: 'Descrição não é válida!' });
            }

            if (!req.file || !req.file.originalname) {
                return res.status(400).json({ error: 'Imagem é obrigatória!' });
            }

            const image = await uploadImagemCosmic(req);

            const publicacao = {
                idUsuario: usuario._id,
                descricao,
                foto: image.media.url,
                data: new Date()
            }
            await PublicacaoModel.create(publicacao); //chamando banco pra criar a publicação

            return res.status(200).json({ msg: 'Publicação criada com sucesso!' });

        } catch (e: any) {
            console.log(e)
            return res.status(400).json({ error:'erro ao cadastrar publicação!'});
        }

    });

export const config = {
    api: {
        bodyParser: false
    }
}
// Ao usar api: { bodyParser: false }, o Next.js não processará automaticamente o corpo da solicitação para essa rota. Isso é útil quando se envia arquivos usando form-data e multer, permitindo acesso e processamento personalizado dos dados enviados.

export default validarTokenJWT(conectarMongoDB(handler));