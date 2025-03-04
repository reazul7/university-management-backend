import config from '../config'
import { User } from '../modules/User/user.model'
import { USER_ROLE } from '../modules/User/user.constant'

const superUser = {
    id: '00001',
    email: 'admin@gmail.com',
    password: config.super_admin_password,
    needsPasswordChange: false,
    role: USER_ROLE.superAdmin,
    status: 'in-progress',
    isDeleted: false,
}
const seedSuperAdmin = async () => {
    // when database is connected, we will check is there any user as 'superAdmin'
    const isSuperAdminExist = await User.findOne({ role: USER_ROLE.superAdmin })
    if (!isSuperAdminExist) {
        await User.create(superUser)
    }
}

export default seedSuperAdmin
