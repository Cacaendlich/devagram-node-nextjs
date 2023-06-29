import multer from 'multer';
import { createBucketClient } from '@cosmicjs/sdk';


// const{BUCKET_SLUG_DEVAGRAM, BUCKET_READ_KEY_DEVAGRAM, BUCKET_WRITE_KEY_DEVAGRAM} = process.env;

const bucketDevagram = createBucketClient({
    bucketSlug: 'devagram-217dac60-15cc-11ee-8a26-535a71de0196',
    readKey: 'YK2b7GnxbEvxh3QgNct7p2fb5cZFxCg31XIpr9OpYWh1Vjtn25',
    writeKey: 'bNfP6bpQRpGcUhK2GJr2e1wTrhuD1MxRTkbrx6eJ9trxytHHie',
});

const storage = multer.memoryStorage(); //indica que os arquivos serão armazenados em memória como buffers, ou seja, os arquivos são temporariamente mantidos na memória RAM do servidor durante o processo de upload.
const upload = multer({
    storage: storage
}); //Esse objeto é configurado para utilizar o objeto de armazenamento criado anteriormente

const uploadImagemCosmic = async (req: any) => {
    console.log('uploadImagemCosmic', req);
    if (req?.file?.originalname) {
        const media_object = {
            originalname: req.file.originalname,
            Buffer: req.file.Buffer
        };

        console.log('uploadImagemCosmic url', req.url);
        console.log('uploadImagemCosmic media_object', media_object);


        if (req.url && req.url.includes('publicacao')) {
            console.log('Imagem subiu para a pasta [publicacoes]');
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: 'publicacoes'
            });
        } else {
            console.log('Imagem subiu para a pasta [avatares]');
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: 'avatar'
            });
        }
    }
}

export { upload, uploadImagemCosmic };