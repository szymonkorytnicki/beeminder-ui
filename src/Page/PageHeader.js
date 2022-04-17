import css from './PageHeader.module.css'
import { useIsFetching } from 'react-query'
import classNames from 'classnames'

export function PageHeader({ children }) {
    const isFetching = useIsFetching()
    return (
        <div className={css.pageHeader}>
            {children}
            <div
                className={classNames(
                    css.loader,
                    isFetching && css.loaderVisible
                )}
            ></div>
        </div>
    )
}
