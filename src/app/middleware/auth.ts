import AppError from '../errors/AppError'
import catchAsync from '../utils/catchAsync'
import config from '../config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

const auth = () => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization
        // if the token is sent from the client
        if (!token) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized')
        }
        // check the token is valid
        jwt.verify(token, config.jwt_access_secret as string, function (error, decoded) {
            if (error) {
                throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized')
            }
            req.user = decoded as JwtPayload
            next()
        })
    })
}

export default auth
