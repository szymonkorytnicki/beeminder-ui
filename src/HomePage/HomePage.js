import { GoalsWidget } from '../GoalsWidget/GoalsWidget'
import { PageHeader } from '../Page/PageHeader'
import { Link } from 'react-router-dom'
import { Footer, FooterLink } from '../Footer/Footer'
import { CirclePacking } from '@ant-design/plots'
import { useGoals } from '../hooks/useGoals'
import { Tile, TileContent, TileTitle } from '../Tile/Tile'

export function HomePage() {
    return (
        <>
            <PageHeader>
                <Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link>
            </PageHeader>
            <HeaderTile />
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

function HeaderTile() {
    const { data } = useGoals()

    if (!data) {
        return null
    }

    const chartData = data.reduce(
        (acc, goal) => {
            const scoreData = acc.find(
                ({ name }) => name === goal.roadstatuscolor
            )
            scoreData.value += 1
            scoreData.goals.push(goal.slug)
            return acc
        },
        [
            { name: 'red', value: 0, goals: [] },
            { name: 'orange', value: 0, goals: [] },
            { name: 'blue', value: 0, goals: [] },
            { name: 'green', value: 0, goals: [] },
        ]
    )

    const config = {
        data: {
            name: 'transparent',
            children: chartData,
        },
        autoFit: true,
        label: false,
        color: (p) => p.name,
        theme: {
            backgroundColor: 'transparent',
            styleSheet: {},
        },
        legend: false,
        height: 80,
        width: 80,
    }

    const redGoals = chartData.find(({ name }) => name === 'red').goals
    const orangeGoals = chartData.find(({ name }) => name === 'orange').goals

    return (
        <Tile style={{ marginBottom: '20px' }}>
            <div
                style={{
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <TileTitle>
                        Hey {process.env.REACT_APP_BEEMINDER_USERNAME}
                    </TileTitle>
                    <TileContent>
                        {redGoals.length > 0 ? (
                            <span>
                                You have to complete{' '}
                                {redGoals.map((slug) => (
                                    <GoalLink key={slug} to={'/g/' + slug}>
                                        {slug}
                                    </GoalLink>
                                ))}
                                today!
                            </span>
                        ) : (
                            <span>You are all safe today!</span>
                        )}
                        <br />
                        {orangeGoals.length > 0 && (
                            <span>
                                Tomorrow,{' '}
                                {orangeGoals.map((slug) => (
                                    <GoalLink key={slug} to={'/g/' + slug}>
                                        {slug}
                                    </GoalLink>
                                ))}{' '}
                                {orangeGoals.length === 1 ? 'is' : 'are'} due.
                            </span>
                        )}
                    </TileContent>
                </div>
                <div>
                    <CirclePacking {...config} />
                </div>
            </div>
        </Tile>
    )
}

function GoalLink(props) {
    return (
        <Link
            style={{
                backgroundColor: 'rgba(0,0,0,.05)',
                borderRadius: '1px',
                padding: '0.5px',
                display: 'inline-block',
                marginRight: '2px',
            }}
            {...props}
        />
    )
}
