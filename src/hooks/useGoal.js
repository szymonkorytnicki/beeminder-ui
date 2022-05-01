import { useQuery } from 'react-query'
function fetchGoal(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then((r) => r.json())
}

export function useGoal(goalSlug) {
    return useQuery(['goal-' + goalSlug], () => fetchGoal(goalSlug))
}
