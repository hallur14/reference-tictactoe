FROM node
WORKDIR /code
COPY package.json .
RUN npm install --silent
COPY . .
ENV NODE_PATH .
EXPOSE 3000
CMD ["node","run.js"]
