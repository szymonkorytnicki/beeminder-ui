/* global G2PlotCalendar, G2Plot */
// TODO globals
import { useQuery } from 'react-query'
import { format } from 'date-fns'
import { useRef } from 'react'
import { useEffect } from 'react'
import { Area, Scatter, Line, TinyArea } from '@ant-design/charts'

function fetchDatapoints(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}/datapoints.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}&count=250`
        // TODO magic number count
    ).then((r) => r.json())
}

export function CalendarHeatmap({ goalSlug }) {
    // TODO renders uselessly watching data
    const chartEl = useRef(null)
    const { isLoading, data } = useQuery(['datapoints-' + goalSlug], () =>
        // TODO use consistent naming of queries / some dictionary
        fetchDatapoints(goalSlug)
    )

    useEffect(() => {
        if (data && chartEl.current) {
            chartEl.current.innerHTML = ''
            var calendarPlot = new G2Plot.P(
                chartEl.current,
                {},
                G2PlotCalendar.adaptor,
                {
                    ...G2PlotCalendar.defaultOptions,
                    width: 800,
                    height: 120,
                    tooltip: {
                        customContent: () => '',
                        showMarkers: false,
                    },
                    xAxis: {
                        label: null,
                        title: null,
                    },
                    autoFit: false,
                    data: data.map((point) => ({
                        date: format(point.timestamp * 1000, 'yyyy-MM-dd'),
                        value: point.value,
                    })),
                }
            )
            calendarPlot.render() // TODO update when datapoints updated
            chartEl.current.scrollTo(800, 0)
        }
    }, [data])

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '140px', // TODO
                }}
            />
        )
    }

    const config = {
        smooth: true,
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
            type: 'loess', // linear, exp, loess, log, poly, pow, quad
        },
    }

    // TODO split scatter and heatmap
    // TODO lazy load / lazy render them
    return (
        <>
            <br />
            <Scatter {...config} />
            <div
                style={{
                    minHeight: '140px',
                    overflowX: 'scroll',
                    paddingTop: '20px',
                }}
                ref={chartEl}
            />
        </>
    )
}
