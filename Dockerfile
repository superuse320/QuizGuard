# Usamos Node 20 por las dependencias modernas de IA y Express 5
FROM node:20-alpine

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos todas las dependencias (incluyendo devDependencies para nodemon)
RUN npm install

COPY . .

EXPOSE 3000

# Por defecto usamos start, pero el compose lo sobreescribirá para desarrollo
CMD ["npm", "start"]
