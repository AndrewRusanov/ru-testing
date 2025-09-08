import { render, screen } from '@testing-library/react'
import uE from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { App } from 'src/App'
import { store } from 'src/store/configureStore'

describe('Ограничение количества невыполненных задач', () => {
  beforeEach(() => {
    // Сброс стора перед каждым тестом
    store.dispatch({ type: 'taskList/reset' })

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })

  // Хелпер для быстрого добавления задачи через UI
  const addTask = async (title: string) => {
    const input = screen.getByRole('textbox')
    const addButton = screen.getByRole('button', { name: /добавить/i })

    await uE.clear(input)
    await uE.paste(title) // быстрее чем type
    await uE.click(addButton)
  }

  it('не позволяет добавить больше 10 невыполненных задач', async () => {
    // Добавляем 11 задач
    for (let i = 1; i <= 11; i++) {
      await addTask(`Задача ${i}`)
    }

    // Проверяем состояние стора
    const tasks = store.getState().taskList.list
    const activeTasks = tasks.filter(task => !task.done)
    expect(activeTasks).toHaveLength(10)

    // Проверяем отображение в DOM
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Задача ${i}`)).toBeInTheDocument()
    }
    expect(screen.queryByText('Задача 11')).not.toBeInTheDocument()
  }, 10000) // увеличенный таймаут на случай медленного рендеринга

  it('позволяет добавить больше 10 задач, если некоторые выполнены', async () => {
    // Добавляем 10 задач
    for (let i = 1; i <= 10; i++) {
      await addTask(`Задача ${i}`)
    }

    // Отмечаем 2 задачи как выполненные
    const task1Checkbox = screen.getByLabelText('Задача 1')
    const task2Checkbox = screen.getByLabelText('Задача 2')
    await uE.click(task1Checkbox)
    await uE.click(task2Checkbox)

    // Добавляем ещё 2 задачи
    await addTask('Задача 11')
    await addTask('Задача 12')

    // Проверяем стор
    const allTasks = store.getState().taskList.list
    const activeTasks = allTasks.filter(task => !task.done)
    expect(activeTasks).toHaveLength(10)
    expect(allTasks).toHaveLength(12)

    // Проверяем DOM
    expect(screen.getByText('Задача 11')).toBeInTheDocument()
    expect(screen.getByText('Задача 12')).toBeInTheDocument()
  }, 10000)
})
