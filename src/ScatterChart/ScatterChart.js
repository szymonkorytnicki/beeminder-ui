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
        height: 150,
        data: data.sort((a, z) => (a.timestamp < z.timestamp ? -1 : 1)),
        // .reduce((acc, current, index) => {
        //     acc.push({
        //         ...current,
        //         total:
        //             current.value + (index > 0 ? acc[index - 1].total : 0),
        //     })
        //     return acc
        // }, []),
        xField: 'timestamp',
        yField: 'value',
        xAxis: {
            label: {
                formatter: (v) => format(new Date(v * 1000), 'yyyy-MM-dd'),
            },
        },
        regressionLine: {
            type: 'quad', // TODO allow to configure and persist - linear, exp, loess, log, poly, pow, quad
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
