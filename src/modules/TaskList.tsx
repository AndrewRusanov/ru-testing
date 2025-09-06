import { useDispatch, useSelector } from 'react-redux'
import { Empty } from 'src/components/Empty'
import { FilterButton } from 'src/components/FilterButton'
import { List } from 'src/components/List'
import { TaskCounter } from 'src/components/TaskCounter'
import {
  deleteTask,
  filteredTasksSelector,
  toggleTask,
} from 'src/store/taskSlice'

export const TaskList = () => {
  const items = useSelector(filteredTasksSelector)
  const dispatch = useDispatch()

  const handleDelete = (id: Task['id']) => {
    dispatch(deleteTask(id))
  }

  const handleToggle = (id: Task['id']) => {
    dispatch(toggleTask(id))
  }

  return (
    <div className='task-list-container'>
      <div className='task-list-controls'>
        <FilterButton />
        <TaskCounter />
      </div>
      {items.length > 0 ? (
        <List items={items} onDelete={handleDelete} onToggle={handleToggle} />
      ) : (
        <Empty />
      )}
    </div>
  )
}
