/** ExpressError extends normal JS error so we can
 *  add a status when we make an instance of it.
 *
 *  The error-handling middleware will return this.
 */

module.exports.ExpressError = class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    };
};

/** 404 NOT FOUND error. */

module.exports.NotFoundError = class NotFoundError extends ExpressError {
    constructor(message = "Not Found") {
        super(message, 404);
    };
};

/** 401 UNAUTHORIZED error. */

module.exports.UnauthorizedError = class UnauthorizedError extends ExpressError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    };
};

/** 400 BAD REQUEST error. */

// class BadRequestError extends ExpressError {
//     constructor(message = "Bad Request") {
//         super(message, 400);
//     };
// };
module.exports.BadRequestError = class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.code = 400;
    }
};

/** 403 BAD REQUEST error. */

module.exports.ForbiddenError = class ForbiddenError extends ExpressError {
    constructor(message = "Bad Request") {
        super(message, 403)
    }
}

// module.exports = {
//     ExpressError,
//     NotFoundError,
//     UnauthorizedError,
//     BadRequestError,
//     ForbiddenError,
// };