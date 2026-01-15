import React from "react";
import { PagesWrapper } from "../../PagesWrapper"
import { useDatapools } from "../../contexts/DatapoolsContext";
import { useEffect } from "react";
import { Button, Col, Divider, Dropdown, Empty, Row, Skeleton, Space } from "antd";
import {EditOutlined, DeleteOutlined, ClusterOutlined, PlusOutlined} from '@ant-design/icons';

import './Datapools.css'
import { AddDatapool } from "./AddDatapool";
import { useState } from "react";
import { EditDatapool } from "./EditDatapool";
import { EditUserDatapoolAccess } from "./EditUserDatapoolAccess";
import { ErrorComponent } from "../../Components/ErrorComponent";

export function Datapools(){

    const {datapoolsAdmin, errorGetDatapoolsAdmin, isLoadingDatapoolsAdmin, getAllDatapoolsAdmin} = useDatapools()
    const [showAddDPModal, setShowAddDPModal] = useState(false)
    const [showEditDPModal, setShowEditDPModal] = useState(false)
    const [showEditDPAccessModal, setShowEditDPAccessModal] = useState(false)
    const [selectedDP, setSelectedDP] = useState(null)

    useEffect(() => {
        getAllDatapoolsAdmin()
    }, [])
    

    const dpActionList = (d) => [{
        key: 'edit_info',
        label: 'Edit info',
        icon: <EditOutlined/>,
        onClick: () => {
            setShowEditDPModal(true)
            setSelectedDP(d)
        }
    },
    {
        key: 'edit_access',
        label: 'Edit user access',
        icon: <ClusterOutlined />,
        onClick: () => {
            setShowEditDPAccessModal(true)
            setSelectedDP(d)
        }
    },
    {
        key: 'delete_dp',
        label: 'Delete',
        icon: <DeleteOutlined/> ,
        onClick: () => {}
    }]

    const renderDatapools = () => {

        return(
            <Row
                gutter={12}
            >
                {datapoolsAdmin.length ? 
                    datapoolsAdmin.map((d, di) => {
                        const {Id, Name, NickName, IsHidden, PoolAccesses} = d

                        return(
                            <Col 
                            key={Id}
                            lg={{span:6}}
                            md={{span:8}}
                            sm={{span:12}}
                            xs={{span:24}}
                            >
                                <div
                                    className="datapools-edit-view-element"
                                >
                                    <div
                                        className="datapools-edit-view-element-internal"
                                    >
                                        <Space
                                            className="datapools-edit-view-element-header"
                                            align="center"
                                        >
                                            <Dropdown
                                                menu={{
                                                    items:dpActionList(d),
                                                    title:'Actions'
                                                    }}
                                            >
                                                <p
                                                    className="datapools-edit-view-element-code"
                                                >{di+1}{' '}{Name}</p>

                                                
                                            </Dropdown>

                                            <small className="datapools-edit-view-element-red">{IsHidden && 'Hidden'}</small>
                                        </Space>
                                        <Space
                                            className="datapools-edit-view-element-header"
                                            align="center"
                                        >
                                            <small className="datapools-edit-view-element-gray">{NickName}</small>

                                            <small className="datapools-edit-view-element-gray">{PoolAccesses.length}{' '} users have access</small>
                                        </Space>

                                    </div>

                                </div>
                            </Col>)
                    })
                : <Empty />}
            </Row>)

    }

    return(
        <PagesWrapper>
            <Divider orientation="left">
                <Space>
                    <p>Datapools</p>
                    <Button
                        size="small"
                        onClick={() => setShowAddDPModal(true)}
                        icon={<PlusOutlined style={{color:'green'}}/>}
                    >
                            
                        Add
                    </Button>
                </Space>
            </Divider>

            {isLoadingDatapoolsAdmin && <Skeleton/>}

            {(!isLoadingDatapoolsAdmin && datapoolsAdmin) && renderDatapools()}

            {errorGetDatapoolsAdmin && !isLoadingDatapoolsAdmin && 
                <ErrorComponent 
                    error={errorGetDatapoolsAdmin}
                    onReload={() => getAllDatapoolsAdmin()}
                />
            }

            <AddDatapool 
                open={showAddDPModal}
                onClose={() => setShowAddDPModal(false)}
            />

            <EditDatapool 
                open={showEditDPModal}
                onClose={() => setShowEditDPModal(false)}
                DP={selectedDP}
            />

            <EditUserDatapoolAccess  
                open={showEditDPAccessModal}
                onClose={() => setShowEditDPAccessModal(false)}
                DP={selectedDP}
            />
        </PagesWrapper>
    )
}