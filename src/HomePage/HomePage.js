import { GoalsWidget } from "../GoalsWidget/GoalsWidget"
import { Link } from "react-router-dom"
export function HomePage() {
    return <>
        <h1><Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link></h1>
        <GoalsWidget />
    </>
}

// TODO create reusable breadcrumbs page title
// TODO create reusable Page layout components, eg footer, header, wrapper etc