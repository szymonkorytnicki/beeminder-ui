import { useQuery } from 'react-query'
import { useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext.ts'

export function fetchDatapoints(slug, limitDatapoints) {
    return fetch(
        `${process.env.REACT_APP_ENDPOINT}/api.php/datapoints?slug=${slug}&limitDatapoints=${limitDatapoints}`
    ).then((r) => r.json())
}

export function useDatapoints(goalSlug) {
    const { limitDatapoints } = useContext(SettingsContext)
    return useQuery(['datapoints-' + goalSlug], () =>
        // TODO use consistent naming of queries / some dictionary
        fetchDatapoints(goalSlug, limitDatapoints)
    )
}
