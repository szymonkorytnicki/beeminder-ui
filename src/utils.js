import { startOfWeek, subWeeks } from 'date-fns'

export function getSafebufCopy(num) {
    if (num === 0) {
        return 'today'
    }
    if (num === 1) {
        return 'tomorrow'
    }
    return 'in ' + num + ' days'
}

// get last X weeks for trends
export function computeRecentWeeks(amount) {
    let weekStarts = []

    const currentWeek = startOfWeek(new Date())

    weekStarts.push(currentWeek)
    for (let i = 0; i < amount - 1; i++) {
        weekStarts.push(subWeeks(weekStarts[i], 1))
    }

    return weekStarts
}
