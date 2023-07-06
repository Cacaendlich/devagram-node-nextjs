import type {NextApiResponse } from 'next';
import { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import nc from 'next-connect'; //precisa dele pras imagens
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'; // pra usar o use precisa od service.
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';

const handler = nc()
    .use(upload.single('file')) // esse 'file' pode ter outro nome se eu quiser, na aula vamos usar file, mas poderia ser 'publicacao'
    .post(async (req: any, res: NextApiResponse<respostaPadraoMsg>) => {
        
        try {
            if(!req || !req.body){
                return res.status(400).json({ error: 'Parâmetros de entrada não informados!' })
            }

            const { descricao} = req?.body;

            if (!descricao || descricao.length < 2) {
                return res.status(400).json({ error: 'Descrição não é válida!' })
            }

            if (!req.file) {
                return res.status(400).json({ error: 'Imagem é obrigatória!' })
            }

            return res.status(200).json({ msg: 'Publicação está válida!' })

        } catch (e: any) {
            console.log(e)
            return res.status(400).json({ error:'erro ao cadastrar publicação!'})
        }

    });

export const config = {
    api: {
        bodyParser: false
    }
}

export default validarTokenJWT(conectarMongoDB(handler));