import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { PageHeader } from '../Page/PageHeader'
import { RecentDatapoints } from '../RecentDatapoints/RecentDatapoints.tsx'
import { Footer, FooterLink } from '../Footer/Footer'
import { CalendarHeatmap } from '../CalendarHeatmap/CalendarHeatmap'
import {
    TilePledge,
    TileTitle,
    Tile,
    TileContent,
    TileStat,
} from '../Tile/Tile'
import { ScatterChart } from '../ScatterChart/ScatterChart'
import { HourlyBreakdown } from '../HourlyBreakdown/HourlyBreakdown'
import { DailyBreakdown } from '../DailyBreakdown/DailyBreakdown'
import { Streak } from '../Streak/Streak'
import { useGoal } from '../hooks/useGoal'
import { WeeklyScatterChart } from '../WeeklyScatterChart/WeeklyScatterChart'

export function GoalPage() {
    // const [showCreateDatapoint, setShowCreateDatapoint] = useState(false)
    // TODO move to tile, not to whole view
    const { goalSlug } = useParams()
    const { refetch } = useGoal(goalSlug)

    return (
        <>
            <PageHeader>
                <Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link> /{' '}
                {goalSlug}
            </PageHeader>
            <MainTile goalSlug={goalSlug} />
            <Tile>
                <TileTitle>Calendar</TileTitle>
                <CalendarHeatmap goalSlug={goalSlug} />
            </Tile>
            <WeeklyTrendsTile goalSlug={goalSlug} />
            <TrendsTile goalSlug={goalSlug} />
            <Tile>
                <TileTitle>Hourly breakdown</TileTitle>
                <HourlyBreakdown goalSlug={goalSlug} />
            </Tile>
            <Tile>
                <TileTitle>Daily breakdown</TileTitle>
                <DailyBreakdown goalSlug={goalSlug} />
            </Tile>
            <MetaTile goalSlug={goalSlug} />
            <Tile>
                <TileTitle>Recent datapoints</TileTitle>
                <RecentDatapoints
                    goalSlug={goalSlug}
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

function MainTile({ goalSlug }) {
    const { data } = useGoal(goalSlug)
    // TODO error -> redirect
    return (
        <Tile color={data ? data.roadstatuscolor : undefined}>
            <TileTitle colored big>
                {goalSlug}
            </TileTitle>
            {data ? (
                <TileContent>
                    <p>{data.limsum}</p>
                    <p>
                        total: {Math.round(data.curval * 100) / 100}{' '}
                        {data.gunits}{' '}
                    </p>
                    <p>
                        {data.todayta
                            ? `has datapoint today (${data.recent_data[0].value})`
                            : 'no datapoints today'}
                    </p>
                </TileContent>
            ) : (
                <TileContent>
                    ...
                    <br />
                    ...
                    <br />
                    ...
                </TileContent>
            )}
            <TilePledge>{data ? `$${data.pledge}` : undefined}</TilePledge>
        </Tile>
    )
}

function TrendsTile({ goalSlug }) {
    const { data } = useGoal(goalSlug)
    return data && data.odom ? null : (
        <Tile>
            <TileTitle>Trend</TileTitle>
            <ScatterChart goalSlug={goalSlug} />
        </Tile>
    )
}

function WeeklyTrendsTile({ goalSlug }) {
    const { data } = useGoal(goalSlug)
    return data && data.odom ? null : (
        <Tile>
            <TileTitle>Week by week</TileTitle>
            <WeeklyScatterChart goalSlug={goalSlug} />
        </Tile>
    )
}

function MetaTile({ goalSlug }) {
    const { data } = useGoal(goalSlug)
    return (
        <Tile>
            <TileTitle>Meta</TileTitle>
            <TileStat
                label="Current streak"
                value={
                    <>
                        <Streak goalSlug={goalSlug} /> days
                    </>
                }
            />
            <TileStat label="No. of datapoints" value={data.numpts} />
            <TileStat
                label="Total value"
                value={data.curval + ' ' + data.gunits}
            />
            <TileStat label="Goal type" value={data.goal_type} />
            <TileStat
                label="Source"
                value={data.autodata ? data.autodata : 'Manual input'}
            />
            <TileStat
                label="Weekends off?"
                value={data.weekends_off ? 'Yes' : 'No'}
            />
            <TileStat
                label="Tags"
                value={
                    data.tags && data.tags.length > 0
                        ? data.tags.join(', ')
                        : 'None'
                }
            />
        </Tile>
    )
}
