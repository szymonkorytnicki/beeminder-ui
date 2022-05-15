import { PageHeader } from '../Page/PageHeader'
import { Link } from 'react-router-dom'
import { Tile, TileTitle, TileContent } from '../Tile/Tile'
import css from './SettingsPage.module.css'
import { useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext.ts'
export function SettingsPage() {
    const { setSettings, ...settings } = useContext(SettingsContext)
    return (
        <>
            <PageHeader>
                <Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link>
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
