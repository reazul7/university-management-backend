import { model, Schema } from 'mongoose'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { TAcademicProgram } from './academicProgram.interface'

const academicProgramSchema = new Schema<TAcademicProgram>(
    {
        name: { type: String, required: true, trim: true },
        degree: { type: String, enum: ['BSc', 'BA', 'BBA', 'LLB', 'MSc', 'MA', 'MBA', 'LLM'], required: true },
        level: { type: String, enum: ['undergraduate', 'postgraduate'], required: true },
        programCode: { type: String, required: true, unique: true, trim: true, uppercase: true },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicDepartment',
            required: true,
        },
        durationInMonths: { type: Number, required: [true, 'Program duration is required'], min: 12, max: 72 },
        totalSemesters: { type: Number, required: [true, 'Total semester is required'], min: 3, max: 18 },
        totalCredits: { type: Number, required: [true, 'Total credits is required'], min: 30, max: 180 },
        status: { type: String, enum: ['active', 'inactive'], required: true },
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
