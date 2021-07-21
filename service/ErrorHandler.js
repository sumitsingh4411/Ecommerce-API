class ErrorHandler extends Error {

    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new ErrorHandler(409, message);
    }

    static wrongcreadintials(message) {
        return new ErrorHandler(401, message);
    }

    static Aunauthroize(message="unauthorize") {
        return new ErrorHandler(401, message);
    }

    static notfound(message) {
        return new ErrorHandler(404, message);
    }
    static servererror(message="internal server error") {
        return new ErrorHandler(500, message);
    }
}

module.exports = ErrorHandler;