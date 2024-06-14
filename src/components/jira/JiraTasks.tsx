import { DragEvent, useState } from "react";
import {IoCheckmarkCircleOutline, IoEllipsisHorizontalOutline,} from "react-icons/io5";
import classNames from "classnames";
import { Task, TaskStatus } from "../../interfaces";
import { SingleTask } from "./SingleTask";
import { useTaskStore } from "../../stores";

interface Props {
  title: string;
  tasks: Task[];
  value: TaskStatus;
}

export const JiraTasks = ({ title, value, tasks }: Props) => {

  // convertimos a booleano si está 
  const isDragging = useTaskStore( state => !!state.draggingTaskId );
  const draggingTaskId = useTaskStore( state => state.draggingTaskId );
  const changeTaskStatus = useTaskStore( state => state.changeTaskStatus );
  const [onDragOver, setOnDragOver] = useState(false);
  
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOnDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOnDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOnDragOver(false);
    // le colocamos el ! para asumir que siempre lo tenemos, teniendo en cuenta
    // que puede ser nulo (not dragging any item)
    changeTaskStatus(draggingTaskId!, value)
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={
        // Aquí le damos las mismas clases de TW al div, pero le colocamos
        // las siguientes cuando isDragging sea True
        classNames("!text-black border-4  relative flex flex-col rounded-[20px]  bg-white bg-clip-border shadow-3xl shadow-shadow-500  w-full !p-4 3xl:p-![18px]", {
          "border-blue-500 border-dotted": isDragging,
          "border-green-500 border-dotted": isDragging && onDragOver,
        })
      }>
      {/* Task Header */}
      <div className="relative flex flex-row justify-between">
        <div className="flex items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100">
            <span className="flex justify-center items-center h-6 w-6 text-brand-500">
              <IoCheckmarkCircleOutline style={{ fontSize: "50px" }} />
            </span>
          </div>

          <h4 className="ml-4 text-xl font-bold text-navy-700">{title}</h4>
        </div>

        <button>
          <IoEllipsisHorizontalOutline />
        </button>
      </div>

      {/* Task Items */}
      <div className="h-full w-full">
        {!tasks.length && (
          <>
            <h1 className="m-6">No hay tareas pendientes!</h1>
          </>
        )}

        {tasks.map((task) => (
          <SingleTask key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
