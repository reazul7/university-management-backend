import { Types } from 'mongoose'

export type TPreRequisiteCourses = {
    course: Types.ObjectId
    isDelete: boolean
}

export type TCourse = {
    title: string
    prefix: string
    code: number
    credits: number
    isDelete: boolean
    preRequisiteCourses: [TPreRequisiteCourses]
}

export type TCourseFaculty = {
    course: Types.ObjectId
    faculties: [Types.ObjectId]
}
