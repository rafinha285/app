# Use a imagem oficial do Node.js como base
FROM node:21

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie os arquivos do aplicativo para o diretório de trabalho
COPY . .

# Instale as dependências
RUN npm install

# Exponha a porta que o aplicativo vai escutar
EXPOSE 443

# Comando para iniciar o aplicativo
CMD ["node", "client.js"]