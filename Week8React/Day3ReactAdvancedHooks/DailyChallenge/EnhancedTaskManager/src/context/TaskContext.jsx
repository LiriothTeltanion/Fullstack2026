import { createContext, useContext, useEffect, useReducer } from "react";

const TaskContext = createContext(null);

const initialState = { tasks: [], filter: "all" };

export function taskReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, { id: Date.now(), text: action.text, completed: false }],
      };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.id ? { ...task, completed: !task.completed } : task
        ),
      };
    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.id ? { ...task, text: action.text } : task
        ),
      };
    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.id) };
    case "CLEAR_COMPLETED":
      return { ...state, tasks: state.tasks.filter(task => !task.completed) };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("enhanced-tasks"));
    return saved ? { ...initialState, tasks: saved } : initialState;
  } catch {
    return initialState;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, null, loadState);

  // Only the tasks are saved; the filter starts at "all" each visit.
  useEffect(() => {
    localStorage.setItem("enhanced-tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  return useContext(TaskContext);
}
