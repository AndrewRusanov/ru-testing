import { fireEvent, render, screen } from '@testing-library/react'
import { Item } from 'src/components/Item'

describe('Элемент списка задач', () => {
  const mockOnDelete = jest.fn()
  const mockOnToggle = jest.fn()

  beforeEach(() => {
    mockOnDelete.mockClear()
    mockOnToggle.mockClear()
  })

  it('отображает название задачи', () => {
    const task: Task = {
      id: '1',
      header: 'Купить молоко',
      done: false,
    }

    render(<Item {...task} onDelete={mockOnDelete} onToggle={mockOnToggle} />)

    expect(screen.getByText('Купить молоко')).toBeInTheDocument()
  })

  it('отображает выполненную задачу с зачёркнутым текстом', () => {
    const task: Task = {
      id: '1',
      header: 'Купить молоко',
      done: true,
    }

    render(<Item {...task} onDelete={mockOnDelete} onToggle={mockOnToggle} />)

    const strikethrough = screen.getByText('Купить молоко')
    expect(strikethrough?.tagName).toBe('S')
    expect(strikethrough).toHaveTextContent('Купить молоко')
  })

  it('нельзя удалять невыполненные задачи', () => {
    const task: Task = {
      id: '1',
      header: 'Купить молоко',
      done: false,
    }

    render(<Item {...task} onDelete={mockOnDelete} onToggle={mockOnToggle} />)

    const deleteButton = screen.getByRole('button', { name: /удалить/i })
    expect(deleteButton).toBeDisabled()
  })

  it('можно удалять выполненные задачи', async () => {
    const task: Task = {
      id: '1',
      header: 'Купить молоко',
      done: true,
    }

    render(<Item {...task} onDelete={mockOnDelete} onToggle={mockOnToggle} />)

    const deleteButton = screen.getByRole('button', { name: /удалить/i })
    expect(deleteButton).not.toBeDisabled()

    fireEvent.click(deleteButton)
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('вызывает onToggle при клике на чекбокс', async () => {
    const task: Task = {
      id: '1',
      header: 'Купить молоко',
      done: false,
    }

    render(<Item {...task} onDelete={mockOnDelete} onToggle={mockOnToggle} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(mockOnToggle).toHaveBeenCalledWith('1')
  })

  it('вызывает onToggle при клике на лейбл', async () => {
    const task: Task = {
      id: '1',
      header: 'Купить молоко',
      done: false,
    }

    render(<Item {...task} onDelete={mockOnDelete} onToggle={mockOnToggle} />)

    const label = screen.getByLabelText('Купить молоко')
    fireEvent.click(label)
    expect(mockOnToggle).toHaveBeenCalledWith('1')
  })

  it('отображает длинные названия задач корректно', () => {
    const longTaskName =
      'Очень длинное название задачи которое превышает 32 символа'
    const task: Task = {
      id: '1',
      header: longTaskName,
      done: false,
    }

    render(<Item {...task} onDelete={mockOnDelete} onToggle={mockOnToggle} />)

    expect(screen.getByText(longTaskName)).toBeInTheDocument()
  })

  it('корректно работает с пустым названием задачи', () => {
    const task: Task = {
      id: '1',
      header: '',
      done: false,
    }

    render(<Item {...task} onDelete={mockOnDelete} onToggle={mockOnToggle} />)

    const label = screen.getByLabelText('')
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent('')
  })
})
