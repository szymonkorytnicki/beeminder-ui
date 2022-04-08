import { GoalsWidget } from '../GoalsWidget/GoalsWidget'
import { PageHeader } from '../Page/PageHeader'
import { Link } from 'react-router-dom'
export function HomePage() {
    return (
        <>
            <PageHeader>
                <Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link>
            </PageHeader>
            <GoalsWidget />
        </>
    )
}
