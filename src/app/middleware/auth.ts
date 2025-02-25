import AppError from '../errors/AppError'
import catchAsync from '../utils/catchAsync'
import config from '../config'
import { JwtPayload } from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { TUserRole } from '../modules/User/user.interface'
import { User } from '../modules/User/user.model'
import { verifyToken } from '../modules/Auth/auth.utils'

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization
        // if the token is sent from the client
        if (!token) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized')
        }
        // check the token is valid
        const decoded = verifyToken(token, config.jwt_access_secret as string)
        const { userId, role, iat } = decoded

        // check if user is exist
        const user = await User.isUserExistByCustomId(userId)
        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found')
        }

        // check if the user is already deleted
        const isDeleted = user?.isDeleted
        if (isDeleted) {
            throw new AppError(StatusCodes.FORBIDDEN, 'This user is already deleted')
        }

        // check if the user is blocked
        const userStatus = user?.status
        if (userStatus === 'blocked') {
            throw new AppError(StatusCodes.FORBIDDEN, 'This user is already blocked')
        }

        if (user.passwordChangeAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangeAt, iat as number)) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Password has been changed. Please login again.')
        }

        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized')
        }
        req.user = decoded as JwtPayload
        next()
    })
}

export default auth
