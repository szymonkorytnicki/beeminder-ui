import { useQuery } from 'react-query'
import './GoalsWidget.css'
import { Link } from 'react-router-dom'
import { getSafebufCopy } from '../utils'
import { FiCheckCircle } from 'react-icons/fi'

function fetchGoals() {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then((r) => r.json())
}

function createTags(goals) {
    const tags = new Set()
    goals.forEach((goal) => {
        goal.tags.forEach((tag) => {
            tags.add(tag)
        })
    })
    return Array.from(tags).sort((a, z) => a.localeCompare(z))
}

export function GoalsWidget() {
    const { isError, data } = useQuery(['goals'], () => fetchGoals())

    if (isError) {
        return 'Loading error'
    }

    if (!data) {
        return ''
    }

    const tags = createTags(data)

    return (
        <div>
            <div className="goals">
                {data
                    .filter((goal) => goal.tags.length === 0)
                    .map((goal) => {
                        return <Goal key={goal.slug} {...goal} />
                    })}
            </div>
            {tags.map((tag) => {
                return (
                    <div key={tag}>
                        <header className="goals-tag">{tag}</header>
                        <div className="goals">
                            {data
                                .filter((goal) => goal.tags.includes(tag))
                                .map((goal) => {
                                    return <Goal key={goal.slug} {...goal} />
                                })}
                        </div>
                    </div>
                )
            })}
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
            <header className="goal-tile__topbar">
                {todayta ? <FiCheckCircle /> : ''}
            </header>
            <footer className="goal-tile__footer goal-tile__footer--center">
                due {getSafebufCopy(safebuf)}{' '}
            </footer>
        </Link>
    )
}
