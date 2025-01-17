// this is the professional code for api error handling 
class ApiError extends Error{
    constructor(
        statusCode, 
        message = "Something went wrong",
        errors = [],
        stack = [],
    )
    {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.stack = stack
        this.errors = errors
        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {ApiError};