export default () => ({
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/user-management'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'super-secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  });
  