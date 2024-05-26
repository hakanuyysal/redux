import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/axios';

const initialState = {
  todos: [],
  status: 'idle',
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await apiClient.get('');
  return response.data;
});

export const addTodo = createAsyncThunk('todos/addTodo', async newTodo => {
  const response = await apiClient.post('', newTodo);
  return response.data;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async id => {
  await apiClient.delete(`/${id}`);
  return id;
});

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async updatedTodo => {
    const response = await apiClient.put(`/${updatedTodo.id}`, updatedTodo);
    return response.data;
  },
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload); 
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const updatedTodo = action.payload;
        const existingTodo = state.todos.find(
          todo => todo.id === updatedTodo.id,
        );
        if (existingTodo) {
          existingTodo.title = updatedTodo.title;
          existingTodo.completed = updatedTodo.completed;
        }
      });
  },
});

export default todosSlice.reducer;
