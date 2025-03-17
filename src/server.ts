import app from './app'
import { Server } from 'http'
import mongoose from 'mongoose'
import config from './app/config'
import seedSuperAdmin from './app/DB'

let server: Server

async function main() {
    try {
        await mongoose.connect(config.database_url as string)
        seedSuperAdmin()
        server = app.listen(config.port, () => {
            console.log(`Example app listening on port ${config.port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

main()
process.on('unhandledRejection', () => {
    console.log('😈 unhandledRejection is detected. Server is shutting down....')
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on('uncaughtException', () => {
    console.log('�� UncaughtException is detected. Server is shutting down....')
    process.exit(1)
})
