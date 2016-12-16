## Application SOLUTION for HGOP 2016 Student project

Global installation requirements:

nodejs version 6.9.1
https://nodejs.org/en/

optional: yarn for package management (server only).
https://yarnpkg.com/

Add ./node_modules/.bin to your path. This enables to you to run locally installed npm commands.

nodemon for watching server and restarting on modifications.
```
npm install -g nodemon
```


For developing React single-page-app (optional):

```
npm install -g create-react-app
```


## Getting started:

Install and run postgres docker image for development.
```
docker run -p 5432:5432 --name pg2 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

In project root directory:

```
yarn install (or npm install)

npm run migratedb

npm run start
```

To run server side tests in watch mode (in another terminal window):
```
npm run test
```



In another terminal window:
```
cd client
npm install
npm run start
```

At this point you should see the HGOP intro page open in your browser.
If not, you should be able to point your browser to http://localhost:3000 and open it.

To run client tests in watch mode:
```
cd client
npm run test
```


To run API tests, simulating client calls to server socket-io api:

```
npm run apitest
```


To run API load tests, simulating client load on server socket-io api:

```
npm run loadtest
```


To build and deploy new version in a new ec2 instance on amazon:

```
./dockerbuild.sh

export GIT_COMMIT= <git hash used to tag your container>

cd provision
./provision-new-environment.sh
```



## Notes

The main emphasis in this sample application is on object decomposition and testability, achieved with fine-grained
objects wired together with aggressive use of dependency injection. The architecture style used is fully message based
using Command Query Responsibility Segregation (CQRS) with event sourcing. This is an appropriate architecture for
many classes of applications, such as where synchronizing views of multiple users is an important concern, and where
achieving near-linear scaling of servers in clustered environments is a concern.

Note that transaction support, error handling and logging are incomplete, and many other details that would be required in
production-ready clustered applications are not present. One such is persistent user sessions.


## Links

http://docs.aws.amazon.com/cli/latest/userguide/cli-ec2-launch.html
