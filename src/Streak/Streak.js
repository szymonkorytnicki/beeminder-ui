import { useDatapoints } from '../hooks/useDatapoints'
import { differenceInCalendarDays, isToday } from 'date-fns'
export function Streak({ goalSlug }) {
    const { isLoading, data } = useDatapoints(goalSlug)

    if (isLoading) {
        return 'Loading...'
    }

    const datapoints = data
        .filter((point) => point.value > 0)
        .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))

    let currentStreak = 0

    if (!isToday(datapoints[0].timestamp*1000)) {
        return currentStreak;
    }

    for (let i = 1; i < datapoints.length; i++) {
        const difference = differenceInCalendarDays(
            datapoints[i - 1].timestamp * 1000,
            datapoints[i].timestamp * 1000
        )
        if (difference <= 1) {
            if (difference === 1) {
                currentStreak += 1
            }
        } else {
            return currentStreak + 1
        }
    }
    return (currentStreak >= 250 ? 'over ' : '') + (currentStreak + 1) // TODO magic number
}
