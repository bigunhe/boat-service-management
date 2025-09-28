// Environment Configuration Reference
// Copy this to a .env file in the backend directory

const envConfig = {
  // Database Configuration
  MONGODB_URI: 'mongodb://localhost:27017/boat-service-management',
  DB_NAME: 'boat-service-management',
  
  // Server Configuration
  PORT: 5002,
  NODE_ENV: 'development',
  FRONTEND_URL: 'http://localhost:3000',
  
  // Authentication & Security
  JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRES_IN: '7d',
  
  // Email Configuration (for password reset)
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_PORT: 587,
  EMAIL_USERNAME: 'your-email@gmail.com',
  EMAIL_PASSWORD: 'your-app-password',
  EMAIL_FROM: 'noreply@boatservice.com',
  
  // File Upload Configuration (for later use)
  MAX_FILE_SIZE: 10485760,
  UPLOAD_PATH: './uploads',
  
  // API Rate Limiting (for security)
  RATE_LIMIT_WINDOW_MS: 900000,
  RATE_LIMIT_MAX_REQUESTS: 100
};

export default envConfig;
