FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 4000

ENV PORT=4000
ENV AGENTS_SERVICE_URL=http://agents:8000
ENV BLOCKCHAIN_RPC_URL=http://blockchain:8545

CMD ["node", "server.js"]
