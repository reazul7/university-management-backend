import mongoose from 'mongoose'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { SemesterRegistration } from './semesterRegistration.model'
import { RegistrationStatus } from './semesterRegistration.constant'
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model'
import { TSemesterRegistration } from './semesterRegistration.interface'
import { AcademicSemester } from '../AcademicSemester/academicSemester.model'

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    const academicSemester = payload?.academicSemester
    // check if there are any registered semester that are already 'UPCOMING' or 'ONGOING'
    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
        $or: [{ status: RegistrationStatus.UPCOMING }, { status: RegistrationStatus.ONGOING }],
    })
    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester`,
        )
    }

    // check if the semester is exist
    const isAcademicSemester = await AcademicSemester.findById(academicSemester)
    if (!isAcademicSemester) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This academic semester not found')
    }

    // check if the semester is already registered
    const isSemesterRegistrationExits = await SemesterRegistration.findOne({ academicSemester })
    if (isSemesterRegistrationExits) {
        throw new AppError(StatusCodes.CONFLICT, 'This Semester is already registered')
    }

    const result = await SemesterRegistration.create(payload)
    return result
}

const getAllSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'), query)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await semesterRegistrationQuery.modelQuery
    const meta = await semesterRegistrationQuery.countTotal()
    return { meta, result }
}

const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id).populate('academicSemester')
    return result
}

const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    const isSemesterRegistrationExits = await SemesterRegistration.findById(id)
    if (!isSemesterRegistrationExits) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This academic semester not found')
    }
    // if status === 'ENDED', we will not update anything
    const currentSemesterStatus = isSemesterRegistrationExits?.status
    const requestedStatus = payload?.status
    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(StatusCodes.CONFLICT, 'This semester is already Ended')
    }

    // UPCOMING --> ONGOING --> ENDED
    if (currentSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus === RegistrationStatus.ENDED) {
        throw new AppError(
            StatusCodes.CONFLICT,
            `Cannot change status to ${requestedStatus} when current status is ${currentSemesterStatus}`,
        )
    }
    if (currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING) {
        throw new AppError(
            StatusCodes.CONFLICT,
            `Cannot change status to ${requestedStatus} when current status is ${currentSemesterStatus}`,
        )
    }

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    return result
}

const deleteSemesterRegistrationFromDB = async (id: string) => {
    /**
     * Step1: Delete associated offered courses.
     * Step2: Delete semester registration when the status is 'UPCOMING'.
     */
    const isSemesterRegistrationExits = await SemesterRegistration.findById(id)
    if (!isSemesterRegistrationExits) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This registered semester not found')
    }

    // checking if the status is still "UPCOMING"
    const semesterRegistrationStatus = isSemesterRegistrationExits.status
    if (semesterRegistrationStatus !== RegistrationStatus.UPCOMING) {
        throw new AppError(
            StatusCodes.CONFLICT,
            `Cannot delete this semester because it's status is ${semesterRegistrationStatus}`,
        )
    }

    const session = await mongoose.startSession()
    // also deleting associated offered course
    try {
        session.startTransaction()
        const deleteOfferedCourses = await OfferedCourse.deleteMany({ semesterRegistration: id }, { session })
        if (!deleteOfferedCourses) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete Semester Registration')
        }
        const deleteSemesterRegistration = await SemesterRegistration.findByIdAndDelete(id, { session, new: true })
        if (!deleteSemesterRegistration) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete Semester Registration')
        }
        await session.commitTransaction()
        await session.endSession()
        return null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error)
    }
}

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB,
}
