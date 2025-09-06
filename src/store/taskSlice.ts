import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './configureStore'

export interface taskListState {
  list: Task[]
  notification: string
  filterActive: boolean
}

const initialState: taskListState = {
  list: [],
  notification: '',
  filterActive: false,
}

export const taskListSlice = createSlice({
  name: 'taskList',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task['header']>) => {
      // Проверяем количество невыполненных задач
      const uncompletedCount = state.list.filter(task => !task.done).length

      // Если уже есть 10 невыполненных задач, не добавляем новую
      if (uncompletedCount >= 10) {
        return
      }

      state.list.push({
        id: crypto.randomUUID(),
        header: action.payload,
        done: false,
      })
    },
    completeTask: (state, action: PayloadAction<Task['id']>) => {
      const task = state.list.find(x => x.id === action.payload)

      if (task) {
        task.done = true
      }
    },
    toggleTask: (state, action: PayloadAction<Task['id']>) => {
      const task = state.list.find(x => x.id === action.payload)

      if (task) {
        task.done = !task.done

        if (task.done) {
          state.notification = `Задача "${task.header}" завершена`
        }
      }
    },
    deleteTask: (state, action: PayloadAction<Task['id']>) => {
      state.list = state.list.filter(x => x.id !== action.payload)
    },
    setNotification: (state, action: PayloadAction<Task['header']>) => {
      state.notification = `Задача "${action.payload}" завершена`
    },
    clearNotification: state => {
      state.notification = ''
    },
    toggleFilter: state => {
      state.filterActive = !state.filterActive
    },
    reset: () => initialState,
  },
})

export const {
  addTask,
  completeTask,
  deleteTask,
  toggleTask,
  clearNotification,
  toggleFilter,
  reset,
} = taskListSlice.actions

export default taskListSlice.reducer

export const tasksSelector = (state: RootState) => state.taskList.list

export const filteredTasksSelector = (state: RootState) => {
  const tasks = state.taskList.list
  const filterActive = state.taskList.filterActive

  if (filterActive) {
    return tasks.filter(task => !task.done)
  }

  return tasks
}

export const filterActiveSelector = (state: RootState) =>
  state.taskList.filterActive

export const activeTasksCountSelector = (state: RootState) =>
  state.taskList.list.filter(task => !task.done).length

export const fullCount = (state: RootState) => state.taskList.list.length

export const completeCount = (state: RootState) =>
  state.taskList.list.filter(x => x.done).length

export const uncompleteCount = (state: RootState) =>
  state.taskList.list.filter(x => !x.done).length

export const getNotification = (state: RootState) => state.taskList.notification
