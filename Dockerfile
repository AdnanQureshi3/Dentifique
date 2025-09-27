# Stage 1: The Builder for the Frontend
# This stage installs frontend dependencies and builds the production assets.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the frontend package files to install dependencies
COPY ./Frontend/package*.json ./Frontend/

# Change to the frontend directory to run npm install
WORKDIR /app/Frontend

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY ./Frontend/ .

# Build the frontend for production
RUN npm run build

# Stage 2: The Final Image for the Backend
# This stage will contain the backend code and the built frontend assets.
FROM node:20-alpine AS final

# Set the working directory for the backend application
WORKDIR /app

# Copy the package.json and package-lock.json from the root directory
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the backend source code
COPY ./BackEnd/ ./BackEnd/

# Copy the built frontend assets from the builder stage to the backend's public folder
COPY --from=builder /app/Frontend/dist ./Frontend/dist

# Expose the port that your backend server will be listening on
EXPOSE 8000

# Define the command to run your application in development mode
# This will use nodemon as per your package.json, which is suitable for dev.
CMD ["npm", "run", "dev"]
