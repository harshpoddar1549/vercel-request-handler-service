import { Request, Response } from "express"
import { S3, S3Client, GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-providers'

export const GlobalController = {
    handleAllRequest: async (req: Request, res: Response) => {
        const id = "BOOpaZ"//req.hostname.split(".")[0]
        const fileName = req.path
        const filePath = `build/${id}/dist${fileName}`
        const file = await getTheFileFromR2(filePath)
        const type = fileName.endsWith("html") ? "text/html" : fileName.endsWith("css") ? "text/css" : fileName.endsWith("svg")? "image/svg+xml" : "application/javascript"
        const {Body}  = file
        const newFile = await Body?.transformToString()
        res.setHeader("Content-Type", type);
        res.send(newFile);
        //res.send("Done!")
    }
}

export const connect = async () => {
    const s3 = new S3Client({
        endpoint: process.env.CLOUDFLARE_ENDPOINT,
        credentials: fromEnv(),
        region: process.env.BUCKET_REGION
    })
    return s3
}

export const getTheFileFromR2 = async (filePath: string):Promise<GetObjectCommandOutput> => {
    const s3 = await connect()
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: filePath
    })
    return new Promise(async (resolve, reject) => {
        try{
            const data = await s3.send(command)
            console.log(data.ContentType)
            resolve(data)
            //const something = filePath.endsWith("svg")? await Body?.transformToWebStream() : await Body?.transformToString() 
            //resolve(something)
        }catch(err){
            console.log(err)
            reject(err)
        }
    })
}