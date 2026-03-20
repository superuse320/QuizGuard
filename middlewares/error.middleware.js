const ApiResponseService = require('../utils/response')
const errorMiddleware = (err, req, res, next) => {
  console.error(err.message)
  return ApiResponseService.internalServerError(res, err.message)
}
module.exports = errorMiddleware