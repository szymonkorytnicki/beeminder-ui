import { Link } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
export function UsernameHeaderLink() {
    const { data } = useUser()
    return <Link to="/">{data ? data.username : '...'}</Link>
}
