import { TileTitle, Tile, TileContent } from '../Tile/Tile'
import { UsernameHeaderLink } from '../UsernameHeaderLink/UsernameHeaderLink'
import { PageHeader } from '../Page/PageHeader'
import { Table } from 'antd'
import { useGoals } from '../hooks/useGoals'
import { Pie } from '@ant-design/charts'

export default function UrgencyLoadPage() {
    const { data } = useGoals()
    if (!data) {
        return (
            <>
                <PageHeader>
                    <UsernameHeaderLink />
                </PageHeader>
                <Tile>
                    <TileTitle>Your urgency load is ...</TileTitle>
                </Tile>
            </>
        )
    }
    const breakdown = data
        .reduce((acc, goal) => {
            if (!goal.won) {
                acc.push({
                    goal: goal.slug,
                    load: Math.max(7 - goal.safebuf, 0),
                })
            }
            return acc
        }, [])
        .filter(({ load }) => load > 0)
        .sort((a, b) => (a.load - b.load > 0 ? -1 : 1))

    const urgencyLoad = breakdown.reduce((acc, goal) => {
        return acc + goal.load
    }, 0)

    const config = {
        appendPadding: 10,
        data: breakdown,
        angleField: 'load',
        colorField: 'goal',
        radius: 0.75,
        legend: false,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{percentage}',
        },
    }

    const columns = [
        {
            title: 'Goal',
            dataIndex: 'goal',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Load',
            dataIndex: 'load',
            render: (text) => <span>{text}</span>,
        },
    ]

    return (
        <>
            <PageHeader>
                <UsernameHeaderLink />
            </PageHeader>
            <Tile>
                <TileTitle>Your urgency load is {urgencyLoad}</TileTitle>
                <TileContent>
                    <Pie {...config} />
                    <Table columns={columns} dataSource={breakdown} />
                    <br />
                    <p>Your urgency load is {urgencyLoad}.</p>
                    <p>
                        Each goal's urgency load is a{' '}
                        <code style={{ fontFamily: 'monospace' }}>
                            max((safety buffer) - 7, 0)
                        </code>
                        . In other words, if you have a safety buffer of 5 days,
                        it means that the urgency load of this goal equals 2. If
                        you have 7+ days, this goal has a urgency load of 0.
                    </p>
                </TileContent>
            </Tile>
        </>
    )
}
