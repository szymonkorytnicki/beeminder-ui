import { useQuery } from 'react-query'

const URL = `${process.env.REACT_APP_ENDPOINT}/api.php/goals`
const ARCHIVED_URL = `${process.env.REACT_APP_ENDPOINT}/api.php/goals?isArchived=true`

function fetchGoals({ isArchived }) {
    return fetch(isArchived ? ARCHIVED_URL : URL).then((r) => r.json())
}
export function useGoals({ isArchived = false } = {}) {
    return useQuery(
        [isArchived ? 'goals-archived' : 'goals'],
        () => fetchGoals({ isArchived }) // TODO doesnt look particularly nice
    )
}
