import css from './GoalsWidget.module.css'
import { Link } from 'react-router-dom'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import {
    TileHeader,
    TileContent,
    Tile,
    TileTitle,
    TileTitleDescription,
} from '../Tile/Tile'
import { useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext.ts'
import { useGoals } from '../hooks/useGoals'
import { parse } from 'date-fns'

function createTags(goals) {
    const tags = new Set()
    goals.forEach((goal) => {
        goal.tags.forEach((tag) => {
            tags.add(tag)
        })
    })
    return Array.from(tags).sort((a, z) => a.localeCompare(z))
}

export function GoalsWidget({ isArchived, range, query, hideDone }) {
    // TODO this is GoalsPage
    const { isError, data } = useGoals({ isArchived: isArchived })
    const { groupByTags, twoColumnLayout, showHiddenGoals } =
        useContext(SettingsContext)

    if (isError) {
        return 'Loading error'
    }

    if (!data) {
        return <div style={{ minHeight: '500px' }}></div>
    }

    function shouldShowHiddenGoal(goal) {
        if (showHiddenGoals) {
            return true
        }

        return goal.secret === false
    }

    const filteredGoals = filterGoals(data, {
        range,
        query,
        hideDone,
    })

    // TODO smooth animation on update https://codesandbox.io/s/reorder-elements-with-slide-transition-and-react-hooks-flip-211f2
    if (groupByTags) {
        const tags = createTags(filteredGoals)
        return (
            <>
                <div className={twoColumnLayout ? css.goals : undefined}>
                    {filteredGoals
                        .filter((goal) => goal.tags.length === 0)
                        .filter(shouldShowHiddenGoal)
                        .map((goal) => {
                            return (
                                <GoalTile
                                    key={goal.slug}
                                    {...goal}
                                    split={twoColumnLayout}
                                />
                            )
                        })}
                </div>
                {tags.map((tag) => {
                    return (
                        <div key={tag}>
                            <header className={css.tag}>{tag}</header>
                            <div
                                className={
                                    twoColumnLayout ? css.goals : undefined
                                }
                            >
                                {filteredGoals
                                    .filter((goal) => goal.tags.includes(tag))
                                    .filter(shouldShowHiddenGoal)
                                    .map((goal) => {
                                        return (
                                            <GoalTile
                                                key={goal.slug}
                                                {...goal}
                                                split={twoColumnLayout}
                                            />
                                        )
                                    })}
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }

    return (
        <div className={twoColumnLayout ? css.goals : undefined}>
            {filteredGoals.filter(shouldShowHiddenGoal).map((goal) => {
                return (
                    <GoalTile
                        key={goal.slug}
                        {...goal}
                        split={twoColumnLayout}
                    />
                )
            })}
        </div>
    )
}

function filterGoals(goals, { query, range, hideDone }) {
    return goals
        .filter((goal) => {
            if (hideDone) {
                return goal.todayta === false
            }
            return true
        })
        .filter((goal) => {
            if (!query) {
                return goal
            }
            return goal.slug.toLowerCase().includes(query.toLowerCase())
        })
        .filter((goal) => {
            if (!range || range === 'ALL') {
                return goal
            }
            if (range === 'MAGIC') {
                console.log(goal)
                return (
                    goal.safebuf <= 1 ||
                    goal.recent_data.reduce((acc, current) => {
                        // recently has been on fire (logging often)
                        if (
                            new Date(current.created_at).getTime() -
                                Date.now() >
                            -(1000 * 60 * 60 * 24 * 3)
                        ) {
                            return acc + 1
                        }
                        return acc
                    }, 0) >= (goal.odom ? 2 : 3)
                )
            }

            return goal.safebuf < parseInt(range)
        })
}

function GoalTile({
    slug,
    split,
    roadstatuscolor,
    pledge,
    title,
    limsum,
    todayta,
}) {
    return (
        <Tile
            split={split}
            component={Link}
            to={'/g/' + slug}
            color={roadstatuscolor}
        >
            <TileTitle colored>
                {slug} <TileTitleDescription>{title}</TileTitleDescription>
            </TileTitle>
            <TileHeader>
                {todayta ? (
                    <AiOutlineCheckCircle
                        style={{ transform: 'translate(0,1.5px)' }}
                    />
                ) : (
                    ''
                )}{' '}
                ${pledge}
            </TileHeader>
            <TileContent>{limsum}</TileContent>
        </Tile>
    )
}
