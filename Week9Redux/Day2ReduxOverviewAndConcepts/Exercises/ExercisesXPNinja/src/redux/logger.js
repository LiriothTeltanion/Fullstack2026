// A middleware sits between dispatch and the reducers: store => next => action.
export const logger = store => next => action => {
  console.group(action.type);
  console.log("before", store.getState());
  const result = next(action); // pass the action on to the reducers
  console.log("after", store.getState());
  console.groupEnd();
  return result;
};
