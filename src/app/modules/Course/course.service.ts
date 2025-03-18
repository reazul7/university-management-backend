import mongoose from 'mongoose'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { Course, CourseFaculty } from './course.model'
import { courseSearchableFields } from './course.constant'
import { TCourse, TCourseFaculty } from './course.interface'

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
    const meta = await courseQuery.countTotal()
    return { meta, result }
}

const singleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course')
    return result
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        // Basic course updates info
        const updateBasicCourseInfo = await Course.findByIdAndUpdate(id, courseRemainingData, {
            new: true,
            runValidators: true,
            session,
        })
        if (!updateBasicCourseInfo) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course')

        // check if any prerequisite courses have been updated
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            // filter out deleted courses
            const deletedPreRequisiteCourses = preRequisiteCourses
                ?.filter(element => element.course && element.isDelete)
                ?.map(element => element.course)
            const deletedPreRequisiteCoursesData = await Course.findByIdAndUpdate(
                id,
                { $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisiteCourses } } } },
                { new: true, runValidators: true, session },
            )
            if (!deletedPreRequisiteCoursesData) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course')

            // filter out new preRequisite courses
            const newPreRequisiteCourses = preRequisiteCourses?.filter(element => element.course && !element.isDelete)
            const newPreRequisiteCoursesData = await Course.findByIdAndUpdate(
                id,
                { $addToSet: { preRequisiteCourses: { $each: newPreRequisiteCourses } } },
                { new: true, runValidators: true, session },
            )
            if (!newPreRequisiteCoursesData) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course')
        }

        await session.commitTransaction()
        await session.endSession()
        const result = await Course.findById(id).populate('preRequisiteCourses.course')
        return result

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course')
    }
}

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDelete: true }, { new: true })
    return result
}

const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        { course: id, $addToSet: { faculties: { $each: payload } } },
        { upsert: true, new: true },
    )
    return result
}

const getFacultiesWithCourseFromDB = async (courseId: string) => {
    const result = await CourseFaculty.findById(courseId).populate('faculties', 'name')
    return result
}

const removeFacultiesFromCourseFromDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(id, { $pull: { faculties: { $in: payload } } }, { new: true })
    return result
}

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    singleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB,
    getFacultiesWithCourseFromDB,
    removeFacultiesFromCourseFromDB,
}
