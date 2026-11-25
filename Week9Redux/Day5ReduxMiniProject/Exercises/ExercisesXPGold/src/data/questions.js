export const questions = [
  {
    id: 1,
    text: "Which function creates a Redux Toolkit slice?",
    options: ["createStore", "createSlice", "createReducer", "useSlice"],
    answer: 1,
  },
  {
    id: 2,
    text: "Which hook reads data from the store?",
    options: ["useDispatch", "useState", "useSelector", "useStore"],
    answer: 2,
  },
  {
    id: 3,
    text: "What does a reducer return?",
    options: ["A promise", "The next state", "An action", "Nothing"],
    answer: 1,
  },
  {
    id: 4,
    text: "Which helper writes pending / fulfilled / rejected actions for you?",
    options: ["createAsyncThunk", "createSelector", "combineReducers", "nanoid"],
    answer: 0,
  },
  {
    id: 5,
    text: "Which library lets slice reducers 'mutate' state safely?",
    options: ["Lodash", "Axios", "Immer", "Reselect"],
    answer: 2,
  },
];
