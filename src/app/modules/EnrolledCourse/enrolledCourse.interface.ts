import { Types } from 'mongoose'

export type TGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F' | 'N/A'

export type TEnrolledCourseMarks = {
    classTest1: number
    midTerm: number
    classTest2: number
    finalTerm: number
}

export type TEnrolledCourse = {
    semesterRegistration: Types.ObjectId
    academicSemester: Types.ObjectId
    academicFaculty: Types.ObjectId
    academicDepartment: Types.ObjectId
    offeredCourse: Types.ObjectId
    course: Types.ObjectId
    faculty: Types.ObjectId
    student: Types.ObjectId
    isEnrolled: boolean
    courseMarks: TEnrolledCourseMarks
    grade: TGrade
    gradePoints: number
    isCompleted: boolean
}
