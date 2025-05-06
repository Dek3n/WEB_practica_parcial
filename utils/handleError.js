// Maneja errores HTTP estándar
const handleHttpError = (res, message = "ERROR", code = 403) => {
    res.status(code).json({
      error: true,
      message
    });
  };
  
  export { handleHttpError };
  