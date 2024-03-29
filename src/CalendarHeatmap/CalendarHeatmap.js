import { format } from 'date-fns'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useDatapoints } from '../hooks/useDatapoints'
import * as G2PlotCalendar from 'g2plot-calendar'
import * as G2Plot from '@antv/g2plot'

export function CalendarHeatmap({ goalSlug, isOdometer }) {
    // TODO renders uselessly watching data
    const chartEl = useRef(null)
    const { isLoading, data } = useDatapoints(goalSlug)
    // TODO isOdometer - compute datapoints value

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
                    color: [
                        '#ebedf0', // TODO more contrast please
                        '#a7c3fc',
                        '#6495f9',
                        '#4f86f5',
                        '#0d5eff',
                    ],
                    tooltip: {
                        customContent: () => '',
                        showMarkers: false,
                    },
                    xAxis: {
                        label: null,
                        title: null,
                    },
                    autoFit: false,
                    data: data
                        .map((point) => ({
                            date: format(point.timestamp * 1000, 'yyyy-MM-dd'),
                            value: point.value, //isOdometer ? 1 : point.value, // TODO fix odometer goals
                        }))
                        .reduce((acc, point) => {
                            const sameDatePoint = acc.find(
                                (p) => p.date === point.date
                            )
                            if (sameDatePoint) {
                                if (isOdometer) {
                                    sameDatePoint.value = Math.max(
                                        sameDatePoint.value,
                                        point.value
                                    )
                                } else {
                                    sameDatePoint.value += point.value
                                }
                                return acc
                            }
                            return [...acc, point]
                        }, [])
                        .map((point, index, arr) => {
                            if (!isOdometer) {
                                return point
                            }
                            const nextPoint = arr[index + 1]
                            const hasItem = Boolean(nextPoint)

                            return {
                                ...point,
                                value: hasItem
                                    ? Math.abs(nextPoint.value - point.value)
                                    : null,
                            }
                        }),
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
