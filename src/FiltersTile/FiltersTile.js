import { Tile } from '../Tile/Tile'
import {
    CheckCircleOutlined,
    IssuesCloseOutlined,
    CalendarOutlined,
} from '@ant-design/icons'
import { Select, Input, Button, Space } from 'antd'
import css from './FiltersTile.module.css'
const { Option } = Select

export default function FiltersTile({
    onFiltersChange,
    filters,
    onQueryChange,
}) {
    return (
        <Tile style={{ marginBottom: '20px' }}>
            <Space>
                <FilterWrapper>
                    <IconWrapper>
                        <CalendarOutlined />
                    </IconWrapper>
                    <Select
                        style={{ width: 95 }}
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
                        <Option value="7">7 days</Option>
                        <Option value="MAGIC">✨</Option>
                    </Select>
                </FilterWrapper>
                <FilterWrapper>
                    <IconWrapper>
                        <CheckCircleOutlined />
                    </IconWrapper>
                    <Select
                        style={{ width: 95 }}
                        value={filters.doneStatus}
                        onChange={(value) =>
                            onFiltersChange({ ...filters, doneStatus: value })
                        }
                    >
                        <Option value="ALL">All</Option>
                        <Option value="DONE">Done</Option>
                        <Option value="TODO">To do</Option>
                    </Select>
                </FilterWrapper>

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

function FilterWrapper({ children }) {
    return <div className={css.filterWrapper}>{children}</div>
}

function IconWrapper({ children }) {
    return <span className={css.iconWrapper}>{children}</span>
}
