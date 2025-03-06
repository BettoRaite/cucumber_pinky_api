# Use the official Node.js image
FROM node:22-alpine3.21

RUN npm install -g pnpm
# Set the working directory to /app
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally

# Install all dependencies (including development dependencies)
RUN pnpm install --frozen-lockfile

# Install dumb-init and curl for handling PID 1 issues and making curl available
RUN apk add --no-cache dumb-init

# Copy the rest of the application code to the container
COPY . .

# Expose port for the application to listen on
EXPOSE 5000

# Start the application with dumb-init in development mode
CMD ["pnpm","run", "start"]
