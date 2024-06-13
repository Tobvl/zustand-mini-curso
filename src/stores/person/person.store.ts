// le colocamos type a StateCreator para que no
// importe nada ya que lo utilizaremos solo como
// interfaz
import { type StateCreator, create } from 'zustand';
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware';

interface PersonState {
  firstName: string,
  lastName: string,
}

// Aqui almacenaremos las acciones para nuestro store
interface Actions {
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}


const storeAPI: StateCreator<PersonState & Actions> = (set) => ({
  firstName: "",
  lastName: "",

  setFirstName: (value: string) => set((state) => ({firstName: value})),
  setLastName: (value: string) => set((state) => ({lastName: value}))

});

// con CTRL+. en sessionStorage podremos agregar
// las propiedades que debemos implementar
const customSessionStorage: StateStorage = {
  
  // getItem es cuando se carga el estado
  getItem: function (name: string): string | Promise<string | null> | null {

    const data = sessionStorage.getItem(name);
    return data;
  },
  setItem: function (name: string, value: string): void {
    
    sessionStorage.setItem(name, value)
  },
  removeItem: function (name: string): unknown {
    console.log('removeItem', name)
    return null;
  }
}

// el create es un genérico de PersonState y Actions
export const usePersonStore = create<PersonState & Actions>()(
  // para que persista la información por medio de un
  // localstorage, debemos envolver toda la función
  // set de nuestro Store y al final, agregarle un objeto
  // con el nombre que tendrá el storage en localstorage
  persist(
    storeAPI
  , {
    // aquí tenemos otra propiedad que se llama storage
    // que espera algo de tipo createJSONStorage
    name:'person-storage',
    // entonces le pasamos a la función createJSONStorage
    // el sessionStorage definido
    // por medio de un callback
    storage: createJSONStorage(() => customSessionStorage),
  })
)