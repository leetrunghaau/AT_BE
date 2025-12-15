const { capitalize } = require("@/helpers/string.js");

const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], { 
    abortEarly: false, 
    convert: true       
  });
  if (error) {
    const message = error.details.map(d => d.message).join(', ');
    const validationError = new Error(message);
    validationError.statusCode = 400;
    return next(validationError);
  }

  if (property === 'body') {
    req.body = value;
  }else{
    const key = `use${capitalize(property)}`;
    req[key] = value;
  }


  next();
};

module.exports = validate;