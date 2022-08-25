// TODO globals
import { format } from 'date-fns'
import { Column } from '@ant-design/plots'
import { useState } from 'react'
import { Tile, TileTitle } from '../Tile/Tile'
import { fetchDatapoints, useDatapoints } from '../hooks/useDatapoints'
import { useGoals } from '../hooks/useGoals'
import { Button, Popover } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function DailyBreakdownTile({ goalSlug }) {
    // TODO renders uselessly watching data
    const { isLoading, data } = useDatapoints(goalSlug)
    const [compareToSlug, setCompareToSlug] = useState(null)
    const [compareToData, setCompareToData] = useState([])
    const { data: goalsList } = useGoals()
    const [visible, setVisible] = useState(false)

    const handleVisibleChange = (newVisible) => {
        setVisible(newVisible)
    }
    if (isLoading) {
        return (
            <div
                style={{
                    marginTop: '15px',
                    minHeight: '160px', // TODO
                }}
            />
        )
    }
    const config = {
        data: [
            ...createData(data, goalSlug),
            ...createData(compareToData, compareToSlug),
        ],
        seriesField: 'slug',
        xField: 'day',
        yField: 'value',
        legend: false,
        isStack: true,
        height: 160,
    }

    // TODO generic wrapper for charts
    return (
        <Tile>
            <TileTitle>
                Daily breakdown{' '}
                <Popover
                    content={
                        <>
                            <select // TODO Select with showSearch or mode="multiple"
                                style={{
                                    padding: '3px',
                                    border: '1px solid #ccc',
                                }}
                                name={'hourly-breakdown-' + goalSlug}
                                id={'hourly-breakdown-' + goalSlug}
                                onChange={(event) => {
                                    const slug = event.target.value
                                    if (slug === '') {
                                        setCompareToData([])
                                        setCompareToSlug(null)
                                        return
                                    }
                                    fetchDatapoints(slug).then((data) => {
                                        setCompareToSlug(slug)
                                        setCompareToData(data)
                                    })
                                }}
                            >
                                <option value="">No comparison</option>
                                <optgroup label="Goals">
                                    {goalsList
                                        .filter(({ slug }) => slug !== goalSlug)
                                        .map((goal) => {
                                            return (
                                                <option
                                                    key={goal.slug}
                                                    value={goal.slug}
                                                >
                                                    {goal.slug}
                                                </option>
                                            )
                                        })}
                                </optgroup>
                            </select>
                        </>
                    }
                    title="Compare with..."
                    trigger="click"
                    visible={visible}
                    onVisibleChange={handleVisibleChange}
                >
                    <Button
                        type="dashed"
                        shape="circle"
                        icon={<SettingOutlined />}
                    />
                </Popover>
            </TileTitle>
            <div style={{ marginTop: '15px', height: '160px' }}>
                <Column {...config} />
            </div>
        </Tile>
    )
}

function createData(data, slug) {
    return DAYS.reduce((acc, current) => {
        const value = {
            slug,
            day: current,
            value: data
                .filter((point) => point.value > 0)
                .filter(
                    (point) => format(point.timestamp * 1000, 'ccc') == current
                ).length,
        }
        acc.push(value)
        return acc
    }, [])
}
