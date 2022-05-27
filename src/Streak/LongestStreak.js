import { useDatapoints } from '../hooks/useDatapoints'
import { differenceInCalendarDays } from 'date-fns'
export function LongestStreak({ goalSlug }) {
    const { isLoading, data } = useDatapoints(goalSlug)

    if (isLoading) {
        return 'Loading...'
    }

    const streaks = [0]
    const datapoints = data
        .filter((point) => point.value > 0)
        .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))

    let currentStreak = 0

    for (let i = 1; i < datapoints.length; i++) {
        const difference = differenceInCalendarDays(
            datapoints[i - 1].timestamp * 1000,
            datapoints[i].timestamp * 1000
        )
        if (difference <= 1) {
            if (difference === 1) {
                currentStreak = currentStreak + 1
            }
        } else {
            console.log(
                new Date(datapoints[i - 1].timestamp * 1000),
                new Date(datapoints[i].timestamp * 1000)
            )
            streaks.push(currentStreak + 1)
            currentStreak = 0
        }
    }
    const longestStreak = Math.max.apply(null, streaks)
    return longestStreak >= 250 ? ' over 250 ' : longestStreak
}
