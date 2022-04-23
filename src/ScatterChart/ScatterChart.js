import { Scatter } from '@ant-design/charts'
import { format } from 'date-fns'
import { useQuery } from 'react-query'

function fetchDatapoints(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}/datapoints.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}&count=250`
        // TODO magic number count
    ).then((r) => r.json())
}

export function ScatterChart({ goalSlug }) {
    // TODO renders uselessly watching data
    const { isLoading, data } = useQuery(['datapoints-' + goalSlug], () =>
        // TODO reuse this data?
        // TODO use consistent naming of queries / some dictionary
        fetchDatapoints(goalSlug)
    )

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '350px', // TODO improve
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
        size: [4, 20],
        color: ({ timestamp }) => {
            if (new Date(timestamp * 1000).getHours() < 12) {
                return 'red'
            }
            return 'blue'
        },
        xAxis: {
            label: {
                formatter: (v) => format(new Date(v * 1000), 'yyyy-MM-dd'),
            },
        },
        regressionLine: {
            type: 'loess', // TODO allow to configure and persist - linear, exp, loess, log, poly, pow, quad
        },
    }

    console.log('render', data, isLoading)
    return (
        <div style={{ marginTop: '14px', minHeight: '350px' }}>
            <Scatter {...config} />
        </div>
    )
}
