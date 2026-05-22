import type { VercelRequest, VercelResponse } from "@vercel/node";
import formidable, {Fields, Files} from 'formidable';
import sharp from 'sharp';
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { requireAuth } from "../server/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {

    if(await requireAuth(req, res)) return;

    if(req.method === 'POST') {
        const form = formidable({});
        let fields: Fields;
        let files: Files;
        try {
            [fields, files] = await form.parse(req);
            console.log("Parse succeeded, files: ", Object.keys(files), "\n Fields: ", Object.keys(fields));
            const file =  files.image?.[0];
            console.log("File: ", file?.originalFilename, file?.filepath);

            if(!file) return res.status(400).json({error: "No File Uploaded"});
            const fileName = file.originalFilename ?? String(randomUUID());

            const webBuffer = await sharp(file.filepath)
                                        .resize({width: 800})
                                        .jpeg({quality: 80})
                                        .toBuffer()
            
            const thumbnailBuffer = await sharp(file.filepath)
                                            .resize({width: 200})
                                            .jpeg({quality: 80})
                                            .toBuffer()
            const webBlob = await put(`/images/${fileName}`, webBuffer, {access: 'public', addRandomSuffix: true});
            const thumbBlob = await put(`/thumb/${fileName}`, thumbnailBuffer, {access: 'public', addRandomSuffix: true});
            return res.status(201).json({imgPath: webBlob.url, thumbnailPath: thumbBlob.url});

        } catch(error) {
            console.error(error);
            return res.status(400).json({error: "Error While Parsing File"})
        }
    }
}