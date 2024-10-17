export const EnvConfiguration = () => ({
   enviroment: process.env.NODE_ENV || 'dev',
   mongoDb: process.env.MONGO_DB,
   port: process.env.PORT || 3002,
   default_limit: process.env.DEFAULT_LIMIT || 7,
});