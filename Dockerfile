FROM node
WORKDIR /code
COPY package.json .
RUN npm install --silent
COPY index.js .
COPY ./test/ /code/test
EXPOSE 3000
CMD ["node","index.js"]
