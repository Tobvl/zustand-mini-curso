import { StateStorage, createJSONStorage } from "zustand/middleware";

const firebaseUrl = 'https://zustand-test1-default-rtdb.firebaseio.com/zustand';

const storageAPI: StateStorage = {
  
  getItem: async function (name: string): Promise<string | null>{

    // buscar la información desde Firebase
    try {
      const data = await fetch(`${firebaseUrl}/${name}.json`)
      .then( res => res.json())
      .catch((e) => (console.log(e)));
      console.log(data);
      // Para ver la data tenemos dos opciones, devolverla como string aquí
      // o devolver el objeto `data` solamente y en la petición PUT
      // enviarlo como string
      return JSON.stringify(data);
    } catch (error) {
      return null;
    }

  },

  // CONSIDERACIÓN IMPORTANTE << CONDICIÓN DE CARRERA >>
  // cada letra que se actualiza, genera una petición al backend Firebase
  // el problema es que puede quedar una petición anterior guardada y ésta
  // ejecutarse después de una petición más nueva, por lo que "los cambios
  // no se guardarían", entonces (con AXIOS) se puede crear un AbortController
  // y éste, va a cancelar las peticiones anteriores cuando reciba una nueva
  // y sólo quedará con la última información actualizada
  setItem: async function (name: string, value: string): Promise<void> {
    
    // ahora para guardar información lo haremos también en firebase
    // const data = 
    await fetch(`${firebaseUrl}/${name}.json`, {
      method:'PUT',
      body:value
    }).then( res => res.json());

    // console.log(data)
    
    return;
  },
  
  removeItem: function (name: string): unknown {
    console.log('removeItem', name)
    return null;
  }
}

export const firebaseStorage = createJSONStorage(() => storageAPI)