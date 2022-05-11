import { Scatter } from '@ant-design/charts'
import { format } from 'date-fns'
import { useDatapoints } from '../hooks/useDatapoints'
import { computeRecentWeeks } from '../utils'

const WEEKS = computeRecentWeeks(16).map((weekDate) => ({
    week: format(weekDate, 'yyyy-I'),
    date: weekDate,
    value: 0,
}))

export function WeeklyScatterChart({ goalSlug }) {
    // TODO renders uselessly watching data
    const { isLoading, data } = useDatapoints(goalSlug)

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '365px', // TODO improve magic placeholders
                }}
            />
        )
    }

    const dataByWeek = data.map((point) => ({
        ...point,
        week: format(point.timestamp * 1000, 'yyyy-I'),
    }))

    const chartData = WEEKS.map((weekData) => ({
        ...weekData,
        value: dataByWeek.reduce((acc, current) => {
            if (current.week === weekData.week) {
                acc = acc + current.value
            }
            return acc
        }, 0),
    }))

    const config = {
        // TODO format datapoint tooltip
        smooth: true,
        height: 150,
        data: chartData.reverse(),
        xField: 'date',
        yField: 'value',
        xAxis: {
            label: {
                formatter: (v) => {
                    // TODO nice point tooltip
                    return format(parseInt(v, 10), 'yyyy-I') // TODO ISO vs America
                },
            },
        },
        regressionLine: {
            type: 'linear', // TODO allow to configure and persist - linear, exp, loess, log, poly, pow, quad
            style: {
                stroke: '#4f86f5',
                lineWidth: '10',
            },
        },
    }

    return (
        <div style={{ marginTop: '15px', minHeight: '150px' }}>
            <Scatter {...config} />
        </div>
    )
}
