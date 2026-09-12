FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]