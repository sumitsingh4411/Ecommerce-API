const { ValidationError } = require('joi');
const ErrorHandler = require('../service/ErrorHandler');

const errorHandler = (err, req, res, next) => {
    let statuscode = 500;
    let data = {
        message: 'Internal server error',
        ...(process.env.DBUG_MODE === 'true' && { orginalerror: err.message })
    }

    if (err instanceof ValidationError) {
        statuscode = 422;
        data={
            message:err.message
        }
    }
    if(err instanceof ErrorHandler){
        statuscode=err.status;
        data={
            message:err.message
        }
        
    }
    
    return res.status(statuscode).json(data);
}

module.exports = errorHandler;