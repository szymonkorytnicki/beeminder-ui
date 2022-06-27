import { useQuery } from 'react-query'

function fetchDatapoints(slug) {
    return fetch(
        `${process.env.REACT_APP_ENDPOINT}/api.php/datapoints?slug=${slug}`
    ).then((r) => r.json())
}

export function useDatapoints(goalSlug) {
    return useQuery(['datapoints-' + goalSlug], () =>
        // TODO use consistent naming of queries / some dictionary
        fetchDatapoints(goalSlug)
    )
}
