const Joi = require("joi");

const authSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  });

const emailSchema = Joi.object({
  email: Joi.string()
    .required()
    .messages({ "any.required": "missing required email field" }),
});

module.exports = {
  authSchema,
  emailSchema,
  
};
