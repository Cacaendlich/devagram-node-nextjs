import type{NextApiRequest, NextApiResponse} from 'next';
import { conectarMongpDB } from '../../middlewares/conectarMongoDB';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';

    const endpointLogin = (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        if (req.method === 'POST') {
            const {login, senha} = req.body;

            if (login === 'admin@admin.com' && senha === 'admin123'){
                return res.status(200).json({msg: 'Usuário autenticado com sucesso.'});
            } return res.status(400).json({error: 'Usuário ou Senha não encontrado.'});

        } return res.status(405).json({error: 'Método informado não é válido.'});
    }

export default conectarMongpDB (endpointLogin);