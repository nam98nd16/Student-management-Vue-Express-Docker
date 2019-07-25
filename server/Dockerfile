FROM node:dubnium

COPY ./docker/entrypoint.sh /entrypoint/

RUN ["chmod", "+x", "entrypoint/entrypoint.sh"]

# Copy or mount node app here
WORKDIR /data/

#COPY package.json /data

#RUN npm install

#COPY . /data

EXPOSE 3000 3001

ENTRYPOINT ["/entrypoint/entrypoint.sh"]

CMD ["npm", "start"]