import { render, screen } from '@testing-library/react'
import uE from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { App } from 'src/App'
import { store } from 'src/store/configureStore'

describe('Ограничение количества невыполненных задач', () => {
  beforeEach(() => {
    store.dispatch({ type: 'taskList/reset' })
  })

  it('не позволяет добавить больше 10 невыполненных задач', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    const input = screen.getByRole('textbox')
    const addButton = screen.getByRole('button', { name: /добавить/i })

    for (let i = 1; i <= 10; i++) {
      uE.type(input, `Задача ${i}`)
      uE.click(addButton)
    }

    expect(screen.getByText('Задача 1')).toBeInTheDocument()
    expect(screen.getByText('Задача 10')).toBeInTheDocument()

    uE.type(input, 'Задача 11')
    uE.click(addButton)

    expect(screen.queryByText('Задача 11')).not.toBeInTheDocument()

    const tasks = store.getState().taskList.list
    expect(tasks).toHaveLength(10)
    expect(tasks.filter(task => !task.done)).toHaveLength(10)
  })

  it('позволяет добавить больше 10 задач, если некоторые выполнены', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    const input = screen.getByRole('textbox')
    const addButton = screen.getByRole('button', { name: /добавить/i })

    for (let i = 1; i <= 10; i++) {
      uE.type(input, `Задача ${i}`)
      uE.click(addButton)
    }

    const task1Checkbox = screen.getByLabelText('Задача 1')
    const task2Checkbox = screen.getByLabelText('Задача 2')

    uE.click(task1Checkbox)
    uE.click(task2Checkbox)

    uE.type(input, 'Задача 11')
    uE.click(addButton)

    uE.type(input, 'Задача 12')
    uE.click(addButton)

    expect(screen.getByText('Задача 11')).toBeInTheDocument()
    expect(screen.getByText('Задача 12')).toBeInTheDocument()

    const tasks = store.getState().taskList.list
    expect(tasks).toHaveLength(12)
    expect(tasks.filter(task => !task.done)).toHaveLength(10)
  })
})
