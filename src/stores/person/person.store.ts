// le colocamos type a StateCreator para que no
// importe nada ya que lo utilizaremos solo como
// interfaz
import { type StateCreator, create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
// import { customSessionStorage } from '../storages/session.storage';
import { firebaseStorage } from '../storages/firebase.storage';
// import { logger } from '../middlewares/logger.middleware';

interface PersonState {
  firstName: string,
  lastName: string,
}

// Aqui almacenaremos las acciones para nuestro store
interface Actions {
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}


const storeAPI: StateCreator<PersonState & Actions, [["zustand/devtools", never]]> = (set) => ({
  firstName: "",
  lastName: "",

  setFirstName: (value: string) => set(({firstName: value}), false, 'setFirstName'),
  setLastName: (value: string) => set(({lastName: value}), false, 'setLastName')

});



// el create es un genérico de PersonState y Actions
export const usePersonStore = create<PersonState & Actions>()(
  // para que persista la información por medio de un
  // localstorage, debemos envolver toda la función
  // set de nuestro Store y al final, agregarle un objeto
  // con el nombre que tendrá el storage en localstorage

  // podemos integrar Redux DevTools integrando todo a su middleware correspondiente
  
  // logger(
  // ) middleware, produce un nuevo estado
  devtools(
    persist(
      storeAPI, {
        // aquí tenemos otra propiedad que se llama storage
        // que espera algo de tipo createJSONStorage
        name:'person-storage',
        // entonces le pasamos a la función createJSONStorage
        // el sessionStorage definido
        // por medio de un callback
        storage: firebaseStorage,
      }
    )
  )
);