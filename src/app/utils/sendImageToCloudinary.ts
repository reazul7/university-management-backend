import fs from 'fs'
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

export const sendImageToCloudinary = (path: string, imageName: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(path, { public_id: imageName }, (error, result) => {
            if (error) {
                reject(new AppError(StatusCodes.BAD_REQUEST, 'Failed to upload image to Cloudinary'))
            } else {
                fs.unlink(path, error => {
                    if (error) {
                        reject(new AppError(StatusCodes.BAD_REQUEST, 'Error occurred while deleting temporary file'))
                    } else {
                        resolve(result)
                    }
                })
            }
        })
    })
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
