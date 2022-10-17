import { database, auth } from '../Database'
import { ref, get, set, child, remove, serverTimestamp, update } from "firebase/database";
import { TabRouter } from 'react-navigation';

export const editInventory = (name, values) => {
  let inventoryRef
  let itemsRef
  
  if(values.shared) {
    inventoryRef = ref(database, 'shared/inventories/' + values.accessCode)
    itemsRef = ref(database, 'shared/itemdata/' + values.accessCode)
  } else {
    inventoryRef = ref(database, 'users/' + auth.currentUser.uid + '/inventories/')
    itemsRef = ref(database, 'users/' + auth.currentUser.uid + '/itemdata/')
  }
  
  return new Promise((resolve, reject) => {
    if(name !== values.name) { // Data needs to be readded if name is changed
      // Check if name is already taken
      get(child(inventoryRef, values.name))
      .then(snapshot => {
        const existingData = snapshot.val();

        if(existingData) {
            reject("Inventory name already exists!")
            
        } else {
          // Get items in the inventory
          get(child(itemsRef, name))
          .then(snapshot => {
            const itemdata = snapshot.val()

            // Move items from old db location to new
            set(child(itemsRef, values.name), 
            {...itemdata})
            .catch(e => reject(e))

            // Move inventory info
            get(child(inventoryRef, name))
            .then(snapshot => {
              const inventorydata = snapshot.val()
              addInventory(
                values.name, {
                  ...inventorydata,
                  ...values
                }
              )
              .catch(e => reject(e))
            })
            .catch(e => reject(e))
            
            // Remove old data
            removeInventory(name)
            .catch(e => reject(e))

            resolve()
          })
        }
      })
    } else { // No name change required
      update(ref(database, 'users/' + auth.currentUser.uid + '/inventories/' + oldName), {
        values
      })
      .then(res => resolve())
      .catch(e => reject(e))
    }
  })
}

export const getInventoryAccess = (accessCode) => {
  return new Promise((resolve, reject) => {
    get(ref(database, 'shared/inventories/' + accessCode))
    .then(snapshot => {
      const result = snapshot.val();
      if(!result) {
        reject("Access code is invalid")
      } else if(result.creator === auth.currentUser.displayName) {
        reject("This inventory is owned by you")
      } else {
        update(ref(database, 'users/' + auth.currentUser.uid + '/inventories/' + result.name),{
          ...result,
          accessCode: accessCode,
          itemCount: null
        })
        .then(res => resolve(result))
      }
    })
    .catch(e => reject(e))
  })
}

// Creates inventory which is accessible for multiple users with a code
const createSharedInventory = (name, values) => {
  // Creates a random identifier which is used to access the shared inventory
  let accessCode = (Math.random() + 1).toString(36).substring(7)
  let reference = ref(database, 'shared/inventories/' + accessCode)
  console.log("New shared inventory: " + accessCode)

  return new Promise((resolve, reject) => {
    get(reference)
    .then(snapshot => {
      const result = snapshot.val();
      if(!result) {
        set(reference, {...values, name: name})
        .catch(e => reject(e))
        update(ref(database, 'users/' + auth.currentUser.uid + '/inventories/' + name),{
          ...values,
          accessCode: accessCode,
          itemCount: null
        })
        .catch(e => reject(e))

        resolve(accessCode)
      } else {
        // retry if exists
        createSharedInventory()
        .then(res => resolve(res))
        .catch(e => reject(e))
      }
    })
    .catch(e => reject(e))
  })
}

// Creates inventory which is accessible under user id
const createPrivateInventory = (name, values) => {
  let reference = ref(database, 'users/' + auth.currentUser.uid + '/inventories/' + name)

  return new Promise((resolve, reject) => {
    // query to check if inventory already exists
    get(reference)
    .then(snapshot => {
      const result = snapshot.val();
      if(result) {
          reject("Inventory name already exists!")
      } else {
        set(reference, {...values, shared: false})
        .then(res => resolve())
        .catch(e => reject(e))
      }
    })
    .catch(e => reject(e))
  })
}

// Add new item inventory
export const addInventory = (name, values = {}) => {

    const initValues = {
      ...values,
      itemCount: values.itemCount ?? 0,
      creationDate: values.timestamp ?? serverTimestamp(),
    }
    
    return new Promise((resolve, reject) => {
      if(values.shared) {
        createSharedInventory(name, initValues)
        .then(res => resolve(res))
        .catch(e => reject(e))
      } else {
        createPrivateInventory(name, initValues)
        .then(res => resolve(res))
        .catch(e => reject(e))
      }
    })
}
  
export const removeInventory = (inventory) => {
    let db_path = ""
    let inventoryKey = ""

    if(inventory.shared) {
        db_path = ref(database, 'shared')
        inventoryKey = inventory.accessCode
    } else {
        db_path = ref(database, 'users/' + auth.currentUser.uid)
        inventoryKey = inventory.name
    }
    
    return new Promise((resolve, reject) => {
        remove(child(db_path, '/inventories/' + inventoryKey))
        .catch(e => reject(e))
        remove(child(db_path, '/itemdata/' + inventoryKey))
        .catch(e => reject(e))
        if(inventory.shared) {
          remove(ref(database, 'users/' + auth.currentUser.uid + '/inventories/' + inventory.name))
        }
        resolve()
    })
}

export const removeInventoryAccess = (inventory) => {
  return new Promise((resolve, reject) => {
    if(inventory.shared) {
      remove(ref(database, 'users/' + auth.currentUser.uid + '/inventories/' + inventory.name))
      .then(res => resolve())
      .catch(e => reject(e))
    }
})
}