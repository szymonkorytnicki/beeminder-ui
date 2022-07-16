import { lazy, useState, Suspense } from 'react'
import { GoalsWidget } from '../GoalsWidget/GoalsWidget'
import { PageHeader } from '../Page/PageHeader'
import { Link } from 'react-router-dom'
import { Footer, FooterLink } from '../Footer/Footer'
import { useGoals } from '../hooks/useGoals'
import { Tile, TileContent, TileTitle } from '../Tile/Tile'
import { UsernameHeaderLink } from '../UsernameHeaderLink/UsernameHeaderLink'
const CirclePackGoals = lazy(() => import('../CirclePackGoals/CirclePackGoals'))
const FiltersTile = lazy(() => import('../FiltersTile/FiltersTile'))

function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}
export default function HomePage() {
    const [query, setQuery] = useState(null)
    const [filters, setFilters] = useState({
        range: 'ALL',
        hideDone: null,
        tags: [],
    })

    const debounceSetQuery = debounce(setQuery, 300)
    return (
        <>
            <PageHeader>
                <UsernameHeaderLink />
            </PageHeader>
            <HeaderTile />
            <FiltersTile
                onFiltersChange={(filters) => setFilters(filters)}
                filters={filters}
                onQueryChange={debounceSetQuery}
            />
            <GoalsWidget
                range={filters.range}
                hideDone={filters.hideDone}
                query={query}
            />
            <Footer>
                <FooterLink to={'/settings'} component={Link}>
                    Settings
                </FooterLink>
                <FooterLink to={'http://beeminder.com/new'} target="_blank">
                    Add new goal
                </FooterLink>
                <FooterLink to={`/archived`}>See archived goals</FooterLink>
            </Footer>
        </>
    )
}

function HeaderTile({ children }) {
    const { data } = useGoals()

    if (!data) {
        return (
            <Tile style={{ marginBottom: '20px', minHeight: '110px' }}></Tile>
        )
    }

    const chartData = data.reduce(
        (acc, goal) => {
            const scoreData = acc.find(
                ({ name }) => name === goal.roadstatuscolor
            )
            scoreData.value += 1
            scoreData.goals.push(goal.slug)
            return acc
        },
        [
            { name: 'red', value: 0, goals: [] },
            { name: 'orange', value: 0, goals: [] },
            { name: 'blue', value: 0, goals: [] },
            { name: 'green', value: 0, goals: [] },
        ]
    )

    const config = {
        data: {
            name: 'transparent',
            children: chartData,
        },
        autoFit: true,
        label: false,
        color: (p) => p.name,
        theme: {
            backgroundColor: 'transparent',
            styleSheet: {},
        },
        legend: false,
        height: 80,
        width: 80,
    }

    const redGoals = chartData.find(({ name }) => name === 'red').goals
    const orangeGoals = chartData.find(({ name }) => name === 'orange').goals

    return (
        <Tile style={{ marginBottom: '20px', minHeight: '110px' }}>
            <div
                style={{
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <TileTitle>
                        Hey <UsernameHeaderLink />
                    </TileTitle>
                    <TileContent>
                        {redGoals.length > 0 ? (
                            <span>
                                You have to complete{' '}
                                {redGoals.map((slug) => (
                                    <GoalLink key={slug} to={'/g/' + slug}>
                                        {slug}
                                    </GoalLink>
                                ))}
                                today!
                            </span>
                        ) : (
                            <span>You are all safe today!</span>
                        )}
                        <br />
                        {orangeGoals.length > 0 && (
                            <span>
                                Tomorrow,{' '}
                                {orangeGoals.map((slug) => (
                                    <GoalLink key={slug} to={'/g/' + slug}>
                                        {slug}
                                    </GoalLink>
                                ))}{' '}
                                {orangeGoals.length === 1 ? 'is' : 'are'} due.
                            </span>
                        )}
                        <UrgencyLoad />
                        {children}
                    </TileContent>
                </div>
                <div>
                    <Suspense>
                        <CirclePackGoals {...config} />
                    </Suspense>
                    {/* TODO probably lazy loading this could speed up homepage a lot (antd) */}
                </div>
            </div>
        </Tile>
    )
}

function GoalLink(props) {
    return (
        <Link
            style={{
                backgroundColor: 'rgba(0,0,0,.05)',
                borderRadius: '1px',
                padding: '0.5px',
                display: 'inline-block',
                marginRight: '2px',
            }}
            {...props}
        />
    )
}

function UrgencyLoad() {
    const { data } = useGoals()
    if (!data) {
        return null
    }
    const load = data.reduce((acc, goal) => {
        if (!goal.won) {
            acc += Math.max(7 - goal.safebuf, 0)
        }
        return acc
    }, 0)
    return (
        <div>
            Your{' '}
            <a
                href="https://forum.beeminder.com/t/urgency-load-metric/5648"
                target="_blank"
            >
                urgency load
            </a>{' '}
            is {load}.
        </div>
    )
}
