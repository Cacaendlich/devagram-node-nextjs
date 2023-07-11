import multer from 'multer';
import { createBucketClient } from '@cosmicjs/sdk';


const{BUCKET_SLUG_DEVAGRAM, BUCKET_READ_KEY_DEVAGRAM, BUCKET_WRITE_KEY_DEVAGRAM} = process.env;

const bucketDevagram = createBucketClient({
    bucketSlug: BUCKET_SLUG_DEVAGRAM as string,
    readKey: BUCKET_READ_KEY_DEVAGRAM as string,
    writeKey:  BUCKET_WRITE_KEY_DEVAGRAM as string,
});

const storage = multer.memoryStorage(); //indica que os arquivos serão armazenados em memória como buffers, ou seja, os arquivos são temporariamente mantidos na memória RAM do servidor durante o processo de upload.
const upload = multer({storage: storage}); //Esse objeto é configurado para utilizar o objeto de armazenamento criado anteriormente

const uploadImagemCosmic = async (req: any) => {
    //console.log('uploadImagemCosmic req:', req);
    //console.log('uploadImagemCosmic req.file:', req.file);
    //console.log('uploadImagemCosmic req.file.originalname:', req.file.originalname);

    if (req?.file?.originalname) {
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };

        console.log('uploadImagemCosmic media_object', media_object);

        if(req.url && req.url.includes('publicacao')) {
            console.log('Imagem subiu para a pasta [publicacoes]');
            //console.log('bucketDevagram.media:', bucketDevagram.media);

            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: 'publicacoes'
            });
        } else {
            console.log('Imagem subiu para a pasta [avatar]');
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: 'avatar'
            });
        }
    }
}

export { upload, uploadImagemCosmic };