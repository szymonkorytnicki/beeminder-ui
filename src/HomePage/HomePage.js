import { GoalsWidget } from '../GoalsWidget/GoalsWidget'
import { PageHeader } from '../Page/PageHeader'
import { Link } from 'react-router-dom'
import { Footer, FooterLink } from '../Footer/Footer'

export function HomePage() {
    return (
        <>
            <PageHeader>
                <Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link>
            </PageHeader>
            <GoalsWidget />
            <Footer>
                <FooterLink to={'/settings'} component={Link}>
                    Settings
                </FooterLink>
                <FooterLink to={'http://beeminder.com/new'} target="_blank">
                    Add new goal
                </FooterLink>
                <FooterLink
                    to={`http://beeminder.com/${process.env.REACT_APP_BEEMINDER_USERNAME}/archived`}
                    target="_blank"
                >
                    See archived goals
                </FooterLink>
            </Footer>
        </>
    )
}
