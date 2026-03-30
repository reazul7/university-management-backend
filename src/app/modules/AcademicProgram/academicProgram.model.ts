import { model, Schema } from 'mongoose'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { TAcademicProgram } from './academicProgram.interface'

const academicProgramSchema = new Schema<TAcademicProgram>(
    {
        name: { type: String, required: true, unique: true },
        degree: { type: String, required: true },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicDepartment',
        },
        durationInYears: { type: Number, required: [true, 'Program duration is required'] },
        totalCredits: { type: Number, required: [true, 'Total credits is required'] },
    },
    { timestamps: true },
)

academicProgramSchema.pre('save', async function (next) {
    // check duplicate program name
    const isProgramExist = await AcademicProgram.findOne({
        name: this.name,
    })
    if (isProgramExist) {
        throw new AppError(StatusCodes.CONFLICT, 'Academic program already exists')
    }
    next()
})

academicProgramSchema.pre('findOneAndUpdate', async function (next) {
    const query = this.getQuery()

    // check duplicate program name
    const isProgramExist = await AcademicProgram.findOne({
        name: query.name,
    })
    if (isProgramExist) {
        throw new AppError(StatusCodes.CONFLICT, 'Academic program already exists')
    }
    next()
})

export const AcademicProgram = model<TAcademicProgram>('AcademicProgram', academicProgramSchema)
