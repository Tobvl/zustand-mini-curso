

// ambos se pueden hacer con type, son similares (interface y type)
// solo que el interface puede extenderse un poco más
export interface Task {
  id: string;
  title: string;
  status: string;
}

// se usa type en vez de interface más para crear un tipo
// ya sea un string, un booleano etc...
export type TaskStatus = 'open' | 'in-progress' | 'done'