import fs from 'fs/promises'
import multer from 'multer'
import config from '../config'
import AppError from '../errors/AppError'
import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes } from 'http-status-codes'

// Initialize Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
})

export const sendImageToCloudinary = async (path: string, imageName: string): Promise<Record<string, unknown>> => {
    try {
        const result = await cloudinary.uploader.upload(path, { public_id: imageName })
        // Delete local file after successful upload
        await fs.unlink(path)
        return result

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to upload image to Cloudinary')
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    },
})

export const upload = multer({ storage: storage })
