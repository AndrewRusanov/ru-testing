import { render, screen, waitFor } from '@testing-library/react'
import uE from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { App } from 'src/App'
import { store } from 'src/store/configureStore'

describe('Оповещение при вополнении задачи', () => {
  beforeEach(() => {
    store.dispatch({ type: 'taskList/reset' })
  })

  it.todo('появляется и содержит заголовок задачи', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    const input = screen.getByRole('textbox')
    const addButton = screen.getByRole('button', { name: /добавить/i })

    uE.type(input, 'Купить молоко')
    uE.click(addButton)

    expect(screen.getByText('Купить молоко')).toBeInTheDocument()

    const taskCheckbox = screen.getAllByLabelText('Купить молоко')

    uE.click(taskCheckbox)

    await waitFor(() => {
      expect(
        screen.getByText('Задача "Купить молоко" завершена')
      ).toBeInTheDocument()
    })

    await waitFor(
      () => {
        expect(
          screen.queryByText('Задача "Купить молоко" завершена')
        ).not.toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it.todo('одновременно может отображаться только одно', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    const input = screen.getByRole('textbox')
    const addButton = screen.getByRole('button', { name: /добавить/i })

    uE.type(input, 'Первая задача')
    uE.click(addButton)

    uE.type(input, 'Вторая задача')
    uE.click(addButton)

    const firstTaskCheckbox = screen.getAllByLabelText('Первая задача')

    uE.click(firstTaskCheckbox)

    await waitFor(() => {
      expect(
        screen.getByText('Задача "Первая задача" завершена')
      ).toBeInTheDocument()
    })

    const secondTaskCheckbox = screen.getByLabelText('Вторая задача')
    uE.click(secondTaskCheckbox)

    // Проверяем, что отображается только последнее оповещение
    await waitFor(() => {
      expect(
        screen.queryByText('Задача "Первая задача" завершена')
      ).not.toBeInTheDocument()
      expect(
        screen.getByText('Задача "Вторая задача" завершена')
      ).toBeInTheDocument()
    })
  })
})
