import { useQuery } from 'react-query'

const URL = `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
const ARCHIVED_URL = `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/archived.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`

function fetchGoals({ isArchived }) {
    return fetch(isArchived ? ARCHIVED_URL : URL).then((r) => r.json())
}
export function useGoals({ isArchived = false } = {}) {
    return useQuery(
        [isArchived ? 'goals-archived' : 'goals'],
        () => fetchGoals({ isArchived }) // TODO doesnt look particularly nice
    )
}
