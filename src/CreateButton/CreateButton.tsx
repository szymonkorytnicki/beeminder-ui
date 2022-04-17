import { FiPlusCircle } from 'react-icons/fi'
import css from './CreateButton.module.css'
import classNames from 'classnames'
export function CreateButton({className, ...props}) {
    // TODO actual button
    return <FiPlusCircle {...props} className={classNames(css.createButton, className)} />
}
