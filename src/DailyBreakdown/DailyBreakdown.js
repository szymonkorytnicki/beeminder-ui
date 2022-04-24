// TODO globals
import { format } from 'date-fns'
import { useDatapoints } from '../hooks/useDatapoints'
import { Column } from '@ant-design/plots'
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export function DailyBreakdown({ goalSlug }) {
    // TODO renders uselessly watching data
    const { isLoading, data } = useDatapoints(goalSlug)

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
        data: DAYS.reduce((acc, current) => {
            const value = {
                day: current,
                value: data
                    .filter((point) => point.value > 0)
                    .filter(
                        (point) =>
                            format(point.timestamp * 1000, 'ccc') == current
                    ).length,
            }
            acc.push(value)
            return acc
        }, []),
        xField: 'day',
        yField: 'value',
        height: 160,
    }

    // TODO generic wrapper for charts
    return (
        <div style={{ marginTop: '15px', height: '160px' }}>
            <Column {...config} />
        </div>
    )
}
