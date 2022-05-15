import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router'
import { HomePage } from './HomePage/HomePage'
import { GoalPage } from './GoalPage/GoalPage'
import { SettingsPage } from './SettingsPage/SettingsPage'

import { SettingsContext } from './contexts/SettingsContext.ts'

const DEFAULT_SETTINGS = {
    groupByTags: defaultToTrue('REACT_GROUPBYTAGS'),
    twoColumnLayout: defaultToTrue('REACT_TWOCOLUMNLAYOUT'),
}

function App() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)

    useEffect(() => {
        localStorage.setItem('REACT_TWOCOLUMNLAYOUT', settings.twoColumnLayout)
        localStorage.setItem('REACT_GROUPBYTAGS', settings.groupByTags)
    }, [settings])

    return (
        <div className="App">
            <SettingsContext.Provider value={{ ...settings, setSettings }}>
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

export default App

function defaultToTrue(item) {
    const value = localStorage.getItem(item)
    if (value) {
        return value === 'true'
    }
    return true
}
