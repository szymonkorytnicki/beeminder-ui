import { Scatter } from '@ant-design/charts'
import { format } from 'date-fns'
import { useDatapoints } from '../hooks/useDatapoints'

export function ScatterChart({ goalSlug }) {
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

    const config = {
        // TODO format datapoint tooltip
        smooth: true,
        height: 350,
        data: data
            .sort((a, z) => (a.timestamp < z.timestamp ? -1 : 1))
            .reduce((acc, current, index) => {
                acc.push({
                    ...current,
                    total:
                        current.value + (index > 0 ? acc[index - 1].total : 0),
                })
                return acc
            }, []),
        xField: 'timestamp',
        yField: 'total',
        sizeField: 'value',
        size: [2, 15],
        // color: ({ timestamp }) => {
        //     if (new Date(timestamp * 1000).getHours() < 12) {
        //         return 'red'
        //     }
        //     return 'blue'
        // },
        xAxis: {
            label: {
                formatter: (v) => format(new Date(v * 1000), 'yyyy-MM-dd'),
            },
        },
        regressionLine: {
            type: 'loess', // TODO allow to configure and persist - linear, exp, loess, log, poly, pow, quad
        },
    }

    return (
        <div style={{ marginTop: '15px', minHeight: '350px' }}>
            <Scatter {...config} />
        </div>
    )
}
