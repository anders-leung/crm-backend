const Joi = require('joi');

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config({ path: envFile });

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  CLIENT: Joi.string()
    .default('http://localhost:3000'),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false),
    }),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  GST: Joi.number()
    .default(0.05),
  PST: Joi.number()
    .default(0.07),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  client: envVars.CLIENT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  mongo: {
    host: envVars.MONGO_HOST,
  },
  gst: envVars.GST,
  pst: envVars.PST,
};

module.exports = config;
