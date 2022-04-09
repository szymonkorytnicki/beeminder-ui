import { useParams } from 'react-router'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import './GoalPage.css'
import { format } from 'date-fns'
import { PageHeader } from '../Page/PageHeader'
import { getSafebufCopy } from '../utils'
import { Heatmap } from '@ant-design/plots'
import { useState } from 'react'
import { useEffect } from 'react'

function fetchGoal(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then((r) => r.json())
}

export function GoalPage() {
    const { goalSlug } = useParams()
    const { isLoading, isError, data } = useQuery(['goal-' + goalSlug], () =>
        fetchGoal(goalSlug)
    )

    if (isError) {
        return 'Loading error'
    }

    if (isLoading) {
        // TODO render some sweet placeholder
        return (
            <>
                <PageHeader>
                    <Link to="/">
                        {process.env.REACT_APP_BEEMINDER_USERNAME}
                    </Link>{' '}
                    / {goalSlug}
                </PageHeader>
            </>
        )
    }

    const config = {
        data: data.datapoints,
        xField: 'time',
        yField: 'week',
        colorField: 'value',
        legend: true,
        color: '#BAE7FF-#1890FF-#1028ff',
        coordinate: {
            type: 'polar',
            cfg: {
                innerRadius: 0.2,
            },
        },
        heatmapStyle: {
            stroke: '#f5f5f5',
            opacity: 0.8,
        },
        meta: {
            time: {
                type: 'cat',
            },
            value: {
                min: 0,
                max: 1,
            },
        },
        xAxis: {
            line: null,
            grid: null,
            tickLine: null,
            label: {
                offset: 12,
                style: {
                    fill: '#666',
                    fontSize: 12,
                    textBaseline: 'top',
                },
            },
        },
        yAxis: {
            top: true,
            line: null,
            grid: null,
            tickLine: null,
            label: {
                offset: 0,
                style: {
                    fill: '#fff',
                    textAlign: 'center',
                    shadowBlur: 2,
                    shadowColor: 'rgba(0, 0, 0, .45)',
                },
            },
        },
        tooltip: {
            showMarkers: false,
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    }

    // return <Heatmap {...config} />

    return (
        <>
            <PageHeader>
                <Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link> /{' '}
                {goalSlug}
            </PageHeader>

            <div
                className={`goal-tile goal-tile--left goal-tile--${data.roadstatuscolor}`}
            >
                <header className="goal-tile__topbar">
                    {data.todayta ? '●' : ''}
                </header>

                <h2 className={`goal-tile__slug goal-tile__slug--big`}>
                    {data.slug}
                </h2>
                <footer className="goal-tile__footer">
                    {data.limsum}
                    <br />
                    total: {Math.round(data.curval * 100) / 100} {data.gunits}{' '}
                    <br />
                </footer>
                <div className="goal-tile__pledge">${data.pledge}</div>
            </div>
            {/* <div className="goal-page__graph-wrapper">
        <img src={data.graph_url} alt="Graph" className="goal-page__graph"/>
        </div> */}
            <div className="recent-data">
                {data.recent_data.map((datapoint) => {
                    return (
                        <DatapointRow
                            key={datapoint.created_at}
                            onDelete={({ datapoint }) =>
                                alert(
                                    'Sure you wanna delete datapoint ' +
                                        datapoint.created_at
                                )
                            }
                            datapoint={datapoint}
                        />
                    )
                })}
            </div>
        </>
    )
}

function DatapointRow({ datapoint, onDelete }) {
    const [swipeStart, setSwipeStart] = useState(null)
    const [isTouching, setTouching] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setTouching(false)
        }, 1000)
    }, [isTouching])

    return (
        <div
            onTouchStart={(event) => {
                setSwipeStart(event.changedTouches[0].clientX) // TODO changed vs targetTouches
            }}
            onTouchMove={(event) => {
                const clientY = event.changedTouches[0].clientY
                if (swipeStart && swipeStart < clientY) {
                    setTouching(true)
                }
            }}
            onTouchEnd={(event) => {
                const clientY = event.changedTouches[0].clientY
                if (swipeStart && swipeStart < clientY) {
                    onDelete({ datapoint })
                    setSwipeStart(null)
                    setTouching(false)
                }
            }}
            className="recent-data__datapoint"
            style={{
                transform: `translateX(${isTouching ? '20px' : '0px'})`,
                transition: 'transform 100ms linear',
            }}
        >
            <span className="recent-data__datapoint__data">
                {format(new Date(datapoint.created_at), 'yyyy-MM-dd')}
            </span>{' '}
            {datapoint.comment}
        </div>
    )
}
