export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  server: {
    port: process.env.PORT || 5001,
    env: process.env.NODE_ENV || 'development'
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
};
