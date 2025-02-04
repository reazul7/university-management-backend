import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import bcrypt from 'bcrypt'
import { User } from "../User/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
    // check if user is exist
    const isUserExists = await User.findOne({id: payload?.id})
    if (!isUserExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // check if the user is already deleted
    const isDeleted = isUserExists?.isDeleted
    if (isDeleted) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is already deleted')
    }

    // check if the user is blocked
    const userStatus = isUserExists?.status
    if (userStatus === 'blocked') {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is already blocked')
    }

    // check if password is correct
    const isPasswordMatch = await bcrypt.compare(payload?.password, isUserExists?.password)
    return {}
}

export const AuthServices = { loginUser }