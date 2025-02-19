import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/AppError'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../User/user.model'
import { TLoginUser } from './auth.interface'
import config from '../../config'
import bcrypt from 'bcrypt'

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
    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: '10d' })
    return { accessToken, needsPasswordChange: user?.needsPasswordChange }
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

    // check if password is Matched
    if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Password do not matched')
    }

    // hash new password
    const newHashedPassword = await bcrypt.hash(payload?.newPassword, Number(config.bcrypt_salt_rounds))

    await User.findOneAndUpdate(
        { id: userData.userId, role: userData.role },
        { password: newHashedPassword, needsPasswordChange: false, passwordChangeAt: new Date() },
    )
    return null
}

export const AuthServices = { loginUser, changePassword }
