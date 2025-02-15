import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/AppError'
import { User } from '../User/user.model'
import { TLoginUser } from './auth.interface'

const loginUser = async (payload: TLoginUser) => {
    // check if user is exist
    const user = await User.isUserExistByCustomId(payload?.id)
    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
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
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid password')
    }
    return {}
}

export const AuthServices = { loginUser }
