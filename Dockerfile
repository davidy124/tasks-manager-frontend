# Build stage
FROM node:18.19-alpine3.18 as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app using webpack production config
RUN npx webpack --config webpack.prod.js

# Production stage
FROM nginx:1.19-alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx template
COPY nginx.conf.template /etc/nginx/conf.d/tasks.template
RUN rm -f /etc/nginx/conf.d/default.conf

# Default values
ENV API_URL=http://localhost:8084
ENV SERVER_NAME=localhost
ENV PORT 80

# Expose port 80
EXPOSE $PORT

# Use envsubst to replace variables in nginx config and start nginx
CMD /bin/sh -c '/usr/local/bin/envsubst "\$API_URL,\$SERVER_NAME" < /etc/nginx/conf.d/tasks.template > /etc/nginx/conf.d/tasks.conf' && /usr/sbin/nginx -g 'daemon off;'