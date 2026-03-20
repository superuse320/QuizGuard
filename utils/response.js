const HttpStatus = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
  }
  
  class ApiResponseService {
    static success(res, mensaje = 'OK', data = null, code = HttpStatus.OK) {
      const body = { ok: true, mensaje }
      if (data !== null) body.data = data
      return res.status(code).json(body)
    }
  
    static created(res, mensaje = 'Recurso creado exitosamente', data = null) {
      return this.success(res, mensaje, data, HttpStatus.CREATED)
    }
  
    static accepted(res, mensaje = 'Solicitud aceptada pero no procesada todavía') {
      return this.success(res, mensaje, null, HttpStatus.ACCEPTED)
    }
  
    static noContent(res, mensaje = 'Eliminado exitosamente') {
      return res.status(HttpStatus.OK).json({ ok: true, mensaje, data: null })
    }
    static error(res, mensaje = 'Error', code = HttpStatus.BAD_REQUEST) {
      return res.status(code).json({ ok: false, mensaje, data: null })
    }
  
    static badRequest(res, mensaje = 'Solicitud incorrecta') {
      return this.error(res, mensaje, HttpStatus.BAD_REQUEST)
    }
  
    static unauthorized(res, mensaje = 'No autorizado') {
      return this.error(res, mensaje, HttpStatus.UNAUTHORIZED)
    }
  
    static forbidden(res, mensaje = 'Acceso denegado') {
      return this.error(res, mensaje, HttpStatus.FORBIDDEN)
    }
  
    static notFound(res, mensaje = 'Recurso no encontrado') {
      return this.error(res, mensaje, HttpStatus.NOT_FOUND)
    }
  
    static methodNotAllowed(res, mensaje = 'Método no permitido') {
      return this.error(res, mensaje, HttpStatus.METHOD_NOT_ALLOWED)
    }
  
    static conflict(res, mensaje = 'Conflicto con el estado actual') {
      return this.error(res, mensaje, HttpStatus.CONFLICT)
    }
  
    static unprocessableEntity(res, mensaje = 'Entidad no procesable') {
      return this.error(res, mensaje, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  
    static tooManyRequests(res, mensaje = 'Demasiadas solicitudes, intenta más tarde') {
      return this.error(res, mensaje, HttpStatus.TOO_MANY_REQUESTS)
    }
    static internalServerError(res, mensaje = 'Error interno del servidor') {
      return this.error(res, mensaje, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  
    static notImplemented(res, mensaje = 'Funcionalidad no implementada') {
      return this.error(res, mensaje, HttpStatus.NOT_IMPLEMENTED)
    }
  
    static badGateway(res, mensaje = 'Respuesta inválida del servidor externo') {
      return this.error(res, mensaje, HttpStatus.BAD_GATEWAY)
    }
  
    static serviceUnavailable(res, mensaje = 'Servicio no disponible') {
      return this.error(res, mensaje, HttpStatus.SERVICE_UNAVAILABLE)
    }
  
    static gatewayTimeout(res, mensaje = 'El servidor externo tardó demasiado') {
      return this.error(res, mensaje, HttpStatus.GATEWAY_TIMEOUT)
    }
    static customError(res, mensaje, code = 400) {
      return this.error(res, mensaje, code)
    }
  
  }
  
  module.exports = ApiResponseService