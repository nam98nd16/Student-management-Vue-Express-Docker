FROM node:carbon

#RUN apt-get update && apt-get install -y dos2unix

COPY ./docker/entrypoint.sh /entrypoint/

#RUN dos2unix /entrypoint/entrypoint.sh && apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*

RUN ["chmod", "+x", "entrypoint/entrypoint.sh"]

# Copy or mount node app here
WORKDIR /data/

EXPOSE 8080

ENTRYPOINT ["/entrypoint/entrypoint.sh"]

CMD ["npm", "start"]