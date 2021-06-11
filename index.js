/**
 * ##########################################################################
 * ##########################################################################
 * ##########################################################################
 * APIs for Google firestore database.
 * 
 * write(Object<json>,filter<string>):     
 *      
 *      writes and updates to a firestore Database
 * 
 * readOne(record_id<string>)  :     
 *      
 *      reads one record from a fire store database
 * 
 * readMany(collection_name<string>,no_of_records<string/Number>) :     
 *      
 *      reads multiple records from a database
 * 
 * ##########################################################################
 */
const { nanoid } = require('nanoid');
const fireDBCon = require('./dbcon');



/**
 * ##########################################################################
 * Writes a document to the database, and to the in-memory cache.
 * ### Parameters
 *
 * | Parameter    | Type   | Required | Description |
 * | ------------ | ------ | -------- | ----------- |
 * | `collection` | `string` whose value is enforced by `DataType` | &check;  | Firestore collection |
 * | `id`         | `string` | &check;  | Firestore document ID |
 * | `document`   | `object` whose shape is enforced by `DataType` | &check;  | Firestore document ID |
 * ##########################################################################
 */

const write = async (params, data) => {
  try {
    const userCollections = await fireDBCon.collection(params.collection);
    let newid = "";
    if (params.id) {
      return userCollections.doc(params.id)
        .update(data)
        .then(() => {
          console.log("Update doc called");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });

    } else {

      if (data.email) {
        newid = data.email.replace(/\s+/g, '') + '_' + nanoid(4);
      } else {
        newid = nanoid(4);
      }

      console.log("Datra: ", data.email);
      return userCollections.doc(newid)
        .set(data)
        .then(() => {
          console.log("Add doc called");
        })
        .catch((error) => {
          console.errdbor("Error adding document: ", error);
        });

    }
  }
  catch (err) {
    console.log("Document write error: ", err.message);
  }

}

/**
 * ##########################################################################
 * Retrieves a single document from the database, or, if applicable, 
 * from the in-memory cache.
 * 
 * 
 * ##########################################################################
 */

const readOne = async (params) => {
  var getOptions = {
    source: 'cache'
  };

  const userCollections = fireDBCon.collection(params.collection);
  return userCollections.doc(params.id)
    .get(getOptions)
    .then(doc => doc)
    .catch(err => {
      // add a check to an error code.
      return userCollections.doc(params.id)
        .get();
    });

}


/**
 * ##########################################################################
 * Retrieves a set of documents from the database, or, if applicable, 
 * from the in-memory cache.
 * 
 * 
 * ##########################################################################
 */

const readMany = async (params, lim) => {
  const userCollections = fireDBCon.collection(params.collection);
  const limNum = parseInt(Number(lim));
  var getOptions = {
    source: 'cache'
  };

  if (limNum > 0) {
    return userCollections
      .limit(limNum)
      .get(getOptions)
      .then(doc => doc)
      .catch(err => {
        // add a check to an error code.
      //  return userCollections.limit(limNum).get()
      console.log("Document retrieval error",err.message,": Err code: ", err.code);
      });
  } else if (limNum < 0){
    return userCollections      
      .get(getOptions)
      .then(doc => doc)
      .catch(err => {
        // add a check to an error code.
        //return userCollections.limit(limNum).get()
        console.log("Document retrieval error",err.message,": Err code: ", err.code);
      });
  }else{
    return [];
  }
}

/* const deleteField = async (params) => {
  const userCollections = fireDBCon.collection(params.collection);
  // Get the `FieldValue` object
  const FieldValue = admin.firestore.FieldValue;

  // Create a document reference
  const docRef = userCollections.doc(params.id);

  // Remove the 'capital' field from the document
  const res = await cityRef.update({
    params.field: FieldValue.delete()
  });

} */

const deleteDoc = async (params) => {
  const userCollections = fireDBCon.collection(params.collection);
  userCollections.doc(params.id).delete()
    .then(res => {
      console.log("Document delete successfully");
    })
    .catch(err => { console("Document delete error: ", err.code, " Mesg: ", err.message) });

}

/* const deleteCollection = async (db, collectionPath, batchSize)=> {
  const userCollections = fireDBCon.collection(params.collection);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}
 */
exports.printMsg = function () {
  console.log("This is a message from the fireStoreAPI package");
}



module.exports = function (opts) {
  // opt reserved for future designs.  
  return {
    write: write,
    readOne: readOne,
    readMany: readMany,
    deleteDoc: deleteDoc
  }

}

