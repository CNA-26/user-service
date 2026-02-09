# Use Node for backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port (adjust if your Express app uses a different one)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]