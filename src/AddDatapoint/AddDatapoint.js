import { useEffect } from 'react'
import { useGoals } from '../hooks/useGoals'
import { Tile } from '../Tile/Tile'
export function AddDatapoint() {
    const { data } = useGoals()
    const [goal, setGoal] = useState(null)
    useEffect(() => {}, [goal])

    return (
        <Tile>
            <select name="AddDatapoint__goals" id="AddDatapoint__goals">
                {data
                    .filter(({ autodata }) => !autodata)
                    // .filter(({ secret }) => !autodata) TODO filter if hide private goals
                    .map(({ slug }) => (
                        <option key={slug} value={slug}>
                            {slug}
                        </option>
                    ))}
            </select>
        </Tile>
    )
}
