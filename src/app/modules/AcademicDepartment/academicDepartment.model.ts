import { model, Schema } from 'mongoose'
import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicFaculty } from '../AcademicFaculty/academicFaculty.model'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'

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
    // check academic faculty existence
    const academicFaculty = await AcademicFaculty.findById(this.academicFaculty)
    if (!academicFaculty) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid academic faculty ID')
    }

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
    const query = this.getQuery();
    // check academic faculty existence
    const academicDepartment = await AcademicDepartment.findOne(query)
    if (!academicDepartment) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid Academic Department ID')
    }

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
