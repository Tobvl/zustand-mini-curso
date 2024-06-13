import { StateStorage, createJSONStorage } from "zustand/middleware";
// con CTRL+. en sessionStorage podremos agregar
// las propiedades que debemos implementar
const storageAPI: StateStorage = {
  
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

export const customSessionStorage = createJSONStorage(() => storageAPI)