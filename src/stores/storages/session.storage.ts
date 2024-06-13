import { StateStorage, createJSONStorage } from "zustand/middleware";

const firebaseUrl = 'https://zustand-test1-default-rtdb.firebaseio.com/zustand.json';

const storageAPI: StateStorage = {
  
  getItem: async function (name: string): Promise<string | null>{

    // grabar en Firebase
    try {
      const data = await fetch(`${firebaseUrl}/${name}`)
        .then( res => res.json())
        .catch((e) => {throw e});
      console.log(data)
      return data;
    } catch (error) {
      return null
    }

  },
  setItem: function (name: string, value: string): void {
    
    sessionStorage.setItem(name, value)
  },
  removeItem: function (name: string): unknown {
    console.log('removeItem', name)
    return null;
  }
}

export const customSessionStorage = createJSONStorage(() => storageAPI)