import { model, Schema } from 'mongoose'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { TAcademicDepartment } from './academicDepartment.interface'

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
    {
        name: { type: String, required: true, unique: true },
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

    // check duplicate department name
    const isDepartmentExist = await AcademicDepartment.findOne({
        name: query.name,
    })
    if (isDepartmentExist) {
        throw new AppError(StatusCodes.CONFLICT, 'Academic department already exists')
    }
    next()
})

export const AcademicDepartment = model<TAcademicDepartment>('AcademicDepartment', academicDepartmentSchema)
