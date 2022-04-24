/* global G2PlotCalendar, G2Plot */
// TODO globals
import { format } from 'date-fns'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useDatapoints } from '../hooks/useDatapoints'

export function CalendarHeatmap({ goalSlug }) {
    // TODO renders uselessly watching data
    const chartEl = useRef(null)
    const { isLoading, data } = useDatapoints(goalSlug)

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
                    minHeight: '160px', // TODO
                }}
            />
        )
    }

    // TODO lazy load / lazy render it
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
