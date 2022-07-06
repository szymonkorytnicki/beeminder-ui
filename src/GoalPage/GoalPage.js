import { useState } from 'react'
import { useParams } from 'react-router'
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
import { LongestStreak } from '../Streak/LongestStreak'
import { UsernameHeaderLink } from '../UsernameHeaderLink/UsernameHeaderLink'
import { useUser } from '../hooks/useUser'
import { parse, format } from 'date-fns'

export default function GoalPage() {
    const { goalSlug } = useParams()
    const { refetch, data } = useGoal(goalSlug)

    return (
        <>
            <PageHeader>
                <UsernameHeaderLink /> / {goalSlug}
            </PageHeader>
            <MainTile goalSlug={goalSlug} />
            <CalendarHeatmapTile
                isOdometer={data ? data.odom : false}
                goalSlug={goalSlug}
            />
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
            <DueByTile goalSlug={goalSlug} />
            <Tile>
                <TileTitle>Recent datapoints</TileTitle>
                <RecentDatapoints
                    goalSlug={goalSlug}
                    onDelete={() => setTimeout(refetch, 1500)} // TODO dummy workaround; instant refetch returns results which include removed datapoint
                />
            </Tile>
            <Footer>
                <ManageGoalLink goalSlug={goalSlug} />
            </Footer>
        </>
    )
}

function ManageGoalLink({ goalSlug }) {
    const { data } = useUser()
    return (
        <FooterLink
            to={`http://beeminder.com/${
                data ? data.username : 'oopsie'
            }/${goalSlug}`}
        >
            Manage goal
        </FooterLink>
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
                            ? `has datapoint today`
                            : 'no datapoints today'}
                    </p>
                </TileContent>
            ) : (
                <TileContent>
                    {/* TODO xd */}
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

    if (!data) {
        return null
    }
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
            <TileStat
                label="Longest streak"
                value={
                    <>
                        <LongestStreak goalSlug={goalSlug} /> days
                    </>
                }
            />
            <TileStat
                label="Urgency score"
                value={Math.max(7 - data.safebuf, 0)}
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

function CalendarHeatmapTile({ isOdometer, goalSlug }) {
    return (
        <Tile>
            <TileTitle>Calendar</TileTitle>
            <CalendarHeatmap isOdometer={isOdometer} goalSlug={goalSlug} />
        </Tile>
    )
}

function DueByTile({ goalSlug }) {
    const { data } = useGoal(goalSlug)
    const [displayTotal, setDisplayTotal] = useState(false)
    return data ? (
        <Tile>
            <TileTitle>Amounts due by day</TileTitle>
            <TileContent>
                {Object.keys(data.dueby)
                    .sort()
                    .map((key) => {
                        const {
                            formatted_delta_for_beedroid,
                            formatted_total_for_beedroid,
                        } = data.dueby[key]
                        const formattedDate = format(
                            parse(key, 'yyyyMMdd', new Date()),
                            'yyyy-MM-dd'
                        )

                        return (
                            <TileStat
                                key={key}
                                label={formattedDate}
                                value={
                                    <span
                                        onClick={() =>
                                            setDisplayTotal(!displayTotal)
                                        }
                                    >
                                        {displayTotal
                                            ? formatted_total_for_beedroid
                                            : formatted_delta_for_beedroid}
                                    </span>
                                }
                            />
                        )
                    })}
            </TileContent>
        </Tile>
    ) : null
}
