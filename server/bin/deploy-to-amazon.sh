#!/usr/bin/env bash

IMAGE_TAG="okornok-node-dev"
DOCKERHUB_ID_USER="okornok"
DOCKERHUB_PASSWORD="mN452ert"

echo "You should have docker, elasticbeanstalk cli in your system"
eb --version
docker --version
echo "0. Copying aws config to ~/.aws/config, it will delete all previous aws configs"
rm -rf ~/.aws/ && mkdir ~/.aws/ && touch ~/.aws/config && cp .config/aws.credentials.config ~/.aws/config
cat ~/.aws/config
echo "1. Building frontend"
npm run build:client
echo "2. Building docker container"
docker login --username $DOCKERHUB_ID_USER --password $DOCKERHUB_PASSWORD
docker build --no-cache --tag $DOCKERHUB_ID_USER/$IMAGE_TAG .
echo "3. Pushing to docker hub"
docker push $DOCKERHUB_ID_USER/$IMAGE_TAG
echo 'sleeping for 60 seconds'
sleep 60
echo "4. Elasticbeanstalk deploying"
eb deploy --label "okornok-dev-$(date +%s)" --process --timeout 20
