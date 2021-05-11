# fireStoreAPI

fireStoreAPI is a simple nodejs db package API for accessing records in 
google firestore data base.


## Getting Started

Please note that you must have a valid credentials by the way of a 
security account file json key in you application. 


### Prerequisites and setting up your environment

What things you need to install the software and how to install them

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


## Installation via Docker file.

Run the db package and companion package via a docker file.

Download the docker file and presuming that docker environment has been set up locally.

```bash
docker build -t sanchil/nicejob .

docker run --name nodeapp -dp 4000:3000 \
  -e GOOGLE_APPLICATION_CREDENTIALS=<key_file_name>.json \
  -e USERS=<collection> \
  -e NODE_ENV=prod \
  sanchil/nicejob
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

## Manual Installation and Setup.

```bash

npx express-generator --git --no-view nicejob
cd nicejob
npm i --save @google-cloud/firestore
npm i --save dotenv nanoid
npm i --save-dev @babel/cli @babel/core @babel/node @babel/preset-env 
npm i --save-dev nodemon rimraf
npm i --save-dev jest

```



## Usage

To start the application change into nicejob app directory and run the following command.

```bash

npm run start:prod

```
To clean and build separately run the following two commands.

```bash

npm run clean
npm run build

```

### The access the services


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



### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

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

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Visual Studio Code](https://visualstudio.microsoft.com/) - The Editor
* [NodeJS] (https://nodejs.org/) - The App platform
* [Git](https://github.com/) - Version Control
* [Docker](https://www.docker.com) - Containerization
* [Firestore](https://cloud.google.com/firestore) - Database
* [Google Cloud](https://console.cloud.google.com/) - Cloud Solutions


## Contributing

Please read [CONTRIBUTING.md]for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Sandeep L Chiluveru** - 

## License


## Acknowledgments








## License
[MIT](https://choosealicense.com/licenses/mit/)
