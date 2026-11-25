import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// JSONPlaceholder answers writes but never saves them, so every mutation updates
// the cached list itself (an optimistic update) instead of refetching it.
export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com" }),
  endpoints: builder => ({
    getTodos: builder.query({
      query: () => "/todos?userId=1&_limit=8",
    }),

    addTodo: builder.mutation({
      query: title => ({
        url: "/todos",
        method: "POST",
        body: { title, completed: false, userId: 1 },
      }),
      async onQueryStarted(title, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, draft => {
            draft.unshift({ id: Date.now(), title, completed: false, userId: 1 });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo(); // the server said no, so take the new todo back out
        }
      },
    }),

    toggleTodo: builder.mutation({
      query: ({ id, completed }) => ({ url: `/todos/${id}`, method: "PATCH", body: { completed } }),
      async onQueryStarted({ id, completed }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, draft => {
            const todo = draft.find(item => item.id === id);
            if (todo) todo.completed = completed;
          })
        );
        queryFulfilled.catch(patch.undo);
      },
    }),

    deleteTodo: builder.mutation({
      query: id => ({ url: `/todos/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, draft =>
            draft.filter(item => item.id !== id)
          )
        );
        queryFulfilled.catch(patch.undo);
      },
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useToggleTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
