import { useQuery } from 'react-query'

function fetchUser() {
    return fetch(`${process.env.REACT_APP_ENDPOINT}/api.php/me`).then((r) =>
        r.json()
    )
}

export function useUser() {
    return useQuery(['user'], fetchUser)
}
