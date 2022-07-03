// TODO globals
import { format } from 'date-fns'
import { useDatapoints } from '../hooks/useDatapoints'
import { Column } from '@ant-design/plots'
import { getAutoEnteredHour, isAutoEntered } from '../utils/autoEntered.ts'
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
                    marginTop: '15px',
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
        }, []),
        xField: 'hour',
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
