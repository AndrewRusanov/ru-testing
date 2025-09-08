import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { App } from 'src/App'
import { store } from 'src/store/configureStore'

describe('Оповещение при выполнении задачи', () => {
  beforeEach(() => {
    store.dispatch({ type: 'taskList/reset' })
    jest.useFakeTimers()
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  const addTaskViaUI = async (title: string) => {
    const input = screen.getByRole('textbox')
    const addButton = screen.getByRole('button', { name: /добавить/i })

    await userEvent.clear(input)
    await userEvent.type(input, title)
    await userEvent.click(addButton)

    // Ждём, пока задача появится в DOM
    await waitFor(() => {
      expect(screen.getByLabelText(title)).toBeInTheDocument()
    })
  }

  it('появляется и содержит заголовок задачи', async () => {
    await addTaskViaUI('Купить молоко')

    const taskCheckbox = screen.getByLabelText('Купить молоко')
    await userEvent.click(taskCheckbox)

    expect(
      screen.getByText('Задача "Купить молоко" завершена')
    ).toBeInTheDocument()

    jest.advanceTimersByTime(3000)

    expect(
      screen.queryByText('Задача "Купить молоко" завершена')
    ).not.toBeInTheDocument()
  })

  it('одновременно может отображаться только одно уведомление', async () => {
    await addTaskViaUI('Первая задача')
    await addTaskViaUI('Вторая задача')

    const firstCheckbox = screen.getByLabelText('Первая задача')
    const secondCheckbox = screen.getByLabelText('Вторая задача')

    await userEvent.click(firstCheckbox)
    expect(
      screen.getByText('Задача "Первая задача" завершена')
    ).toBeInTheDocument()

    await userEvent.click(secondCheckbox)
    expect(
      screen.queryByText('Задача "Первая задача" завершена')
    ).not.toBeInTheDocument()
    expect(
      screen.getByText('Задача "Вторая задача" завершена')
    ).toBeInTheDocument()

    jest.advanceTimersByTime(3000)
    expect(
      screen.queryByText('Задача "Вторая задача" завершена')
    ).not.toBeInTheDocument()
  })
})
