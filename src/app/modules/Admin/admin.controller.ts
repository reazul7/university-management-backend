import catchAsync from '../../utils/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { AdminServices } from './admin.service'
import sendResponse from '../../utils/sendResponse'

const getAllAdmins = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllAdminsFromDB(req.query)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admins fetched successfully',
        meta: result.meta,
        data: result.result,
    })
})

const getSingleAdmin = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await AdminServices.getSingleAdminFromDB(id)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin fetched successfully',
        data: result,
    })
})

const updateAdmin = catchAsync(async (req, res) => {
    const { id } = req.params
    const { admin } = req.body
    const result = await AdminServices.updateAdminIntoDB(id, admin)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin updated successfully',
        data: result,
    })
})

const deleteAdmin = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await AdminServices.deleteAdminFromDB(id)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin deleted successfully',
        data: result,
    })
})

export const AdminControllers = {
    getAllAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
}
