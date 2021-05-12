# fireStoreAPI

fireStoreAPI is a simple nodejs db package API for accessing records in 
google firestore data base.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment section for notes on how to deploy the project on a live system.

### Prerequisites and setting up your environment

Artifacts you need to install the software and how to install them

### 1. firestore account on google
      
### 2. vm on google
### 3. nodejs platform
  * Test Environement: JEST
  * Code Transpiler: Babel
  * Node monitor: nodemon
### 4. docker latest
### 7. vs code/vim or just any editor you like
    With all the necessary plugins to handle various types of files such as yaml, javacript, Dockerfiles etc

#### create firestore account

Create google project on console.cloud.com

#### create a firestore db
Create a firestore db and manually add a few small records. For sake of demo. 
This project adds following three fields
  
  
{
first_name:,
  
  
last_name:,
  
  
email:,
}

#### install gcloud
This is optional but one may install the gcloud sdk on local environment to set up service accounts and access credentials for your project

#### create a serviceaccount and a key file

following are the gcloud commands that you need to execute to get a service account and credentials.

```bash
gcloud iam service-accounts create <serviceaaccount_name>
gcloud projects add-iam-policy-binding <projectid> --member="serviceAccount:<serviceaaccount_name>@<project_id>.iam.gserviceaccount.com" --role="roles/owner"
gcloud iam service-accounts keys create <key_file_name>.json --iam-account=<serviceaaccount_name>@<project_id>.iam.gserviceaccount.com

```
For retrieving the key file do an ls and a cat on the key file and copy it and save it locally

```bash
ls -l
cat key_file_name>.json
```

## Installation 

### Artifacts

There is one artifact in this package:

1. fireStoreAPI
   An api package to write, read one and read many records  
  
3. Dockerfiles
  1. Dockerfile # To build the nicejob companion package and the fireStoreAPI package
  
### Environment

Makes use of no enviroment variables. The variables will be picked by the companion applcation.

### via Docker files.

Run the following commands on local docker environment. nicejob runs on port 3000 in the container. 

#### Create a dedicated network redis-net, for nodeapp and redis to run on. 

```bash
docker network create --driver bridge redis-net
```

#### Pull image for nodeapp the companion application and fireStoreAPI DB package

```bash
docker pull sanchil/nicejob:1.3
```

**Note**  

Create the network first, then deploy the cache and finally the expressjs application nodeapp.



#### Start nodeapp application.

```bash
docker run --name nodeapp -dp 3000:3000 \
  --network redis-net \
  -e GOOGLE_APPLICATION_CREDENTIALS=nicejob_key.json \
  -e USERS=Users \
  -e NODE_ENV=prod \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  sanchil/nicejob:1.3
```

**Note**  

fireStoreAPI and nicejob companion application have been merged into a single image named nodeapp. cache is a separate image to handle serverside caching.
Please ensure the host ports are mapped correctly to the container ports of node:3000 and redis:6379


### Alternatively, build local images via Docker files.

You may also build the images locally via the docker files located inside the packages. 

Dockerfiles
1> Dockerfile # for building nicejob companion app and fireStoreAPI db packages
Run the db package and companion package via a docker file.

Run the docker build command from the parent folders of nicejob and fireStoreAPI

<root>
      + nicejob/Dockerfile
      + fireStoreAPI

from <root> folder run the following two build commands. This is necessary for Dockerfile to build a combined image, but optional for building redis cache.
      commands to run these images are same as above

Create redis-net network first
      
```bash
docker network create --driver bridge redis-net
```
Build nodeapp

```bash
docker build -t sanchil/nicejob:1.3 -f nice/job/Dockerfile .
```

#### to stop the application  
```bash
docker stop nodeapp
```
#### force stop and remove the application  
```bash
docker rm -f nodeapp
```

Access the application on http://localhost:4000.

To do a quick check run the curl commmands listed under the test section.

### Manual Installation and Setup.

#### For building the fireStoreAPI

```bash
mkdir fireStore
cd fireStore
npm init -y
npm i --save @google-cloud/firestore dotenv
```


## Usage

To start the application change into nicejob app directory and run the following command. The cleans builds and runs

```bash

npm run start:prod

```

To clean and build separately run the following two commands.

```bash
npm run clean
npm run build
```

To run the tests.

Please appropriate modifications to the __test__/getrecords.test.js file to reflect the correct firestore value. It checks for a first_name of a particular record.

```bash

npm run test

```

## Tests

### The access the services via curl

##### readOne

```bash
curl -X GET -H "Content-Type:application/json" http://localhost:3000/:collection/:id 
```

##### readMany

```bash
curl -X GET -H "Content-Type:application/json" http://localhost:3000/:collection
```

##### write
To create a record

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3000/:collection
```

##### update
To update a record

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3000/:collection/:id
```

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```
## Access

Create an instance template with a random docker image say for eg nginx. This is only to create a dockerized instance.
Do not use sanchil/cache:1.0 or sanchil/nicejob:1.3 as these needed to be bound to the manually created network of redis-net
Google cloud instances and instance template.

Note the ip addresses of the instances.

## Deployment

Once logged into the VM instances pull the docker images as per the instructions above and run them. Test them with curl commands.

## Built With

* [Visual Studio Code](https://visualstudio.microsoft.com/) - The Editor
* [NodeJS] (https://nodejs.org/) - The App platform
* [Git](https://github.com/) - Version Control
* [Docker](https://www.docker.com) - Containerization
* [Firestore](https://cloud.google.com/firestore) - Database
* [Google Cloud](https://console.cloud.google.com/) - Cloud Solutions


## Contributing



## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Sandeep L Chiluveru** - 
* [ sandeepnet@aol.com ]

## Acknowledgments

## License
[MIT](https://choosealicense.com/licenses/mit/)

