# fire-store-api

fire-store-api is a simple nodejs db package API for accessing records in 
google firestore data base.

## Getting Started

npm i fire-store-api

## Constructor

```js
import Database from 'database-module';

const db = new Database({
    project_id,
    cache_max_age,
    cache_allocated_memory,
})
```

#### Constructor options

| Property | Type | Description | Default value |
| -------- | ---- | ----------- | ------- |
| `project_id` | String | Google Cloud Platform project ID | |
| `cache_max_age` | Number (seconds) | Cached data age threshold | `3600` |
| `cache_allocated_memory` | Number (MB) | Maximum in-memory cache size, in megabytes | `64` |

- When retrieving data, if the cache-matched data was added more than `cache_max_age` seconds ago, we do _not_ return the cached data


---
# Methods

- [write()](#writedatatype-collection-id--document)
- [readOne()](#readonedatatype-collection-id-) 
- [readMany()](#readmanydatatype-collection--filters) 

---
## write\<DataType>({ collection, id }, document)
Writes a document to the database, and to the in-memory cache.

```ts
await db.write<DataType>({ collection, id }, document);
```

### Parameters

| Parameter    | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `collection` | `string` whose value is enforced by `DataType` | &check;  | Firestore collection |
| `id`         | `string` | &check;  | Firestore document ID |
| `document`   | `object` whose shape is enforced by `DataType` | &check;  | Firestore document ID |

### Returns
This method does not return anything.


### Typescript (optional)
- The generic `DataType` should confer _both_ the structure of `document` **and** the value of `collection`
    - e.g. a type `UserType` demands that `document` include a `first_name`, `last_name`, and `email`; while also demanding that the `collection` value is `"Users"`
- Enforce that all property names of `document` are strings, and that all property value types are either strings, numbers, booleans, or arrays of strings
    - Property values may also be nested objects that meet these same criteria


### Errors
This method should throw if:
- Either `collection`, `id`, or `document` are not provided, or are falsy – all are required


### Example usage
```ts
/**
 * Save a document
 */
await db.write<UserType>({ 
    collection: "Users",          // Enforced by UserType
    id: "23"
}, {                              // Enforced by UserType
    first_name: "Michael",
    last_name: "Angelo",
    email: "mangelo@sistine.org",
})
```

---
## readOne\<DataType>({ collection, id })
Retrieves a single document from the database, or, if applicable, from the in-memory cache.

```ts
const document = await db.readOne<DataType>({ collection, id });
```

### Parameters

| Parameter    | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `collection` | `string` whose value is enforced by `DataType` | &check;  | Firestore collection |
| `id`         | `string` |  &check; | Firestore document ID ||


### Returns
This method returns a single document, an object, whose type is to be inferred by the `DataType` generic. If the document does not exist, the method throws an error.


#### Methods supported

## Built With

* [Visual Studio Code](https://visualstudio.microsoft.com/) - The Editor
* [NodeJS] (https://nodejs.org/) - The App platform
* [Git](https://github.com/) - Version Control
* [Firestore](https://cloud.google.com/firestore) - Database


## Contributing



## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Sandeep L Chiluveru** - 
* [ sandeepnet@aol.com ]

## Acknowledgments

## License
[MIT](https://choosealicense.com/licenses/mit/)

