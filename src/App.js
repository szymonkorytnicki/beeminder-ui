import './App.css'
import { useState, useEffect, lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SettingsContext } from './contexts/SettingsContext.ts'

const HomePage = lazy(() => import('./HomePage/HomePage'))
const GoalPage = lazy(() => import('./GoalPage/GoalPage'))
const SettingsPage = lazy(() => import('./SettingsPage/SettingsPage'))
const ArchivedPage = lazy(() => import('./ArchivedPage/ArchivedPage'))
const LoginPage = lazy(() => import('./LoginPage/LoginPage'))
const UrgencyLoadPage = lazy(() => import('./UrgencyLoadPage/UrgencyLoadPage'))
const IntegrationsPage = lazy(() =>
    import('./IntegrationsPage/IntegrationsPage')
)

const DEFAULT_SETTINGS = {
    // TODO export this to file
    groupByTags: defaultToFalse('REACT_GROUPBYTAGS'),
    twoColumnLayout: defaultToTrue('REACT_TWOCOLUMNLAYOUT'),
    showHiddenGoals: defaultToTrue('REACT_SHOWHIDDENGOALS'),
    limitDatapoints: defaultToFalse('REACT_LIMITDATAPOINTS'),
}

function App() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    useEffect(() => {
        localStorage.setItem('REACT_TWOCOLUMNLAYOUT', settings.twoColumnLayout)
        localStorage.setItem('REACT_GROUPBYTAGS', settings.groupByTags)
        localStorage.setItem('REACT_SHOWHIDDENGOALS', settings.showHiddenGoals)
        localStorage.setItem('REACT_LIMITDATAPOINTS', settings.limitDatapoints)
    }, [settings])
    // usePageView() TODO reenable if necessary

    return (
        <div className="App">
            <SettingsContext.Provider value={{ ...settings, setSettings }}>
                <ScrollToTop />
                <Suspense>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <LoginRedirect>
                                    <HomePage />
                                </LoginRedirect>
                            }
                        />
                        <Route
                            path="/archived"
                            element={
                                <LoginRedirect>
                                    <ArchivedPage />
                                </LoginRedirect>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <LoginRedirect>
                                    <SettingsPage />
                                </LoginRedirect>
                            }
                        />
                        <Route
                            path="/g/:goalSlug"
                            element={
                                <LoginRedirect>
                                    <GoalPage />
                                </LoginRedirect>
                            }
                        />
                        <Route
                            path="/integrations"
                            element={
                                <LoginRedirect>
                                    <IntegrationsPage />
                                </LoginRedirect>
                            }
                        />
                        <Route
                            path="/urgency-load"
                            element={
                                <LoginRedirect>
                                    <UrgencyLoadPage />
                                </LoginRedirect>
                            }
                        />
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </Suspense>
            </SettingsContext.Provider>
        </div>
    )
}

function LoginRedirect({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [checkedLogin, setLoginChecked] = useState(false)
    useEffect(() => {
        // TODO interval checking the token
        fetch('/api.php/loggedIn')
            .then((r) => r.json())
            .then((r) => {
                setLoginChecked(true)
                setIsLoggedIn(r.loggedIn)
            })
    }, [])

    return checkedLogin ? (
        isLoggedIn ? (
            children
        ) : (
            <Navigate replace to="/login" />
        )
    ) : null
}

function defaultToTrue(item) {
    const value = localStorage.getItem(item)
    if (value) {
        return value === 'true'
    }
    return true
}

function defaultToFalse(item) {
    const value = localStorage.getItem(item)
    if (value) {
        return value === 'true'
    }
    return false
}

function ScrollToTop() {
    const location = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

    return null
}

export default App
