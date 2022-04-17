import { FiPlusCircle } from 'react-icons/fi'
import css from './CreateButton.module.css'
export function CreateButton(props) {
    // TODO actual button
    return <FiPlusCircle {...props} className={css.createButton} />
}
