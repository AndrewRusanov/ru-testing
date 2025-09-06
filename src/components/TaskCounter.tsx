import { useSelector } from 'react-redux'
import {
  activeTasksCountSelector,
  filterActiveSelector,
} from 'src/store/taskSlice'

export const TaskCounter = () => {
  const activeTasksCount = useSelector(activeTasksCountSelector)
  const filterActive = useSelector(filterActiveSelector)

  if (!filterActive) {
    return null
  }

  return <div className='task-counter'>Активных задач: {activeTasksCount}</div>
}
