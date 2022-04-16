/* global G2PlotCalendar, G2Plot */
// TODO globals
import { useQuery } from 'react-query'
import { format } from 'date-fns'
import { useRef } from 'react'
import { useEffect } from 'react'

function fetchDatapoints(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}/datapoints.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}&count=250`
        // TODO magic number count
    ).then((r) => r.json())
}

export function CalendarHeatmap({ goalSlug }) {
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
                    minHeight: '140px',
                }}
            />
        )
    }

    return (
        <div
            style={{
                minHeight: '140px',
                overflowX: 'scroll',
                paddingTop: '20px',
            }}
            ref={chartEl}
        />
    )
}
