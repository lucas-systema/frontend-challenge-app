FROM node:18-alpine 

WORKDIR /app

COPY . .

RUN npm ci 

#RUN npm run build
RUN npm run start

#ENV NODE_ENV production
ENV NODE_ENV development

EXPOSE 3000

#CMD [ "npx", "serve", "build" ]
CMD [ "npx", "serve", "start" ]