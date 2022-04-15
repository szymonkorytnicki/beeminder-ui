/* global G2PlotCalendar, G2Plot */
// TODO globals
import { Heatmap, G2 } from '@ant-design/plots'
import { useQuery } from 'react-query'
import { differenceInWeeks, endOfWeek, format } from 'date-fns'
import { P } from '@antv/g2plot'
import { useRef } from 'react'
import { useEffect, useState } from 'react'

function fetchDatapoints(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}/datapoints.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then((r) => r.json())
}

export function CalendarHeatmap({ goalSlug }) {
    const chartEl = useRef(null)
    const { isLoading, data } = useQuery(['datapoints-' + goalSlug], () =>
        fetchDatapoints(goalSlug)
    )

    useEffect(() => {
        if (data && chartEl.current) {
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
            calendarPlot.render()
            chartEl.current.scrollTo(800, 0)
        }
    }, [])

    if (isLoading) {
        return 'Loading'
    }

    return (
        <div
            style={{
                'overflow-x': 'scroll',
                'padding-bottom': '15px',
                'padding-top': '20px',
            }}
            ref={chartEl}
        />
    )
}
