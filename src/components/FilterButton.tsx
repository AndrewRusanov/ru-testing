import { useDispatch, useSelector } from 'react-redux'
import { filterActiveSelector, toggleFilter } from 'src/store/taskSlice'

export const FilterButton = () => {
  const dispatch = useDispatch()
  const filterActive = useSelector(filterActiveSelector)

  const handleClick = () => {
    dispatch(toggleFilter())
  }

  return (
    <button
      onClick={handleClick}
      className={`filter-button ${filterActive ? 'active' : ''}`}
      aria-label='Фильтр задач'
    >
      {filterActive ? 'Показать все' : 'Фильтр'}
    </button>
  )
}
