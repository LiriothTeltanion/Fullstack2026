import { toDayKey } from "./dates.js";

export const SELECT_DAY = "planner/selectDay";
export const ADD_TASK = "planner/addTask";
export const EDIT_TASK = "planner/editTask";
export const TOGGLE_TASK = "planner/toggleTask";
export const DELETE_TASK = "planner/deleteTask";

export const selectDay = day => ({ type: SELECT_DAY, payload: day });
export const addTask = (day, text) => ({
  type: ADD_TASK,
  payload: { day, task: { id: crypto.randomUUID(), text, done: false } },
});
export const editTask = (day, id, text) => ({ type: EDIT_TASK, payload: { day, id, text } });
export const toggleTask = (day, id) => ({ type: TOGGLE_TASK, payload: { day, id } });
export const deleteTask = (day, id) => ({ type: DELETE_TASK, payload: { day, id } });

// State shape: { selectedDay: "2026-11-25", tasksByDay: { "2026-11-25": [task, ...] } }
const initialState = { selectedDay: toDayKey(new Date()), tasksByDay: {} };

// Small helper: run `change` on one day's list and return a new tasksByDay object.
function updateDay(tasksByDay, day, change) {
  return { ...tasksByDay, [day]: change(tasksByDay[day] ?? []) };
}

export default function plannerReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_DAY:
      return { ...state, selectedDay: action.payload };
    case ADD_TASK: {
      const { day, task } = action.payload;
      return { ...state, tasksByDay: updateDay(state.tasksByDay, day, tasks => [...tasks, task]) };
    }
    case EDIT_TASK: {
      const { day, id, text } = action.payload;
      return {
        ...state,
        tasksByDay: updateDay(state.tasksByDay, day, tasks =>
          tasks.map(task => (task.id === id ? { ...task, text } : task))
        ),
      };
    }
    case TOGGLE_TASK: {
      const { day, id } = action.payload;
      return {
        ...state,
        tasksByDay: updateDay(state.tasksByDay, day, tasks =>
          tasks.map(task => (task.id === id ? { ...task, done: !task.done } : task))
        ),
      };
    }
    case DELETE_TASK: {
      const { day, id } = action.payload;
      return {
        ...state,
        tasksByDay: updateDay(state.tasksByDay, day, tasks => tasks.filter(task => task.id !== id)),
      };
    }
    default:
      return state;
  }
}

const EMPTY = [];
export const selectSelectedDay = state => state.planner.selectedDay;
export const selectTasksForSelectedDay = state =>
  state.planner.tasksByDay[state.planner.selectedDay] ?? EMPTY;
