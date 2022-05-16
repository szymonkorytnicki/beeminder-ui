import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary'
import { persistQueryClient } from 'react-query/persistQueryClient'
import { createWebStoragePersister } from 'react-query/createWebStoragePersister'
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

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
