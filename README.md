# Assessment-HG
An assessment test with Redis, NodeJS and ReactJS.

## File Structure
``` 
   HolyGrail (Project Source)
      - public (react static files)
      - services (Project services dir)
          - Redis
            - initialize.js
            - helpers.js
      - index.js (main)
      - package.json 
      - Dockerfile (To initialize docker container. Referenced in Docker Compose file.)
      - .env.sample (A sample env file for reference)
      - .env (ENV file is included 'cause this is a demo app and won't be used as production)
   - docker-compose.yml 
   - .gitignore
   - .dockerignore
   (Docker command scripts for the ease of testing).
   - docker-rebuild-services.sh (Rebuild docker compose services)
   - docker-restart-services.sh (To restart docker compose services)
   - docker-stop-services.sh (To stop docker compose services).
   - docker-start-services.sh (To start the services)
```


### Prerequisites
- Docker
- Docker-Compose


### To build name run the services 
```
  chmod +x docker-build-services.sh ; sh docker-build-services.sh
  OR
  . docker-build-services.sh
```
- When making a change in the file, a rebuild of the service(s) is necessary to ensure volume sync. Or another way would be Copy the files directly in the respective docker container.
