import { StateCreator, create } from "zustand";
// para instalar los tipos es CTRL+. en 'uuid'
// +o npm i -D @types:uuid
import { v4 as uuidv4 } from "uuid";
// aquí se le puede colocar type para que no vaya a importar
// ningún "archivo físico"
import type { Task, TaskStatus } from "../../interfaces";

import { devtools, persist } from "zustand/middleware";
// agregamos produce, que nos servirá para generar(producir)
// un nuevo state en nuestra app (por lo general en donde
// se hace el spread de información (...))
// import { produce } from "immer";
import { immer } from "zustand/middleware/immer";
import { firebaseStorage } from "../storages/firebase.storage";

interface TaskState {
  draggingTaskId?: string;
  tasks: Record<string, Task>; // es similar a tasks: {[key:string]: Task}
  totalTasks: () => number;
  getTaskByStatus: (status: TaskStatus) => Task[];

  addTask: (title: string, status: TaskStatus) => void;

  // crearemos el state para el Drag n' Drop
  setDraggingTaskId: (taskId: string) => void;
  resetDraggingTaskid: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;

  
  
}

const storeApi: StateCreator<TaskState, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
  draggingTaskId: undefined,

  tasks: {
    "ABC-1": { id: "ABC-1", title: "Task 1", status: "open" },
    "ABC-2": { id: "ABC-2", title: "Task 2", status: "in-progress" },
    "ABC-3": { id: "ABC-3", title: "Task 3", status: "open" },
    "ABC-4": { id: "ABC-4", title: "Task 4", status: "open" },
  },

  totalTasks: () => {
    return Object.keys(get().tasks).length;
  },
  
  // creamos un método para obtener los tasks dado su status
  getTaskByStatus: (status: TaskStatus) => {
    const tasks = get().tasks;
    return Object.values(tasks).filter((task) => task.status === status);
  },

  // nuevo método para agregar una tarea, con su título y un taskStatus
  addTask: (title: string, status: TaskStatus) => {
    // recordar que title: title, status: status es igual a .. title, status
    const newTask = { id: uuidv4(), title, status };

    //? USANDO MIDDLEWARE DE IMMER
    // El middleware cambia el funcionamiento del set
    // por lo que tendremos un pequeño inconveniente

    // primero, nos ahorramos la tarea de inferir el estado del state
    // si usamos esto, sin el middleware de immer, no va a funcionar
    set( state => {
      // haremos código mutante de las tasks tasks[xxx]
      state.tasks[newTask.id] = newTask;
    })
    
    //? REQUIERE NPM INSTALL IMMER
    // Si no declaramos que state es de tipo TaskState, lo detecta
    // como any, entonces no typescript no detecta el autocompletado
    // set( produce( (state: TaskState) => {
    //   // mutando el state, sin immer no se notificaría el cambio
    //   state.tasks[newTask.id] = newTask

    // }) )

    //? FORMA NATIVA DE ZUSTAND
    // set( state => ({
    //   tasks:{
    //     ...state.tasks,
    //     [newTask.id]: newTask
    //   }
    // }))
  },

  // método que actualizará el estado del store con
  // el draggingTaskId correspondiente
  setDraggingTaskId: (taskId: string) => {
    set({ draggingTaskId: taskId });
  },
  resetDraggingTaskid: () => {
    set({ draggingTaskId: undefined });
  },

  changeTaskStatus: (taskId: string, status: TaskStatus) => {

    // esto da error al ser utilizado con immer ya que
    // en este momento estamos "alterando" un inmutable
    // const task = get().tasks[taskId];
    // task.status = status;

    // esta es otra forma en la que sí funciona, ya que estamos
    // creando un nuevo objeto y ahí sí podemos mutar antes de
    // asignar el nuevo estado
    const task ={ ...get().tasks[taskId] };
    task.status = status;
    set( state => {
      state.tasks[taskId] = {
        ...task
      }
    });

    // en este momento debo encontrar la tarea con el taskId especificado
    // y asignarle el status proporcionado

    //? forma immer middleware
    // set( state => {
    //   // con lo de abajo da error ya que estamos mutando el estado
    //   // y además es un objeto anidado
    //   // state.tasks[taskId] = task;
    //   state.tasks[taskId] = {
    //     ...state.tasks[taskId],
    //     status,
    //   }
    // });
    
    //? forma nativa
    // set((state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [taskId]: task,
    //   },
    // }));
  },

  // utilizaremos este método para combinar los métodos
  // changeTaskStatus y resetDraggingTaskId (usando también draggingTaskId)
  // ésto con el fin de que cuando se dropee una tarea, se resetee el
  // draggingTaskId y así desaparezcan los bordes
  onTaskDrop: (status: TaskStatus) => {
    const taskId = get().draggingTaskId;
    // si no tengo una tarea agarrada, no hace nada
    if (!taskId) return;
    // si agarro una tarea (TypeScript detecta automáticamente
    // que taskId           \/      puede ser string o undefined)
    get().changeTaskStatus(taskId, status);
    get().resetDraggingTaskid();
  },
});

// a los stores se les coloca use al principio ya que se consumen
// como un Hook, según reglas de React debe comenzar con use
// EL DOBLE PARÉNTESIS ES POR USAR TYPESCRIPT, MÁS EN LA DOC DE ZUSTAND
export const useTaskStore = create<TaskState>()(
  devtools(
    persist(
      immer(storeApi)
    ,
    {
      name: "task-storage",
    })
  )
);
