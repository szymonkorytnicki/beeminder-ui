import { useQuery } from 'react-query'
import css from './GoalsWidget.module.css'
import { Link } from 'react-router-dom'
import { FaCheck } from 'react-icons/fa'
import { TileHeader, TileContent, Tile, TileTitle } from '../Tile/Tile'
import { Footer, FooterLink } from '../Footer/Footer'

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

    // TODO smooth animation https://codesandbox.io/s/reorder-elements-with-slide-transition-and-react-hooks-flip-211f2
    return (
        <div>
            <div className={css.goals}>
                {data
                    .filter((goal) => goal.tags.length === 0)
                    .filter((goal) => goal.secret === false)
                    .map((goal) => {
                        return <GoalTile key={goal.slug} {...goal} />
                    })}
            </div>
            {tags.map((tag) => {
                return (
                    <div key={tag}>
                        <header className={css.tag}>{tag}</header>
                        <div className={css.goals}>
                            {data
                                .filter((goal) => goal.tags.includes(tag))
                                .filter((goal) => goal.secret === false)
                                .map((goal) => {
                                    return (
                                        <GoalTile key={goal.slug} {...goal} />
                                    )
                                })}
                        </div>
                    </div>
                )
            })}
            <Footer>
                <FooterLink to={'http://beeminder.com/new'}>
                    Add new goal
                </FooterLink>
                <FooterLink
                    to={`http://beeminder.com/${process.env.REACT_APP_BEEMINDER_USERNAME}/archived`}
                >
                    See archived goals
                </FooterLink>
            </Footer>
        </div>
    )
}

function GoalTile({ slug, roadstatuscolor, limsum, todayta }) {
    return (
        <Tile
            split
            // center
            component={Link}
            to={'/g/' + slug}
            color={roadstatuscolor}
        >
            <TileTitle>{slug}</TileTitle>
            <TileHeader>{todayta ? <FaCheck /> : ''}</TileHeader>
            <TileContent>{limsum}</TileContent>
        </Tile>
    )
}
