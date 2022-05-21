import React from 'react'
import { sendAnalyticsEvent } from '../utils/sendAnalyticsEvent'

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        sendAnalyticsEvent('ERROR', { error, errorInfo })
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <>
                    <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Something went wrong.
                    </h1>
                    Please{' '}
                    <a href="https://github.com/szymonkorytnicki/beeminder-ui/issues">
                        report the bug
                    </a>{' '}
                    providing as much description as possible. Thanks!
                </>
            )
        }

        return this.props.children
    }
}
