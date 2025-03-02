import mongoose, { Schema } from 'mongoose'
import { Grade } from './enrolledCourse.constant'
import { TEnrolledCourse, TEnrolledCourseMarks } from './enrolledCourse.interface'

const courseMarksSchema = new Schema<TEnrolledCourseMarks>({
    classTest1: { type: Number, default: 0, min: 0, max: 10 },
    midTerm: { type: Number, default: 0, min: 0, max: 30 },
    classTest2: { type: Number, default: 0, min: 0, max: 10 },
    finalTerm: { type: Number, default: 0, min: 0, max: 50 },
})

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
    semesterRegistration: { type: Schema.Types.ObjectId, ref: 'SemesterRegistration', required: true },
    academicSemester: { type: Schema.Types.ObjectId, ref: 'AcademicSemester', required: true },
    academicFaculty: { type: Schema.Types.ObjectId, ref: 'AcademicFaculty', required: true },
    academicDepartment: { type: Schema.Types.ObjectId, ref: 'AcademicDepartment', required: true },
    offeredCourse: { type: Schema.Types.ObjectId, ref: 'OfferedCourse', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    isEnrolled: { type: Boolean, default: false },
    courseMarks: { type: courseMarksSchema, default: {} },
    grade: { type: String, enum: Grade, default: 'NA' },
    gradePoints: { type: Number, min: 0, max: 4, default: 0 },
    isCompleted: { type: Boolean, default: false },
})

export const EnrolledCourse = mongoose.model<TEnrolledCourse>('EnrolledCourse', enrolledCourseSchema)
