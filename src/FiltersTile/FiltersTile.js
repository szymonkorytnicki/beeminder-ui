import { Tile } from '../Tile/Tile'
import { CheckCircleOutlined, IssuesCloseOutlined } from '@ant-design/icons'
import { Select, Input, Button, Space } from 'antd'
const { Option } = Select

export default function FiltersTile({
    onFiltersChange,
    filters,
    onQueryChange,
}) {
    return (
        <Tile style={{ marginBottom: '20px' }}>
            <Space>
                <Select
                    style={{ width: 60 }}
                    value={filters.range}
                    onChange={(value) =>
                        onFiltersChange({ ...filters, range: value })
                    }
                >
                    <Option value="ALL">All</Option>
                    <Option value="1">
                        <span
                            style={{
                                backgroundColor: 'red',
                                borderRadius: '100%',
                                width: '10px',
                                height: '10px',
                                display: 'inline-block',
                            }}
                        ></span>
                    </Option>
                    <Option value="2">
                        <span
                            style={{
                                backgroundColor: 'orange',
                                borderRadius: '100%',
                                width: '10px',
                                height: '10px',
                                display: 'inline-block',
                            }}
                        ></span>
                    </Option>
                    <Option value="3">
                        <span
                            style={{
                                backgroundColor: 'blue',
                                borderRadius: '100%',
                                width: '10px',
                                height: '10px',
                                display: 'inline-block',
                            }}
                        ></span>
                    </Option>
                    <Option value="MAGIC">✨</Option>
                </Select>
                <Button
                    onClick={() =>
                        onFiltersChange({
                            ...filters,
                            hideDone: !filters.hideDone,
                        })
                    }
                    icon={
                        filters.hideDone ? (
                            <IssuesCloseOutlined />
                        ) : (
                            <CheckCircleOutlined />
                        )
                    }
                ></Button>
                {/* <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                    (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                </Select> */}
                <Input
                    placeholder="Search"
                    onInput={(event) => {
                        onQueryChange(event.target.value)
                    }}
                    style={{
                        width: '100%',
                    }}
                />
            </Space>
        </Tile>
    )
}
