import { create } from 'zustand'


interface Bear {
  id: number,
  name: string,
}

interface BearState {
  blackBears: number;
  polarBears: number;
  pandaBears: number;

  bears: Bear[];
  
  // Si quiero incrementar blackbears, aqui podemos definir
  //  como quiero que luzca la funcion que lo haga.
  increaseBlackBears: (by: number) => void;
  increasePolarBears: (by: number) => void;
  increasePandaBears: (by: number) => void;
  
  doNothing: () => void;
  
}

// Un estado puede contar tanto con los "items(bools, objs,..)" de estado,
// como con las funciones que modifican el estado con otra interfaz.
export const useBearStore = create<BearState>((set) => ({
  blackBears: 10,
  polarBears: 5,
  pandaBears: 1,

  bears: [{id: 1, name:"Oso #1"}],
  
  increaseBlackBears: (by: number) => set((state) => ({ blackBears: state.blackBears + by })),
  increasePolarBears: (by: number) => set((state) => ({ polarBears: state.polarBears + by })),
  increasePandaBears: (by: number) => set((state) => ({ pandaBears: state.pandaBears + by })),
  
  doNothing: () => set(state => ({ bears: [...state.bears] })),
  
}))