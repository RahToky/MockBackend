# Utilisez une image de base avec Node.js préinstallé
FROM node:14

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installez les dépendances de votre application
RUN npm install

# Copiez les fichiers statiques du dossier ./public
COPY ./public ./public

# Copiez les fichiers Pug du dossier ./src/views
COPY ./src/views ./src/views

# Copiez tous les fichiers de votre application dans le répertoire de travail
COPY ./dist ./dist

# Exposez le port sur lequel votre application écoute
EXPOSE 1104

# Commande pour démarrer votre application
CMD ["node", "dist/server.js"]
