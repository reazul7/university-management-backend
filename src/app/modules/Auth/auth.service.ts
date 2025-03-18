import bcrypt from 'bcrypt'
import config from '../../config'
import { User } from '../User/user.model'
import { JwtPayload } from 'jsonwebtoken'
import AppError from '../../errors/AppError'
import { TLoginUser } from './auth.interface'
import { StatusCodes } from 'http-status-codes'
import { sendEmail } from '../../utils/sendEmail'
import { createToken, verifyToken } from './auth.utils'

const loginUser = async (payload: TLoginUser) => {
    // check if user is exist
    const user = await User.isUserExistByCustomId(payload?.id)
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

    // check if password is Matched
    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Password do not matched')
    }

    // create token and send to the client
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    }
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    )
    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
    )
    return { accessToken, refreshToken, needsPasswordChange: user?.needsPasswordChange }
}

const changePassword = async (userData: JwtPayload, payload: { oldPassword: string; newPassword: string }) => {
    // check if user is exist
    const user = await User.isUserExistByCustomId(userData?.userId)
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

    // check if password is not Matched
    if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Password do not matched')
    }

    // hash new password
    const newHashedPassword = await bcrypt.hash(payload?.newPassword, Number(config.bcrypt_salt_rounds))
    // save new password
    await User.findOneAndUpdate(
        { id: userData.userId, role: userData.role },
        { password: newHashedPassword, needsPasswordChange: false, passwordChangeAt: new Date() },
    )
    return null
}

const refreshToken = async (token: string) => {
    // if the token is sent from the client
    // if (!token) {
    //     throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized')
    // }

    // checking if the given token is valid
    const decoded = verifyToken(token, config.jwt_refresh_secret as string)
    const { userId, iat } = decoded

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

    // create token and send to the client
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    }
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    )
    return { accessToken }
}

const forgetPassword = async (userId: string) => {
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

    // create token and send to the client
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    }
    const resetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        // config.jwt_access_expires_in as string,
        '10m',
    )
    const resetUILink = `${config?.frontend_url}?id=${user?.id}&token=${resetToken}`
    sendEmail(user?.email, resetUILink)
}

const resetPassword = async (payload: { id: string; newPassword: string }, token: string) => {
    // check if user is exist
    const user = await User.isUserExistByCustomId(payload?.id)
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

    // checking if the given token is valid
    const decoded = verifyToken(token, config.jwt_access_secret as string)
    if (payload?.id !== decoded?.userId) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Unauthorized access! ID mismatch.')
    }

    // hash new password
    const newHashedPassword = await bcrypt.hash(payload?.newPassword, Number(config.bcrypt_salt_rounds))
    // update new password
    await User.findOneAndUpdate(
        { id: decoded.userId, role: decoded.role },
        { password: newHashedPassword, needsPasswordChange: false, passwordChangeAt: new Date() },
    )
    return null
}

export const AuthServices = { loginUser, changePassword, refreshToken, forgetPassword, resetPassword }
