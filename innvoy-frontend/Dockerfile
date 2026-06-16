FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS production
ENV NGINX_ENVSUBST_TEMPLATE_VARS=BACKEND_URL
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
