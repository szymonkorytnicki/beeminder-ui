export function isAutoEntered(point: { comment: string }): boolean {
    return point.comment.toLocaleLowerCase().includes('auto-entered via')
}

export function getAutoEnteredHour(point: {
    comment: string
}): string | number {
    return point.comment.split(':')[0].slice(-2)
}
