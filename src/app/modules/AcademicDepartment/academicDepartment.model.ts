/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema } from 'mongoose'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { TAcademicDepartment } from './academicDepartment.interface'

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
    {
        name: { type: String, required: true, unique: true },
        shortCode: { type: String, required: true, unique: true },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicFaculty',
        },
    },
    { timestamps: true },
)

academicDepartmentSchema.pre('save', async function (next) {
    // check duplicate department name
    const isDepartmentExist = await AcademicDepartment.findOne({
        name: this.name,
    })
    if (isDepartmentExist) {
        throw new AppError(StatusCodes.CONFLICT, 'Academic department already exists')
    }
    next()
})

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
    const query = this.getQuery()
    const update = this.getUpdate() as any
    const excludeId = query._id ? { _id: { $ne: query._id } } : {}

    // check duplicate name
    if (update.name) {
        const isNameExist = await AcademicDepartment.findOne({
            name: update.name,
            ...excludeId,
        })

        if (isNameExist) {
            throw new AppError(StatusCodes.CONFLICT, 'Academic department name already exists')
        }
    }

    // check duplicate shortCode
    if (update.shortCode) {
        const isShortCodeExist = await AcademicDepartment.findOne({
            shortCode: update.shortCode,
            ...excludeId,
        })

        if (isShortCodeExist) {
            throw new AppError(StatusCodes.CONFLICT, 'Academic department short code already exists')
        }
    }

    next()
})

export const AcademicDepartment = model<TAcademicDepartment>('AcademicDepartment', academicDepartmentSchema)
