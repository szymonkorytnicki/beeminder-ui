import { useParams } from 'react-router'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import './GoalPage.css'
import { PageHeader } from '../Page/PageHeader'
import { RecentDatapoints } from '../RecentDatapoints/RecentDatapoints'
import { CreateDatapoint } from '../CreateDatapoint/CreateDatapoint'

function fetchGoal(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then((r) => r.json())
}

export function GoalPage() {
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

            <div
                className={`goal-tile goal-tile--left goal-tile--${data.roadstatuscolor}`} // TODO extract to styled components / composed components
            >
                <header className="goal-tile__topbar">
                    {data.todayta ? '●' : ''}
                </header>

                <h2 className={`goal-tile__slug goal-tile__slug--big`}>
                    {data.slug}
                </h2>
                <footer className="goal-tile__footer">
                    {data.limsum}
                    <br />
                    total: {Math.round(data.curval * 100) / 100} {data.gunits}{' '}
                    <br />
                </footer>
                <div className="goal-tile__pledge">${data.pledge}</div>
            </div>
            <CreateDatapoint
                goalSlug={data.slug}
                onCreate={() => setTimeout(refetch, 1500)}
            />
            <RecentDatapoints
                goalSlug={data.slug}
                datapoints={data.recent_data}
                onDelete={() => setTimeout(refetch, 1500)} // TODO dummy workaround; instant refetch returns removed datapoint
            />
        </>
    )
}
