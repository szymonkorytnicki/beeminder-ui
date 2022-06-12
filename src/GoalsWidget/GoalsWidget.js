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

function createTags(goals) {
    const tags = new Set()
    goals.forEach((goal) => {
        goal.tags.forEach((tag) => {
            tags.add(tag)
        })
    })
    return Array.from(tags).sort((a, z) => a.localeCompare(z))
}

export function GoalsWidget({ isArchived }) {
    const { isError, data } = useGoals({ isArchived: isArchived })
    const { groupByTags, twoColumnLayout, showHiddenGoals } =
        useContext(SettingsContext)

    if (isError) {
        return 'Loading error'
    }

    if (!data) {
        return ''
    }

    function shouldShowHiddenGoal(goal) {
        if (showHiddenGoals) {
            return true
        }

        return goal.secret === false
    }

    // TODO smooth animation on update https://codesandbox.io/s/reorder-elements-with-slide-transition-and-react-hooks-flip-211f2
    if (groupByTags) {
        const tags = createTags(data)
        return (
            <>
                <div className={twoColumnLayout ? css.goals : undefined}>
                    {data
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
                                {data
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
            {data.filter(shouldShowHiddenGoal).map((goal) => {
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
