import { sendAnalyticsEvent } from '../utils/sendAnalyticsEvent'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageView() {
    const location = useLocation()
    useEffect(() => {
        sendAnalyticsEvent('PAGEVIEW', {
            page: anonymizePathname(location.pathname),
        })
    }, [location])
}

function anonymizePathname(pathname) {
    if (pathname.includes('/g/')) {
        pathname = '/g/*'
    }
    return pathname
}
