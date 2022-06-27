import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageView() {
    const location = useLocation()
    useEffect(() => {}, [location])
}
