import { PageHeader } from '../Page/PageHeader'
import { Tile, TileTitle, TileContent } from '../Tile/Tile'
import css from './SettingsPage.module.css'
import { useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext.ts'
import { UsernameHeaderLink } from '../UsernameHeaderLink/UsernameHeaderLink'

export default function SettingsPage() {
    const { setSettings, ...settings } = useContext(SettingsContext)
    return (
        <>
            <PageHeader>
                <UsernameHeaderLink />
            </PageHeader>
            <div className={css.page}>
                <Tile>
                    <TileTitle>Use split layout</TileTitle>
                    <TileContent>
                        <input
                            type="checkbox"
                            id="settings_twoColumnLayout"
                            value={settings.twoColumnLayout}
                            checked={settings.twoColumnLayout}
                            onChange={() =>
                                setSettings({
                                    ...settings,
                                    twoColumnLayout: !settings.twoColumnLayout,
                                })
                            }
                        />
                        <label htmlFor="settings_twoColumnLayout">
                            Use two column layout
                        </label>
                    </TileContent>
                </Tile>
                <Tile>
                    <TileTitle>Group by tags</TileTitle>
                    <TileContent>
                        <input
                            type="checkbox"
                            id="settings_groupByTags"
                            value={settings.groupByTags}
                            checked={settings.groupByTags}
                            onChange={() =>
                                setSettings({
                                    ...settings,
                                    groupByTags: !settings.groupByTags,
                                })
                            }
                        />
                        <label htmlFor="settings_groupByTags">
                            Use tags to group my goals
                        </label>
                    </TileContent>
                </Tile>
                <Tile>
                    <TileTitle>Goals visibility</TileTitle>
                    <TileContent>
                        <input
                            type="checkbox"
                            id="settings_showHiddenGoals"
                            value={settings.showHiddenGoals}
                            checked={settings.showHiddenGoals}
                            onChange={() =>
                                setSettings({
                                    ...settings,
                                    showHiddenGoals: !settings.showHiddenGoals,
                                })
                            }
                        />
                        <label htmlFor="settings_showHiddenGoals">
                            Show hidden goals
                        </label>
                    </TileContent>
                </Tile>
                <Tile>
                    <TileTitle>Manage tags</TileTitle>
                    <TileContent>
                        Organize your goals with tags using{' '}
                        <a href="http://beeminder.com/tags">
                            this Beeminder page
                        </a>
                        .
                    </TileContent>
                </Tile>
                <Tile>
                    <TileTitle>Manage goals</TileTitle>
                    <TileContent>
                        You can add, adjust or delete your goals using{' '}
                        <a href="http://beeminder.com">Beeminder</a>.
                    </TileContent>
                </Tile>
                <Tile>
                    <TileTitle>App limits</TileTitle>
                    <TileContent>
                        Currently we fetch only 250 recent datapoints to make
                        sure performance remains stable.
                    </TileContent>
                </Tile>
                <Tile>
                    <TileTitle>Feedback and errors</TileTitle>
                    <TileContent>
                        Please report errors on{' '}
                        <a href="https://github.com/szymonkorytnicki/beeminder-ui/issues/new">
                            Github Issues
                        </a>{' '}
                        page or{' '}
                        <a href="https://forum.beeminder.com/">
                            Beeminder Forum
                        </a>
                        .
                    </TileContent>
                </Tile>
            </div>
        </>
    )
}
