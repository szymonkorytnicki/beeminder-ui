import { useState } from 'react'
import { useEffect } from 'react'
import { format } from 'date-fns'
import { useMutation } from 'react-query'

export function RecentDatapoints({ goalSlug, datapoints, onDelete }) {
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

    return (
        <div className="recent-data">
            {datapoints.map((datapoint) => {
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
            })}
        </div>
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
            hidden={isRemoving ? 'hidden' : undefined}
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
            className="recent-data__datapoint"
            style={{
                transform: `translateX(${isTouching ? '20px' : '0px'})`,
                transition: 'transform 100ms linear',
            }}
        >
            <span className="recent-data__datapoint__data">
                {format(new Date(datapoint.measured_at), 'yyyy-MM-dd')}
            </span>{' '}
            {Math.round(datapoint.value * 100) / 100} / {datapoint.comment}
        </div>
    )
}
