import './App.css'
import { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from './HomePage/HomePage'
import { GoalPage } from './GoalPage/GoalPage'
import { SettingsPage } from './SettingsPage/SettingsPage'

import { SettingsContext } from './contexts/SettingsContext.ts'
import { usePageView } from './hooks/usePageView'

const DEFAULT_SETTINGS = {
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
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/g/:goalSlug" element={<GoalPage />} />
                    <Route path="/goal/:goalSlug" element={<GoalPage />} />
                </Routes>
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
