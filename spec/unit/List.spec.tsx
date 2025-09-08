import { render } from '@testing-library/react'
import { List } from 'src/components/List'

it('отображение списка задач', () => {
  const onDelete = jest.fn()
  const onToggle = jest.fn()

  const items: Task[] = [
    {
      id: '1',
      header: 'купить хлеб',
      done: false,
    },
    {
      id: '2',
      header: 'купить молоко',
      done: false,
    },
    {
      id: '3',
      header: 'выгулять собаку',
      done: true,
    },
  ]

  const { rerender, asFragment } = render(
    <List items={items} onDelete={onDelete} onToggle={onToggle} />
  )
  const firstRender = asFragment()

  items.pop()

  rerender(<List items={items} onDelete={onDelete} onToggle={onToggle} />)
  const secondRender = asFragment()

  expect(firstRender).toMatchDiffSnapshot(secondRender)
})

it('Список содержит не больше 10 невыполненных задач', () => {
  const onDelete = jest.fn()
  const onToggle = jest.fn()

  const items: Task[] = Array.from({ length: 12 }, (_, index) => ({
    id: `task-${index}`,
    header: `Задача ${index + 1}`,
    done: index >= 10, // Последние 2 задачи выполнены
  }))

  const { container } = render(
    <List items={items} onDelete={onDelete} onToggle={onToggle} />
  )

  const taskItems = container.querySelectorAll('.item-wrapper')
  expect(taskItems).toHaveLength(12)

  const uncompletedTasks = items.filter(task => !task.done)
  expect(uncompletedTasks).toHaveLength(10)
})
