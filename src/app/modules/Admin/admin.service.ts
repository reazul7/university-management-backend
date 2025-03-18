import mongoose from 'mongoose'
import { Admin } from './admin.model'
import { User } from '../User/user.model'
import { TAdmin } from './admin.interface'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { AdminSearchableFields } from './admin.constant'

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
    const adminQuery = new QueryBuilder(Admin.find(), query)
        .search(AdminSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await adminQuery.modelQuery
    const meta = await adminQuery.countTotal()
    return { meta, result }
}

const getSingleAdminFromDB = async (id: string) => {
    const result = await Admin.findById(id)
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found')
    return result
}

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
    const { name, ...remainingAdminData } = payload
    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingAdminData,
    }
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value
        }
    }

    const updateAdmin = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    })
    if (!updateAdmin) throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found')
    return updateAdmin
}

const deleteAdminFromDB = async (id: string) => {
    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        const deleteAdmin = await Admin.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session })
        if (!deleteAdmin) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete Admin')
        }

        // get user ID from deletedAdmin
        const userId = deleteAdmin.user
        const deleteUser = await User.findByIdAndUpdate(
            { _id: userId },
            {
                isDeleted: true,
            },
            { new: true, session },
        )
        if (!deleteUser) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete User')
        }
        await session.commitTransaction()
        await session.endSession()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error)
    }
    const result = await Admin.findByIdAndDelete(id)
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found')
}

export const AdminServices = {
    getAllAdminsFromDB,
    getSingleAdminFromDB,
    updateAdminIntoDB,
    deleteAdminFromDB,
}
