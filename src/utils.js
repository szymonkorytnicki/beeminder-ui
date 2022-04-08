export function getSafebufCopy(num) {
    if (num === 0) {
        return 'today'
    }
    if (num === 1) {
        return 'tomorrow'
    }
    return 'in ' + num + ' days'
}
