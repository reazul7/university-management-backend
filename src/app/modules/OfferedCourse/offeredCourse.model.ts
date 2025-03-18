import { model, Schema } from 'mongoose'
import { Days } from './OfferedCourse.constant'
import { TOfferedCourse } from './offeredCourse.interface'

const offeredCourseSchema = new Schema<TOfferedCourse>(
    {
        semesterRegistration: {
            type: Schema.Types.ObjectId,
            ref: 'SemesterRegistration',
            required: [true, 'Semester Registration is required'],
        },
        academicSemester: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicSemester',
            required: [true, 'Academic Semester is required'],
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicFaculty',
            required: [true, 'Academic Faculty is required'],
        },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicDepartment',
            required: [true, 'Academic Department is required'],
        },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: [true, 'Course is required'] },
        faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', required: [true, 'Faculty is required'] },
        maxCapacity: { type: Number, required: [true, 'Max Capacity is required'] },
        section: { type: String, required: [true, 'Section is required'] },
        days: [{ type: String, enum: Days, required: [true, 'Days are required'] }],
        startTime: { type: String, required: [true, 'Start Time is required'] },
        endTime: { type: String, required: [true, 'End Time is required'] },
    },
    { timestamps: true },
)

export const OfferedCourse = model<TOfferedCourse>('OfferedCourse', offeredCourseSchema)
