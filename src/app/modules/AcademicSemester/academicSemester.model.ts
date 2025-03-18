import { model, Schema } from 'mongoose'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemesterCode, AcademicSemesterName, Months } from './academicSemester.constant'

const academicSemesterSchema = new Schema<TAcademicSemester>(
    {
        name: { type: String, required: true, enum: AcademicSemesterName },
        code: { type: String, required: true, enum: AcademicSemesterCode },
        year: { type: String, required: true },
        startMonth: { type: String, required: true, enum: Months },
        endMonth: { type: String, required: true, enum: Months },
    },
    { timestamps: true },
)

academicSemesterSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const academicSemester = this
    const isSemesterExists = await AcademicSemester.findOne({
        name: academicSemester.name,
        year: academicSemester.year,
    })
    if (isSemesterExists) {
        throw new AppError(StatusCodes.CONFLICT, 'Academic Semester already exists for the given year and name.')
    }
    next()
})

export const AcademicSemester = model<TAcademicSemester>('AcademicSemester', academicSemesterSchema)
