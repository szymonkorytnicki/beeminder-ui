import { useDatapoints } from '../hooks/useDatapoints'
import { differenceInCalendarDays, format } from 'date-fns'
import { Tile, TileContent, TileTitle } from '../Tile/Tile'
import { Bar } from '@ant-design/charts'
export function LongestStreak({ goalSlug }) {
    const { isLoading, data } = useDatapoints(goalSlug)

    if (isLoading) {
        return (
            <Tile>
                <TileTitle>Longest streaks</TileTitle>
                <TileContent>Analysing...</TileContent>
            </Tile>
        )
    }

    const streaks = []
    const datapoints = data
        .filter((point) => point.value > 0)
        .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))

    let currentStreak = 0
    let isOngoingStreak = true

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
            streaks.push({
                days: currentStreak + 1,
                date: format(datapoints[i - 1].timestamp * 1000, 'yyyy-MM-dd'),
                isOngoingStreak,
            })
            currentStreak = 0
            isOngoingStreak = false
        }
    }
    if (currentStreak > 0) {
        streaks.push({
            days: currentStreak + 1,
            date: format(
                datapoints[datapoints.length - 1].timestamp * 1000,
                'yyyy-MM-dd'
            ),
        })
    }

    const streaksData = streaks.sort((a, b) => b.days - a.days).slice(0, 6)

    let hasEnoughInfo = true
    if (streaksData.length < 2 || streaksData[0].days <= 2) {
        hasEnoughInfo = false
    }

    const config = {
        data: streaksData,
        xField: 'days',
        yField: 'date',
        seriesField: 'date',
        height: 160,
        color: ({ date }) => {
            return streaksData.find((d) => d.date === date).isOngoingStreak
                ? '#ff9800'
                : '#6295f9'
        },
        legend: false,
    }

    return (
        <Tile>
            <TileTitle>Longest streaks</TileTitle>
            {hasEnoughInfo ? (
                <Bar {...config} />
            ) : (
                <TileContent>
                    Not enough info. Keep on going to see your streak data!
                </TileContent>
            )}
        </Tile>
    )
}
