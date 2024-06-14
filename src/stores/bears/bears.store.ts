import { create } from 'zustand'
import { persist } from 'zustand/middleware';


interface Bear {
  id: number,
  name: string,
}

interface BearState {
  blackBears: number;
  polarBears: number;
  pandaBears: number;

  bears: Bear[];

  // computed: {
  //   totalBears: number;
  // },
  
  // un FIX para utilizar la propiedad computada es que la mandemos a llamar
  // como los otros métodos
  totalBears: () => number;
  
  // Si quiero incrementar blackbears, aqui podemos definir
  //  como quiero que luzca la funcion que lo haga.
  increaseBlackBears: (by: number) => void;
  increasePolarBears: (by: number) => void;
  increasePandaBears: (by: number) => void;
  
  doNothing: () => void;
  addBear: () => void;
  clearBears: () => void;

  
}

// CONSIDERACIONES IMPORTANTES << GETTER DENTRO DE UN PERSIST >>
// el método get() no funciona de la manera esperada cuando está
// programado como "normalmente" estando dentro del persist

// Un estado puede contar tanto con los "items(bools, objs,..)" de estado,
// como con las funciones que modifican el estado con otra interfaz.
export const useBearStore = create<BearState>()(
  
  persist(
  (set, get) => ({
  blackBears: 10,
  polarBears: 5,
  pandaBears: 1,

  bears: [{id: 1, name:"Oso #1"}],
  
  // computed: {
  //   // Para hacer el getter vamos a usar una propiedad
  //   // de objetos de javascript (Propiedad computada)
  //   get totalBears():number {
  //     return get().blackBears +
  //     get().polarBears +
  //     get().pandaBears +
  //     get().bears.length;
  //   }
  // },
  
  totalBears: () => {
    return get().blackBears +
    get().polarBears +
    get().pandaBears +
    get().bears.length;
  },
  
  increaseBlackBears: (by: number) => set((state) => ({ blackBears: state.blackBears + by })),
  increasePolarBears: (by: number) => set((state) => ({ polarBears: state.polarBears + by })),
  increasePandaBears: (by: number) => set((state) => ({ pandaBears: state.pandaBears + by })),
  
  doNothing: () => set(state => ({ bears: [...state.bears] })),
  addBear: () => set(state => ({ 
    bears: [...state.bears, 
          {id: state.bears.length + 1, name:`Oso #${state.bears.length+1}`}
    ] 
  })),
  // clearBears: () => set(state => ({ bears: [] })), es lo mismo de abajo
  clearBears: () => set({ bears: [] }),
  
}), 
  {name:'bears-store'}
)

)