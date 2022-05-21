import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useGoal } from '../hooks/useGoal'
import css from './RecentDatapoints.module.css'
import { Column } from '@ant-design/plots'

const MOCK_DATAPOINTS = [
    {
        id: { $oid: 1 },
        created_at: 0,
        measured_at: 0,
        comment: 'Loading...',
        value: 1,
    },
    {
        id: { $oid: 2 },
        created_at: 1,
        measured_at: 1,
        comment: 'Loading...',
        value: 1,
    },
    {
        id: { $oid: 3 },
        created_at: 2,
        measured_at: 2,
        comment: 'Loading...',
        value: 1,
    },
    {
        id: { $oid: 4 },
        created_at: 3,
        measured_at: 3,
        comment: 'Loading...',
        value: 1,
    },
    {
        id: { $oid: 5 },
        created_at: 4,
        measured_at: 4,
        comment: 'Loading...',
        value: 1,
    },
]

export function RecentDatapoints({ goalSlug, onDelete }) {
    // TODO goal as context
    // TODO naming and extraction to custom hook
    const { mutate } = useMutation((id) =>
        fetch(
            `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${goalSlug}/datapoints/${id}.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`,
            {
                method: 'DELETE',
            }
        )
    )

    const { data } = useGoal(goalSlug)

    return (
        <>
            <div className={css.recentDatapoints}>
                {(data ? data.recent_data : MOCK_DATAPOINTS).map(
                    (datapoint) => {
                        return (
                            <DatapointRow
                                key={datapoint.created_at}
                                onDelete={({ datapoint }) => {
                                    mutate(datapoint.id.$oid, {
                                        onSettled: () => {
                                            onDelete()
                                        },
                                    })
                                }}
                                datapoint={datapoint}
                            />
                        )
                    }
                )}
            </div>
        </>
    )
}

function DatapointRow({ datapoint, onDelete }) {
    const [swipeStart, setSwipeStart] = useState(null)
    const [isTouching, setTouching] = useState(false)
    const [isRemoving, setRemoving] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setTouching(false)
        }, 1000)
    }, [isTouching])

    return (
        <div
            hidden={isRemoving}
            onTouchStart={(event) => {
                setSwipeStart(event.changedTouches[0].clientX) // TODO changed vs targetTouches
            }}
            onTouchMove={(event) => {
                const { clientX } = event.changedTouches[0]
                if (
                    swipeStart &&
                    swipeStart < clientX &&
                    clientX - swipeStart > 20
                ) {
                    setTouching(true)
                }
            }}
            onTouchEnd={(event) => {
                const { clientX } = event.changedTouches[0]
                if (swipeStart && swipeStart < clientX) {
                    setSwipeStart(null)
                    setTouching(false)
                    if (clientX - swipeStart > 20) {
                        if (
                            window.confirm(
                                `Sure you wanna delete datapoint ${
                                    datapoint.comment
                                } with value ${
                                    datapoint.value
                                } created at ${format(
                                    new Date(datapoint.created_at),
                                    'yyyy-MM-dd'
                                )}?`
                            )
                        ) {
                            setRemoving(true)
                            onDelete({ datapoint })
                        }
                    }
                }
            }}
            className={css.row}
            style={{
                transform: `translateX(${isTouching ? '20px' : '0px'})`,
                transition: 'transform 100ms linear',
            }}
        >
            <span>{format(new Date(datapoint.measured_at), 'yyyy-MM-dd')}</span>{' '}
            {Math.round(datapoint.value * 100) / 100} / {datapoint.comment}
        </div>
    )
}
