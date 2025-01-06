/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrorResponse } from '../interface/error'

const handleDuplicateError = (error: any): TGenericErrorResponse => {
    // Extract value within double quotes using regex
    const match = error.message.match(/"([^"]*)"/)

    // The extracted value will be in the first capturing group
    const extractedMessage = match && match[1]
    const errorSources: TErrorSource = [
        {
            path: '',
            message: `${extractedMessage} is already exists`,
        },
    ]
    return {
        statusCode: 409,
        message: 'Duplicate error',
        errorSources,
    }
}

export default handleDuplicateError
