function responseHandler(req, res, next) {
  res.ok = (data = {}, meta = null,  message = 'Succeed') => {
    let statusCode = 200;

    switch (req.method) {
      case 'POST':
        statusCode = 201;
        break;
      case 'DELETE':
        // statusCode = 204;
        statusCode = 202;
        break;
      default:
        statusCode = 200;
    }

    if (statusCode === 204) {
      return res.sendStatus(204);
    }

    const response = {
      success: true,
      message,
      data,
      ...(meta || {})
    };

    return res.status(statusCode).json(response);
  };
  next();
};

const errorHandler = async (err, req, res, next) => {
  console.error("================");
  console.error(err);

  if (err.code === 'P2002') {
    return res.status(409).json({
      status: 409,
      message: `giá trị của ${err.meta.target.join(', ')} đã tồn tại. Vui lòng xóa bản ghi cũ và thêm lại.`
    });
  }
  if (err.code === 'P2003') {
    return res.status(409).json({
      status: 409,
      message: `Foreign key constraint failed on field: ${err.meta.field_name || err.meta.target}`
    });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({
      status: 404,
      message: 'Không tìm thấy bản ghi'
    });
  }
  const statusCode = err.statusCode || 500;
  const message = statusCode >= 400 && statusCode < 500 ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    status: statusCode,
    message: message
  })
  return
}

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  responseHandler,
  errorHandler,
  notFound
};
