import { database, auth } from '../Database'
import { ref, get, set, child, remove, serverTimestamp } from "firebase/database";

// Add new item collection
export const addCollection = (name, color) => {
    return new Promise((resolve, reject) => {
      // query to check if collection already exists
      get(ref(
        database, 'users/' + auth.currentUser.uid + '/collections/' + name)
      )
      .then(snapshot => {
        const result = snapshot.val();
  
        if(result) {
            reject("Collection name already exists!")
        } else {
          const reference = child(ref(
            database, 'users/' + auth.currentUser.uid + '/collections/'
          ), name)
        
          set(reference, {
            itemCount: 0,
            color: color,
            creationDate: serverTimestamp()
          })
          resolve(name)
        }
      })
      .catch(e => reject(e.code))
    })
  }
  
  export const removeCollection = (name) => {
    return new Promise((resolve, reject) => {
        remove(ref(
            database, 'users/' + auth.currentUser.uid + '/collections/' + name
        ))
        .catch(e => reject(e.code))
        remove(ref(
            database, 'users/' + auth.currentUser.uid + '/itemdata/' + name
        ))
        .catch(e => reject(e.code))
        
        resolve()
    })
}