import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { CourseServices } from './course.service'

const createCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.createCourseIntoDB(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course created successfully',
        data: result,
    })
})

const getAllCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCoursesFromDB(req.query)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Courses fetched successfully',
        data: result,
    })
})

const getSingleCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params
    const result = await CourseServices.singleCourseFromDB(courseId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course fetched successfully',
        data: result,
    })
})

const updateCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params
    const course = req.body
    const result = await CourseServices.updateCourseIntoDB(courseId, course)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course updated successfully',
        data: result,
    })
})

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params
    const { faculties } = req.body
    const result = await CourseServices.assignFacultiesWithCourseIntoDB(courseId, faculties)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Assign Faculties successfully',
        data: result,
    })
})

const deleteCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params
    const result = await CourseServices.deleteCourseFromDB(courseId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course deleted successfully',
        data: result,
    })
})

export const CourseController = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourse,
    assignFacultiesWithCourse,
    deleteCourse,
}
