import { useEffect, useState } from 'react'
import { useGoals } from '../hooks/useGoals'
import { Tile, TileTitle } from '../Tile/Tile'
import { useGoal } from '../hooks/useGoal'
export function AddDatapoint() {
    return null // poor mans feature flag
    const { data } = useGoals()
    const [goalSlug, setGoalSlug] = useState(null)
    const [value, setValue] = useState(0)
    const { data: goalData, refetch } = useGoal(goalSlug)
    useEffect(() => {
        if (goalSlug) {
            refetch(goalSlug)
        }
    }, [goalSlug])
    const recentPoints = Array.from(
        new Set(goalData?.recent_data?.map((point) => point.value))
    )
    return (
        <Tile>
            <TileTitle>Add datapoint</TileTitle>
            <select
                name="AddDatapoint__goals"
                id="AddDatapoint__goals"
                value={goalSlug ? goalSlug : undefined}
                onChange={(e) => setGoalSlug(e.currentTarget.value)}
            >
                <option value="">Select goal</option>
                {data
                    .filter(({ autodata }) => !autodata)
                    // .filter(({ secret }) => !autodata) TODO filter if hide private goals
                    .map(({ slug }) => (
                        <option key={slug} value={slug}>
                            {slug}
                        </option>
                    ))}
            </select>
            <input
                type="number"
                value={value}
                placeholder={recentPoints?.[0]}
                onChange={(event) => setValue(event.currentTarget.value)}
            />
            <div>{goalData && <></>}</div>
            {recentPoints.map((point) => (
                <button key={point} onClick={() => setValue(point)}>
                    {point}
                </button>
            ))}
            <button>Submit</button>
        </Tile>
    )
}
