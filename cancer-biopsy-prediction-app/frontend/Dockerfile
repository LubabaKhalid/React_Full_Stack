# frontend/Dockerfile
FROM node:18

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

# Use a lightweight server to serve React (optional but better)
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
