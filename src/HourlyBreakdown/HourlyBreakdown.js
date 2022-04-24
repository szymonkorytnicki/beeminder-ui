// TODO globals
import { format } from 'date-fns'
import { useDatapoints } from '../hooks/useDatapoints'
import { Column } from '@ant-design/plots'
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
export function HourlyBreakdown({ goalSlug }) {
    // TODO renders uselessly watching data
    const { isLoading, data } = useDatapoints(goalSlug)

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '160px', // TODO
                }}
            />
        )
    }
    const config = {
        data: HOURS.reduce((acc, current) => {
            const value = {
                hour: current,
                value: data
                    .filter((point) => point.value > 0)
                    .filter((point) =>
                        isStrava(point)
                            ? toStravaPoint(point) == current
                            : format(point.timestamp * 1000, 'HH') == current
                    ).length,
            }
            acc.push(value)
            return acc
        }, []),
        xField: 'hour',
        yField: 'value',
        height: 140,
    }

    // TODO generic wrapper for charts
    return (
        <div style={{ marginTop: '15px' }}>
            <Column {...config} />
        </div>
    )
}

function isStrava(point) {
    return point.comment.includes('auto-entered via Strava')
}

function toStravaPoint(point) {
    return point.comment.split(' ').pop().split(':')[0]
}
