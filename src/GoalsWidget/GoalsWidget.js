import { useQuery } from 'react-query'
import './GoalsWidget.css'
import { Link } from 'react-router-dom'
import { getSafebufCopy } from '../utils'

function fetchGoals() {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then((r) => r.json())
}

export function GoalsWidget() {
    const { isLoading, isError, data } = useQuery(['goals'], () => fetchGoals())

    if (isError) {
        return 'Loading error'
    }

    return (
        <div className="goals">
            {(isLoading ? [] : data.filter((goal) => !goal.secret)).map(
                (goal) => {
                    return <Goal key={goal.slug} {...goal} />
                }
            )}
        </div>
    )
}

function Goal({ slug, roadstatuscolor, curval, safebuf, todayta, gunits }) {
    return (
        <Link
            to={'/g/' + slug}
            className={`goal-tile goal-tile--half goal-tile--${slug} goal-tile--${roadstatuscolor}`}
        >
            <span className="goal-tile__slug goal-tile__slug--center">
                {slug}
            </span>
            <header className="goal-tile__topbar">{todayta ? '●' : ''}</header>
            <footer className="goal-tile__footer goal-tile__footer--center">
                due {getSafebufCopy(safebuf)}{' '}
            </footer>
        </Link>
    )
}
