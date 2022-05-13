import { PageHeader } from '../Page/PageHeader'
import { Link } from 'react-router-dom'
import { Tile, TileTitle, TileContent } from '../Tile/Tile'
export function SettingsPage() {
    return (
        <>
            <PageHeader>
                <Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link>
            </PageHeader>
            <Tile>
                <TileTitle>Use split layout</TileTitle>
                <TileContent>Yes</TileContent>
            </Tile>
            <Tile>
                <TileTitle>Group by tags</TileTitle>
                <TileContent>Yes</TileContent>
            </Tile>
            <Tile>
                <TileTitle>Manage tags</TileTitle>
            </Tile>
            <Tile>
                <TileTitle>App limits</TileTitle>
                <TileContent>
                    Currently we fetch only 250 recent datapoints to make sure
                    performance remains stable.
                </TileContent>
            </Tile>
            <Tile>
                <TileTitle>Manage goals</TileTitle>
            </Tile>
        </>
    )
}
