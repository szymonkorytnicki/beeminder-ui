import { UsernameHeaderLink } from '../UsernameHeaderLink/UsernameHeaderLink'
import { PageHeader } from '../Page/PageHeader'
import { useGoals } from '../hooks/useGoals'
import { Button } from 'antd'
import { useMutation } from 'react-query'
import { Tile, TileContent, TileTitle } from '../Tile/Tile'

export default function IntegrationsPage() {
    const { data } = useGoals()
    const { isLoading, mutate } = useMutation(async ({ slug }) => {
        const response = await fetch(
            `${process.env.REACT_APP_ENDPOINT}/api.php/integrateGoal?slug=${slug}`,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        return await response.json()
    })
    if (!data) {
        return (
            <>
                <PageHeader>
                    <UsernameHeaderLink />
                </PageHeader>
                <Tile style={{ marginBottom: '20px', minHeight: '110px' }}>
                    <TileTitle>Your integrations</TileTitle>
                </Tile>
            </>
        )
    }

    return (
        <>
            <PageHeader>
                <UsernameHeaderLink />
            </PageHeader>
            <Tile style={{ marginBottom: '20px', minHeight: '110px' }}>
                <TileTitle>Your integrations</TileTitle>
                <TileContent>
                    <div>
                        Welcome to BUI Integrations Preview. Currently, it's
                        possible to connect your goal to{' '}
                        <a href="https://www.memrise.com/">Memrise</a>.
                    </div>
                    <div>
                        Create an odometer goal and select goal that will
                        subscribe to your Memrise points.
                    </div>
                    {data
                        .sort((a, b) => a.slug.localeCompare(b.slug))
                        .map((goal) => {
                            return (
                                <div key={goal.slug}>
                                    {goal.slug} {goal.datasource}
                                    <Button
                                        onClick={() =>
                                            mutate({ slug: goal.slug })
                                        }
                                    >
                                        {/* TODO open modal and specify details */}
                                        Connect
                                    </Button>
                                </div>
                            )
                        })}
                </TileContent>
            </Tile>
        </>
    )
}
