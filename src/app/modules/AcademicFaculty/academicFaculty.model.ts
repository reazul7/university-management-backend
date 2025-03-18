import { model, Schema } from 'mongoose'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { TAcademicFaculty } from './academicFaculty.interface'

const academicFacultySchema = new Schema<TAcademicFaculty>(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: true },
)

academicFacultySchema.pre('save', async function () {
    // check duplicate faculty name
    const isFacultyExist = await AcademicFaculty.findOne({
        name: this.name,
    })
    if (isFacultyExist) {
        throw new AppError(StatusCodes.CONFLICT, 'Academic faculty already exists')
    }
})

export const AcademicFaculty = model<TAcademicFaculty>('AcademicFaculty', academicFacultySchema)
