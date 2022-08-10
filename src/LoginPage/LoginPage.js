import { Tile, TileHeader, TileContent, TileTitle } from '../Tile/Tile'

export default function LoginPage() {
    return (
        <>
            <Tile>
                <TileTitle>Welcome to BUI</TileTitle>
                <TileContent>
                    <p>
                        The alternative UI for Beeminder, featuring some
                        interesting charts.
                    </p>
                    <p>
                        <a
                            style={{ textDecoration: 'underline' }}
                            href={`https://www.beeminder.com/apps/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_CALLBACK_URL}&response_type=token`}
                        >
                            Log in with Beeminder
                        </a>
                    </p>
                </TileContent>
            </Tile>
        </>
    )
}
