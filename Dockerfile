# Use the official Node.js image
FROM node:22-alpine3.21

# Install build tools
RUN apk add --no-cache make gcc g++ python3

RUN npm install -g pnpm
# Set the working directory to /app
WORKDIR /app
# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./
# Install all dependencies (including development dependencies)
RUN pnpm install --frozen-lockfile
# Copy the rest of the application code to the container
COPY . .
# Start the application with dumb-init in development mode
CMD ["pnpm", "run", "dev"]
