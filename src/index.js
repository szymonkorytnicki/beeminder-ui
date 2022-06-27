import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import { QueryClient, QueryClientProvider } from 'react-query'
import { persistQueryClient } from 'react-query/persistQueryClient'
import { createWebStoragePersister } from 'react-query/createWebStoragePersister'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

const localStoragePersister = createWebStoragePersister({
    storage: window.localStorage,
})

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: process.env.NODE_ENV === 'production',
            refetchOnWindowFocus: false,
            queries: {
                cacheTime: 1000 * 60 * 60 * 24 * 3, // 3 days
            },
            // queryFn: ({ queryKey }) => {
            //     return fetch(queryKey[0]).then((response) => response.json()) // TODO build robust logic&dictionaries for APIs
            // },
        },
    },
})

persistQueryClient({
    queryClient,
    persister: localStoragePersister,
})

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
})

const FallbackComponent = (
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

createRoot(document.getElementById('root')).render(
    <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </Sentry.ErrorBoundary>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
