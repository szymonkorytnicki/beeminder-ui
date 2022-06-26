import { GoalsWidget } from '../GoalsWidget/GoalsWidget'
import { PageHeader } from '../Page/PageHeader'
import { Link } from 'react-router-dom'
import { Footer, FooterLink } from '../Footer/Footer'
import { UsernameHeaderLink } from '../UsernameHeaderLink/UsernameHeaderLink'

export default function ArchivedPage() {
    return (
        <>
            <PageHeader>
                <UsernameHeaderLink />
            </PageHeader>
            <GoalsWidget isArchived />
            <Footer>
                <FooterLink to={'/settings'} component={Link}>
                    Settings
                </FooterLink>
                <FooterLink to={'http://beeminder.com/new'} target="_blank">
                    Add new goal
                </FooterLink>
                <FooterLink to={`/`}>See current goals</FooterLink>
            </Footer>
        </>
    )
}
