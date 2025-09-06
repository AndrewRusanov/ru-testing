import { render, screen } from '@testing-library/react'
import uE from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { App } from 'src/App'
import { store } from 'src/store/configureStore'
import { addTask, toggleTask } from 'src/store/taskSlice'

describe('Список задач', () => {
  beforeAll(() => {
    store.dispatch({ type: 'taskList/reset' })
  })

  //  Как пользователь, я хочу нажать на кнопку фильтрации, чтобы скрыть выполненные задачи
  it('с включенным фильтром - не содержит выполненные задачи', () => {
    store.dispatch(addTask('Купить хлеб'))
    store.dispatch(addTask('Купить молоко'))
    store.dispatch(addTask('Выгулять собаку'))

    const tasks = store.getState().taskList.list
    const taskToComplete = tasks.find(task => task.header === 'Купить хлеб')

    if (taskToComplete) {
      store.dispatch(toggleTask(taskToComplete.id))
    }

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    expect(screen.getByText('Купить хлеб')).not.toBeInTheDocument()
    expect(screen.getByText('Купить молоко')).toBeInTheDocument()
    expect(screen.getByText('Выгулять собаку')).toBeInTheDocument()
  })

  //  Как пользователь, я хочу повторно нажать на кнопку фильтрации, чтобы показать все задачи
  it('с выключенным фильтром - показывает все задачи', () => {
    store.dispatch(addTask('Купить хлеб'))
    store.dispatch(addTask('Купить молоко'))
    store.dispatch(addTask('Выгулять собаку'))

    const tasks = store.getState().taskList.list
    const taskToComplete = tasks.find(task => task.header === 'Купить хлеб')

    if (taskToComplete) {
      store.dispatch(toggleTask(taskToComplete.id))
    }

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    const filterButton = screen.getByRole('button', { name: /фильтр/i })

    uE.click(filterButton)

    expect(screen.queryByText('Купить хлеб')).not.toBeInTheDocument()

    uE.click(filterButton)

    expect(screen.getByText('Купить хлеб')).toBeInTheDocument()
    expect(screen.getByText('Купить молоко')).toBeInTheDocument()
    expect(screen.getByText('Выгулять собаку')).toBeInTheDocument()
  })

  //  Как пользователь, я хочу видеть счётчик активных задач при включенном фильтре
  it('показывает счётчик активных задач при включенном фильтре', () => {
    store.dispatch(addTask('Купить хлеб'))
    store.dispatch(addTask('Купить молоко'))
    store.dispatch(addTask('Выгулять собаку'))

    const tasks = store.getState().taskList.list
    const task1 = tasks.find(task => task.header === 'Купить хлеб')
    const task2 = tasks.find(task => task.header === 'Купить молоко')

    if (task1) store.dispatch(toggleTask(task1.id))
    if (task2) store.dispatch(toggleTask(task2.id))

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    const filterButton = screen.getByRole('button', { name: /фильтр/i })

    uE.click(filterButton)

    expect(screen.getByText(/активных задач: 1/i)).toBeInTheDocument()
    expect(screen.getByText('Выгулять собаку')).toBeInTheDocument()
  })
})
