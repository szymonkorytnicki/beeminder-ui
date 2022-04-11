import './PageHeader.css'
import { useIsFetching } from 'react-query'

export function PageHeader({ children }) {
    const isFetching = useIsFetching()
    return (
        <div className="page-header">
            {children}
            {isFetching ? (
                <div class="page-header__fetching-indicator"></div>
            ) : (
                ''
            )}
        </div>
    )
}
