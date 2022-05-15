import { createContext } from 'react'

export const SettingsContext = createContext({
    groupByTags: true,
    twoColumnLayout: true,
    setSettings: () => {},
})
