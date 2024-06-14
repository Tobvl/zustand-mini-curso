import { StateCreator, create } from "zustand"
// aquí se le puede colocar type para que no vaya a importar
// ningún "archivo físico"
import type { Task, TaskStatus } from "../../interfaces"
import { devtools } from "zustand/middleware"

interface TaskState {

  draggingTaskId?: string;  
  tasks: Record<string, Task>, // es similar a tasks: {[key:string]: Task}

  getTaskByStatus: (status: TaskStatus) => Task[]

  // crearemos el state para el Drag n' Drop
  setDraggingTaskId: (taskId: string) => void;
  resetDraggingTaskid: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
  
}

const storeApi: StateCreator<TaskState> = (set, get) => ({

  draggingTaskId: undefined,
  
  tasks: {
    'ABC-1': { id: 'ABC-1', title: 'Task 1', status:'open'},
    'ABC-2': { id: 'ABC-2', title: 'Task 2', status:'in-progress'},
    'ABC-3': { id: 'ABC-3', title: 'Task 3', status:'open'},
    'ABC-4': { id: 'ABC-4', title: 'Task 4', status:'open'}
  },


  // creamos un método para obtener los tasks dado su status
  getTaskByStatus: (status: TaskStatus) => {
    const tasks = get().tasks
    return Object.values( tasks ).filter( task => task.status === status);
  },

  // método que actualizará el estado del store con
  // el draggingTaskId correspondiente
  setDraggingTaskId: (taskId: string) => {
    set({ draggingTaskId: taskId})
  },
  resetDraggingTaskid: () => {
    set({ draggingTaskId: undefined})
  },
  
  changeTaskStatus: (taskId: string, status: TaskStatus) => {

    const task = get().tasks[taskId]
    task.status = status
    
    // en este momento debo encontrar la tarea con el taskId especificado
    // y asignarle el status proporcionado
    set( (state) => ({
      tasks: {
        ...state.tasks,
        [taskId] : task,
      }
    }))
  }
  
})

// a los stores se les coloca use al principio ya que se consumen
// como un Hook, según reglas de React debe comenzar con use
// EL DOBLE PARÉNTESIS ES POR USAR TYPESCRIPT, MÁS EN LA DOC DE ZUSTAND
export const useTaskStore = create<TaskState>()(
  devtools(
    storeApi
  )
  
);










