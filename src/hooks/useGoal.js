import { useQuery } from 'react-query'
function fetchGoal(slug) {
    return fetch(
        `${process.env.REACT_APP_ENDPOINT}/api.php/goal?slug=${slug}`
    ).then((r) => r.json())
}

export function useGoal(goalSlug) {
    return useQuery(['goal-' + goalSlug], () =>
        goalSlug ? fetchGoal(goalSlug) : null
    )
}
