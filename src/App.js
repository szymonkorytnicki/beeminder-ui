import './App.css'
import { useState, useEffect, lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SettingsContext } from './contexts/SettingsContext.ts'
import { usePageView } from './hooks/usePageView'

const HomePage = lazy(() => import('./HomePage/HomePage'))
const GoalPage = lazy(() => import('./GoalPage/GoalPage'))
const SettingsPage = lazy(() => import('./SettingsPage/SettingsPage'))

const DEFAULT_SETTINGS = {
    // TODO export this to file
    groupByTags: defaultToTrue('REACT_GROUPBYTAGS'),
    twoColumnLayout: defaultToTrue('REACT_TWOCOLUMNLAYOUT'),
    showHiddenGoals: defaultToFalse('REACT_SHOWHIDDENGOALS'),
}

function App() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    useEffect(() => {
        localStorage.setItem('REACT_TWOCOLUMNLAYOUT', settings.twoColumnLayout)
        localStorage.setItem('REACT_GROUPBYTAGS', settings.groupByTags)
        localStorage.setItem('REACT_SHOWHIDDENGOALS', settings.showHiddenGoals)
    }, [settings])
    usePageView()
    return (
        <div className="App">
            <SettingsContext.Provider value={{ ...settings, setSettings }}>
                <ScrollToTop />
                <Suspense>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/g/:goalSlug" element={<GoalPage />} />
                    </Routes>
                </Suspense>
            </SettingsContext.Provider>
        </div>
    )
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
