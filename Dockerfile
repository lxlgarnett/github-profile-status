# Use an official Node.js runtime as a parent image
# Pinning to a specific version for consistency
FROM node:18.19.0-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
# Using --omit=dev to avoid installing devDependencies in production
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Create a non-root user and switch to it for security best practices
RUN groupadd --system nodejs && useradd --system --gid nodejs nodejs
USER nodejs

# Cloud Run injects the PORT environment variable, our app should listen on it
# The default port 3000 is used as a fallback in the application code
EXPOSE 3000

# Define the command to run the app
# Ensure the app starts listening on the PORT environment variable
CMD ["npm", "start"]