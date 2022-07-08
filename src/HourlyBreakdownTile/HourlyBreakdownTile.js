// TODO globals
import { useState } from 'react'
import { Tile, TileTitle } from '../Tile/Tile'
import { format } from 'date-fns'
import { fetchDatapoints, useDatapoints } from '../hooks/useDatapoints'
import { Column } from '@ant-design/plots'
import { getAutoEnteredHour, isAutoEntered } from '../utils/autoEntered.ts'
import { useGoals } from '../hooks/useGoals'
import { Button, Popover } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

const HOURS = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
]
export function HourlyBreakdownTile({ goalSlug }) {
    // TODO renders uselessly watching data
    const { data } = useDatapoints(goalSlug)
    const [compareToSlug, setCompareToSlug] = useState(null)
    const [compareToData, setCompareToData] = useState([])
    const { data: goalsList } = useGoals()
    const [visible, setVisible] = useState(false)

    const hide = () => {
        setVisible(false)
    }

    const handleVisibleChange = (newVisible) => {
        setVisible(newVisible)
    }

    if (!data || !goalsList) {
        return (
            <Tile>
                <TileTitle>Hourly breakdown</TileTitle>
                <div
                    style={{
                        marginTop: '15px',
                        minHeight: '160px', // TODO
                    }}
                />
            </Tile>
        )
    }
    const config = {
        data: [
            ...createData(data, goalSlug),
            ...createData(compareToData, compareToSlug),
        ],
        xField: 'hour',
        yField: 'value',
        seriesField: 'slug',
        isStack: true,
        legend: false,
        height: 160,
    }

    // TODO generic wrapper for charts
    return (
        <Tile>
            <TileTitle>
                Hourly breakdown{' '}
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
            <div style={{ marginTop: '15px', height: '180px' }}>
                <Column {...config} />
            </div>
        </Tile>
    )
}

function createData(data, slug) {
    return HOURS.reduce((acc, current) => {
        const value = {
            slug,
            hour: current,
            value: data
                .filter((point) => point.value > 0)
                .filter((point) => {
                    return isAutoEntered(point)
                        ? getAutoEnteredHour(point) == current // TODO type safety ==
                        : format(
                              Math.min(point.updated_at, point.timestamp) *
                                  1000,
                              'HH'
                          ) == current
                }).length,
        }

        acc.push(value)
        return acc
    }, [])
}
