import { StateCreator, create } from "zustand";
// para instalar los tipos es CTRL+. en 'uuid'
// +o npm i -D @types:uuid
import { v4 as uuidv4 } from 'uuid';
// aquí se le puede colocar type para que no vaya a importar
// ningún "archivo físico"
import type { Task, TaskStatus } from "../../interfaces";
import { devtools } from "zustand/middleware";

interface TaskState {
  draggingTaskId?: string;
  tasks: Record<string, Task>; // es similar a tasks: {[key:string]: Task}

  getTaskByStatus: (status: TaskStatus) => Task[];

  addTask: (title: string, status: TaskStatus) => void;

  // crearemos el state para el Drag n' Drop
  setDraggingTaskId: (taskId: string) => void;
  resetDraggingTaskid: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;
}

const storeApi: StateCreator<TaskState> = (set, get) => ({
  draggingTaskId: undefined,

  tasks: {
    "ABC-1": { id: "ABC-1", title: "Task 1", status: "open" },
    "ABC-2": { id: "ABC-2", title: "Task 2", status: "in-progress" },
    "ABC-3": { id: "ABC-3", title: "Task 3", status: "open" },
    "ABC-4": { id: "ABC-4", title: "Task 4", status: "open" },
  },

  // creamos un método para obtener los tasks dado su status
  getTaskByStatus: (status: TaskStatus) => {
    const tasks = get().tasks;
    return Object.values(tasks).filter((task) => task.status === status);
  },

  // nuevo método para agregar una tarea, con su título y un taskStatus
  addTask: (title: string, status:TaskStatus) => {
    // recordar que title: title, status: status es igual a .. title, status
    const newTask = { id: uuidv4(), title, status }

    set( state => ({
      tasks:{
        ...state.tasks,
        [newTask.id]: newTask
      }  
    }))
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
    const task = get().tasks[taskId];
    task.status = status;

    // en este momento debo encontrar la tarea con el taskId especificado
    // y asignarle el status proporcionado
    set((state) => ({
      tasks: {
        ...state.tasks,
        [taskId]: task,
      },
    }));
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
export const useTaskStore = create<TaskState>()(devtools(storeApi));
