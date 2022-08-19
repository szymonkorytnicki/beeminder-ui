import { UsernameHeaderLink } from '../UsernameHeaderLink/UsernameHeaderLink'
import { PageHeader } from '../Page/PageHeader'
import { useGoals } from '../hooks/useGoals'
import { Button, Input, Space, Modal } from 'antd'
import { useMutation } from 'react-query'
import { Tile, TileContent, TileTitle } from '../Tile/Tile'
import { useState } from 'react'

export default function IntegrationsPage() {
    const { data } = useGoals()
    const [integrationDetails, setIntegrationDetails] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { isLoading, mutate } = useMutation(
        async ({
            slug,
            integration,
            integration_username,
            integration_password,
        }) => {
            const response = await fetch(
                `${process.env.REACT_APP_ENDPOINT}/api.php/integrate?slug=${slug}&integration=${integration}&integration_username=${integration_username}&integration_password=${integration_password}`,
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
        }
    )
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
                        Welcome to BUI Integrations Preview.
                        <br />
                        Currently, it's possible to connect your goal to{' '}
                        <a href="https://www.memrise.com/">Memrise</a>.
                    </div>
                    <div>
                        Create an odometer goal and select a goal that will
                        subscribe to your Memrise points.
                    </div>

                    {data
                        .sort((a, b) => a.slug.localeCompare(b.slug))
                        .map((goal) => {
                            return (
                                <div key={goal.slug}>
                                    <Space>
                                        <div>{goal.slug}</div>
                                        <Button
                                            onClick={() => {
                                                setIsModalOpen(true)
                                                setIntegrationDetails({
                                                    ...integrationDetails,
                                                    slug: goal.slug,
                                                })
                                            }}
                                        >
                                            {/* TODO open modal and specify details */}
                                            Connect
                                        </Button>
                                    </Space>
                                </div>
                            )
                        })}
                </TileContent>
            </Tile>
            <Modal
                title="Select integration"
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => {
                    mutate({
                        ...integrationDetails,
                        integration: 'memrise_points',
                    })
                    setIsModalOpen(false)
                }}
            >
                <div>
                    Currently, only Memrise is supported. Please tell us your
                    Memrise user name and we're all set!
                    <Input
                        placeholder="Memrise user name"
                        onInput={(e) => {
                            setIntegrationDetails({
                                ...integrationDetails,
                                integration_username: e.target.value,
                            })
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}
