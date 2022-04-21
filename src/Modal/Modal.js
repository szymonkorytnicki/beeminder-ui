import css from './Modal.module.css'
import classNames from 'classnames'

export function Modal({ className, onClose, ...props }) {
    // TODO add typings
    return (
        <div className={css.overlay} onClick={onClose}>
            <button onClick={onClose}>X</button>
            <div {...props} className={classNames(css.modal, className)} />
        </div>
    )
}

export function ModalTitle({ className, ...props }) {
    return <h1 {...props} className={classNames(css.title, className)} />
}
