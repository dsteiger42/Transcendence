# Usa a imagem oficial do Nginx baseada em Alpine (leve e segura)
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

# Remove o arquivo de configuração padrão do Nginx
COPY nginx/certs /etc/nginx/certs/
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copia o seu arquivo de configuração customizado para dentro do container
#COPY nginx.conf /etc/nginx/nginx.conf

# Copia a pasta de certificados SSL para dentro do container
#COPY certs/ /etc/nginx/certs/

# Informa ao Docker que o container escuta nas portas HTTP (80) e HTTPS (443)
EXPOSE 80 443

# Comando para iniciar o Nginx em primeiro plano (obrigatório para o Docker não fechar)
CMD ["start.sh","nginx", "-g", "daemon off;"]