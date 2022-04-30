import { useParams } from 'react-router'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { PageHeader } from '../Page/PageHeader'
import { RecentDatapoints } from '../RecentDatapoints/RecentDatapoints.tsx'
import { CreateDatapoint } from '../CreateDatapoint/CreateDatapoint.tsx'
import { useState } from 'react'
import { CreateButton } from '../CreateButton/CreateButton.tsx'
import { Footer, FooterLink } from '../Footer/Footer'
import { CalendarHeatmap } from '../CalendarHeatmap/CalendarHeatmap'
import { TilePledge, TileTitle, Tile, TileContent } from '../Tile/Tile'
import { Modal } from '../Modal/Modal'
import { ScatterChart } from '../ScatterChart/ScatterChart'
import { HourlyBreakdown } from '../HourlyBreakdown/HourlyBreakdown'
import { DailyBreakdown } from '../DailyBreakdown/DailyBreakdown'
import { Streak } from '../Streak/Streak'

function fetchGoal(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then((r) => r.json())
}

export function GoalPage() {
    // TODO move to tile, not to whole view
    const [showCreateDatapoint, setShowCreateDatapoint] = useState(false)
    const { goalSlug } = useParams()
    const { isLoading, isError, data, refetch } = useQuery(
        ['goal-' + goalSlug],
        () => fetchGoal(goalSlug)
    )

    if (isError) {
        return 'Loading error' // TODO app-wide solution
    }

    if (isLoading) {
        // TODO render some sweet placeholder
        return (
            <>
                <PageHeader>
                    <Link to="/">
                        {process.env.REACT_APP_BEEMINDER_USERNAME}
                    </Link>{' '}
                    / {goalSlug}
                </PageHeader>
            </>
        )
    }

    return (
        <>
            <PageHeader>
                <Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link> /{' '}
                {goalSlug}
            </PageHeader>
            {/* <CreateButton onClick={() => setShowCreateDatapoint(true)} /> */}
            <Tile color={data.roadstatuscolor}>
                <TileTitle big>{data.slug}</TileTitle>
                <TileContent>
                    {data.limsum}
                    <br />
                    total: {Math.round(data.curval * 100) / 100} {data.gunits}{' '}
                    <br />
                    {data.todayta
                        ? `has datapoint today (${data.recent_data[0].value})`
                        : 'no datapoints today'}
                </TileContent>
                <TilePledge>${data.pledge}</TilePledge>
            </Tile>
            {showCreateDatapoint && (
                <Modal>
                    <CreateDatapoint
                        goalSlug={goalSlug}
                        onCreate={() => setTimeout(refetch, 1500)}
                    />
                </Modal>
            )}
            <Tile>
                <TileTitle>Calendar</TileTitle>
                <CalendarHeatmap goalSlug={goalSlug} isOdometer={data.odom} />
            </Tile>
            <Tile>
                <TileTitle>Hourly breakdown</TileTitle>
                <HourlyBreakdown goalSlug={goalSlug} />
            </Tile>
            <Tile>
                <TileTitle>Daily breakdown</TileTitle>
                <DailyBreakdown goalSlug={goalSlug} />
            </Tile>
            {!data.odom && (
                <Tile>
                    <TileTitle>Trends</TileTitle>
                    <ScatterChart goalSlug={goalSlug} />
                </Tile>
            )}
            <Tile>
                <TileTitle>
                    Current streak: <Streak goalSlug={goalSlug} /> days
                </TileTitle>
            </Tile>
            <Tile>
                <TileTitle>Recent datapoints</TileTitle>
                <RecentDatapoints
                    goalSlug={goalSlug}
                    datapoints={data.recent_data}
                    onDelete={() => setTimeout(refetch, 1500)} // TODO dummy workaround; instant refetch returns results which include removed datapoint
                />
            </Tile>
            <Footer>
                <FooterLink
                    to={`http://beeminder.com/${process.env.REACT_APP_BEEMINDER_USERNAME}/${goalSlug}`}
                >
                    Manage goal
                </FooterLink>
            </Footer>
        </>
    )
}
