# fire-store-api

fire-store-api is a simple nodejs db package API for accessing records in 
google firestore data base. It basically a very thin shell over the existing
@google-cloud/firestore. It exposes simple CRUD operations for document 
create, read, update and delete.


## Getting Started

```js
npm i fire-store-api
```

## Pre Requisites

You have a Fire Store Database instance up and running 
You have your google credentials on hand.

#### google credentials and connectivity.

This can be quite a tricky part. However I will try to break it down for you.

There are three ways to access google cloud resources
- API Keys
- OAuth/OpenID
- Service Accounts.


If:
   Your application is running on google cloud then the best way to access your Fire Store 
   database is via a service account. 
   You may create a service account via gcloud tool or a REST url and running the following commands.
   
   Ref:  
         https://cloud.google.com/iam/docs/creating-managing-service-accounts   
         https://github.com/googleapis/google-api-nodejs-client
 
   Have following information:
   
   **service account email id**: <SA_NAME>@<PROJECT_ID>.iam.gserviceaccount.com
   
   You also provide the following information when you create a service account:

    - SA_DESCRIPTION is an optional description for the service account.
    - SA_DISPLAY_NAME is a friendly name for the service account.
    - PROJECT_ID is the ID of your Google Cloud project.

   A REST command
   
       POST https://iam.googleapis.com/v1/projects/PROJECT_ID/serviceAccounts
   
   Request JSON body:
   
        {
            "accountId": "SA_NAME",
            "serviceAccount": {
                                    "description": "SA_DESCRIPTION",
                                    "displayName": "SA_DISPLAY_NAME"
                    }
        }
   
There multiple other ways that one may explore on google link provided above. The simplest
option is to go your project dashboard follow the instructions and have a service account created. After creation of your project service account get it as a json file. This file needs to stored in env variable ***GOOGLE_APPLICATION_CREDENTIALS***=/<path>/<to>/<SA>_key.json. For nodejs projects the best option is to use dotenv package and store it .env file. 

Pass this as an env var to docker run command if being used for a docker image.

This is the simplest and the safest way. For applications running on non google resources you may want to explore google\'s OAuth flows.

And that is how database constructor below knows to connect to your database without any credentials

#### google access tokens.

If:
    You have need using your access tokens for posting rest urls, then the following will help you get there.

command line tool:


```sh
        gcloud auth application-default print-access-token
   
```
   


or

NodeJs function: 


```js  

    const { JWT } = require('google-auth-library');

    async function getToken(keys, url, scopes) {
        //  keys : service_account.json
        //  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        //  const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;

    const client = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: scopes,
    });
   
    const result = await client.request({ url });

    //req.session.jwt = client;
    //req.session.access_token = client.credentials.access_token;
    // console.log(req.session.jwt.credentials.access_token);
    return client;

    }

```

## Constructor

Initialize the api constructor.

```js
var Database = require('fire-store-api');

const db = new Database({
    project_id,
    cache_max_age,
    cache_allocated_memory,
})
```

#### Constructor options

| Property                 | Type             | Description                                | Default value |
|--------------------------|------------------|--------------------------------------------|---------------|
| `project_id`             | String           | Google Cloud Platform project ID           |               |
| `cache_max_age`          | Number (seconds) | Cached data age threshold                  | `3600`        |
| `cache_allocated_memory` | Number (MB)      | Maximum in-memory cache size, in megabytes | `64`          |

When retrieving data, if the cache-matched data was added more than `cache_max_age` seconds ago, we do _not_ return the cached data


---
# Methods

- [write({collection,id},{...data})]
- [readOne({collection,id})] 
- [readMany({{collection}})] 
- [deleteDoc({collection,id})] 
---


### Sample Code


Following is a sample code used in express js. The fire-store-api is used by controllers
which are linked to routes via a standard route file.

##### <approot>/src/controllers/index.js

####################################################################################

Following is a sample code from controllers in express js. These controllers
are the functions tied to the routes in <approot>/src/routers/index.js

####################################################################################


```js
var Database = require('fire-store-api');

const db = new Database();


```
```js

const basicContrl = (req, res, next) => {
    console.log("Url: ", req.url);
    res.locals.data = { "hello": "world !!!" };
    next();
    //res.json({ "hello": "world !!!" });

}

```
```js

const readOneCtrl = (req, res, next) => {
    if (req.params.id) {
        db.readOne(req.params)
            .then((doc) => {
                if (doc.exists) {
                    res.locals.data = doc.data();
                    next();
                    //res.json(doc.data());
                } else {

                    console.log("No such document!");
                    res.json({ "error": "Document does not exist" });
                }
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.log("Error getting document:", error);
                res.json({ "error": error });
            });

    } else {
        console.log("Get Doc failed. Improper Id");
        res.json({ "error": "Get Doc failed. Improper Id" });
    }
    //next();

}
```
```js

const readManyCtrl = (req, res, next) => {
    if (req.params.collection) {
        let arr = [];
        const lim = req.query.limit ? req.query.limit : 10;
        console.log("limit: ", lim);
        db.readMany(req.params, lim)
            .then((snapshots) => {
                snapshots.forEach((doc) => {
                    arr.push(doc.data());
                })
            })
            .then(() => {
                res.locals.data = arr;
                next();
                //res.json(arr);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })

    } else {
        console.log("Get collections failed");
        res.json({ "error": "Get Doc collections failed. Improper Id" });
    }
    //next();

}

```
```js

const writeCtrl = (req, res, next) => {
    const params = {}
    params['collection'] = req.params.collection;

    db.write(params, req.body);

    res.json(req.body);
    //next();
}
```
```js


const updateDocCtrl = (req, res, next) => {

    if (req.params.id) {
        const params = {}
        params['collection'] = req.params.collection;
        params['id'] = req.params.id;
        //console.log("Controller params id",params['id']);
        db.write(req.params, req.body);
    } else {
        console.log("Doc update failed. Improper Id");
    }
    res.json(req.body);
    //next();
}
```
```js

const deleteDocCtrl= (req, res, next) => {

    if (req.params.id) {
        const params = {}
        params['collection'] = req.params.collection;
        params['id'] = req.params.id;       
        db.deleteDoc(req.params);
    } else {
        console.log("Doc delete failed.");
    }
    res.json(req.body);
    //next();
}
```
```js

module.exports = {
    writeCtrl,
    readOneCtrl,
    updateDocCtrl,
    readManyCtrl,
    deleteDocCtrl
 
}
```

####################################################################################

##### <approot>/src/routes/index.js

```js
var express = require('express');
var controllers = require('../controllers');
var router = express.Router();
```
```js

router
  .route('/')
  .get(controllers.basicContrl);
```
```js

  router
  .route('/:collection/:id')
  .get(controllers.readOneCtrl)
  .post(controllers.updateDocCtrl)
  .delete(controllers.deleteDocCtrl)
```
```js

router
  .route('/:collection')
  .get(controllers.readManyCtrl)
  .post(controllers.writeCtrl)
```
```js

module.exports = router;

```

####################################################################################

## Built With

* [Visual Studio Code](https://visualstudio.microsoft.com/) - The Editor
* [NodeJS] (https://nodejs.org/) - The App platform
* [Git](https://github.com/) - Version Control
* [Firestore](https://cloud.google.com/firestore) - Database


## Contributing



## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Sandeep L Chiluveru** 
* [ sandeepnet@aol.com ]

## Acknowledgments

## License
[MIT](https://choosealicense.com/licenses/mit/)

