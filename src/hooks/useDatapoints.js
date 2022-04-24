import { useQuery } from 'react-query'

const COUNT = 250

function fetchDatapoints(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}/datapoints.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}&count=${COUNT}`
    ).then((r) => r.json())
}

export function useDatapoints(goalSlug) {
    return useQuery(['datapoints-' + goalSlug], () =>
        // TODO use consistent naming of queries / some dictionary
        fetchDatapoints(goalSlug)
    )
}
