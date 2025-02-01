import { TSchedule } from './OfferedCourse.constant'

export const hasTimeConflict = (assignedSchedules: TSchedule[], newSchedule: TSchedule) => {
    for (const schedule of assignedSchedules) {
        const existingStartTime = new Date(`1971-01-01T${schedule.startTime}`)
        const existingEndTime = new Date(`1971-01-01T${schedule.endTime}`)
        const newStartTime = new Date(`1971-01-01T${newSchedule.startTime}`)
        const newEndTime = new Date(`1971-01-01T${newSchedule.endTime}`)

        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            return true
        }
    }
    return false
}
