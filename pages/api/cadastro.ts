import type {NextApiRequest, NextApiResponse} from "next";
import { respostaPadraoMsg } from "../../types/respostaPadraoMsg";
import { cadastroRequisicao } from "../../types/cadastroRequisicao";
import { METHODS } from "http";
import { error } from "console";

const endpointCadastro = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

    }
    return res.status(405).json({error: 'Método informado não é válido.'});
}