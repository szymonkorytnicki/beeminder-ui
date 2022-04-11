import './PageHeader.css'
import { useIsFetching } from 'react-query'

export function PageHeader({ children }) {
    const isFetching = useIsFetching()
    return (
        <div className="page-header">
            {children}
            <div
                className={`page-header__fetching-indicator ${
                    isFetching ? 'page-header__fetching-indicator--visible' : ''
                }`}
            ></div>
        </div>
    )
}
