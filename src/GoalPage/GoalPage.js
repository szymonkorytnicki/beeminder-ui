import { useParams } from 'react-router'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import './GoalPage.css'
import { format } from 'date-fns'
import { PageHeader } from '../Page/PageHeader'
import { getSafebufCopy } from '../utils'

const BASE_DATE = new Date()

function fetchGoal(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then((r) => r.json())
}

export function GoalPage() {
    const { goalSlug } = useParams()
    const { isLoading, isError, data } = useQuery(['goal-' + goalSlug], () =>
        fetchGoal(goalSlug)
    )

    if (isError) {
        return 'Loading error'
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

            <div className={`goal-tile goal-tile--${data.roadstatuscolor}`}>
                <header className="goal-tile__topbar">
                    {data.todayta ? '●' : ''}
                </header>

                <h2 className={`goal-tile__slug goal-tile__slug--big`}>
                    {data.slug}
                </h2>
                <footer className="goal-tile__footer">
                    due {getSafebufCopy(data.safebuf)} <br />
                    total: {data.curval} {data.gunits}
                </footer>
            </div>
            {/* <div className="goal-page__graph-wrapper">
        <img src={data.graph_url} alt="Graph" className="goal-page__graph"/>
        </div> */}
            <div className="recent-data">
                {data.recent_data.map((datapoint) => {
                    return (
                        <div
                            className="recent-data__datapoint"
                            key={datapoint.created_at}
                        >
                            <span className="recent-data__datapoint__data">
                                {format(
                                    new Date(datapoint.created_at),
                                    'yyyy-MM-dd'
                                )}
                            </span>{' '}
                            {datapoint.comment}
                        </div>
                    )
                })}
            </div>
        </>
    )
}
