import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { courseSearchableFields } from './course.constant'
import { TCourse } from './course.interface'
import { Course } from './course.model'

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload)
    return result
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate('preRequisiteCourses.course'), query)
        .search(courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await courseQuery.modelQuery
    return result
}

const singleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course')
    return result
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload

    // Basic course updates info
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(id, courseRemainingData, {
        new: true,
        runValidators: true,
    })
    if (!updateBasicCourseInfo) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course')

    // check if any prerequisite courses have been updated
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
        // filter out deleted courses
        const deletedPreRequisiteCourses = preRequisiteCourses
            ?.filter(element => element.course && element.isDelete)
            ?.map(element => element.course)
        const deletedPreRequisiteCoursesData = await Course.findByIdAndUpdate(id, {
            $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisiteCourses } } },
        })
        if (!deletedPreRequisiteCoursesData) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course')

        // filter out new preRequisite courses
        const newPreRequisiteCourses = preRequisiteCourses?.filter(element => element.course && !element.isDelete)
        const newPreRequisiteCoursesData = await Course.findByIdAndUpdate(id, {
            $addToSet: { preRequisiteCourses: { $each: newPreRequisiteCourses } },
        })
        if (!newPreRequisiteCoursesData) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course')
    }

    const result = await Course.findById(id).populate('preRequisiteCourses.course')
    return result
}

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDelete: true }, { new: true })
    return result
}

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    singleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
}
