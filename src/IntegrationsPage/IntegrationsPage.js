import { UsernameHeaderLink } from '../UsernameHeaderLink/UsernameHeaderLink'
import { PageHeader } from '../Page/PageHeader'
import { useGoals } from '../hooks/useGoals'
import { Button, Input, Space, Modal, Table } from 'antd'
import { useMutation } from 'react-query'
import { Tile, TileContent, TileTitle } from '../Tile/Tile'
import { useState } from 'react'

export default function IntegrationsPage() {
    const { data, refetch } = useGoals()
    const [integrationDetails, setIntegrationDetails] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { mutate } = useMutation(
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
                <Tile style={{ marginBottom: '20px', minHeight: '90px' }}>
                    <TileTitle>Your integrations</TileTitle>
                </Tile>
            </>
        )
    }

    const columns = [
        {
            title: 'Goal',
            dataIndex: 'slug',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Source',
            dataIndex: 'autodata',
            render: (autodata) => (
                <a>{autodata === 'api' ? 'BUI or app' : autodata}</a>
            ),
        },
        {
            title: 'Connect',
            dataIndex: 'none',
            render: (_, { slug }) => (
                <>
                    <Button
                        onClick={() => {
                            setIsModalOpen(true)
                            setIntegrationDetails({
                                ...integrationDetails,
                                slug,
                            })
                        }}
                    >
                        Connect
                    </Button>
                </>
            ),
        },
    ]

    return (
        <>
            <PageHeader>
                <UsernameHeaderLink />
            </PageHeader>
            <Tile>
                <TileTitle>Your integrations</TileTitle>
                <TileContent>
                    <div>
                        Welcome to BUI Integrations Preview.
                        <br />
                        Currently, it's possible to connect your goal to{' '}
                        <a href="https://www.memrise.com/" target="_blank">
                            Memrise points
                        </a>
                        .
                    </div>
                </TileContent>
            </Tile>
            <Tile>
                <TileTitle>1. Create a goal</TileTitle>
                <TileContent>
                    <div>
                        First, create an odometer goal. Then, come back here and
                        refresh the page. <br />
                        Or if you already have one, find it below and click
                        "Connect".
                    </div>
                    <div>
                        <Button
                            style={{ marginTop: '10px' }}
                            type="primary"
                            href="https://beeminder.com/new"
                            target="_blank"
                        >
                            Create a goal
                        </Button>
                    </div>
                </TileContent>
            </Tile>
            <Tile>
                <TileTitle>
                    2. Integrate with Memrise{' '}
                    <Button onClick={() => refetch()}>Reload the list</Button>
                </TileTitle>
                <TileContent>
                    <br />
                    <Table
                        columns={columns}
                        dataSource={data
                            .sort((a, b) => a.slug.localeCompare(b.slug))
                            .map((goal) => ({ ...goal, key: goal.slug }))}
                    />
                    <br />
                    To disconnect, go to your Beeminder goal Settings Tab and
                    select "Manual" in Data section.
                    <br />
                    Changing goal name or username might break the integration.
                </TileContent>
            </Tile>
            <Modal
                title="We're almost there..."
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
                    Please tell us your Memrise user name and we're all set!
                    <Input
                        placeholder="Memrise user name"
                        onInput={(e) => {
                            refetch()
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
