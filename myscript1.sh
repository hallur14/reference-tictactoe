#!/bin/bash

#testing 123456

echo Cleaning...
rm -rf ./build


if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  export GIT_URL=$(git config --get remote.origin.url)
fi

# Remove .git from url in order to get https link to repo (assumes https url for GitHub)
export GITHUB_URL=$(echo $GIT_URL | rev | cut -c 5- | rev)

# Create environment file for docker
echo "GIT_COMMIT=$(echo $GIT_COMMIT)" > .env

npm install --silent
cd client
npm install --silent
cd ..
npm run build

echo Building app
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm build failed with exit code " $rc
    exit $rc
fi


cat > ./build/githash.txt <<_EOF_
$GIT_COMMIT
_EOF_

mkdir ./build/public/
cat > ./build/public/version.html << _EOF_
<!doctype html>
<head>
   <title>App version information</title>
</head>
<body>
   <span>Origin:</span> <span>$GITHUB_URL</span>
   <span>Revision:</span> <span>$GIT_COMMIT</span>
   <p>
   <div><a href="$GITHUB_URL/commits/$GIT_COMMIT">History of current version</a></div>
</body>
_EOF_


cp ./Dockerfile ./build/

cp ./package.json ./build/

cp ./start.sh ./build
cd build
echo Building docker image

docker build -t hallur14/tictactoe .


rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker build failed " $rc
    exit $rc
fi

docker push hallur14/tictactoe 
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker push failed " $rc
    exit $rc
fi

scp -i ./../Keys/hallur14key.pem .env ec1-user@ec2-54-214-80-23.us-west-2.compute.amazonaws.com:


echo Ran Build Script successfully
