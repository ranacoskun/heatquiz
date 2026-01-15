import React, { useState } from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, Divider, Dropdown, Popconfirm, Row, Skeleton, Space, message } from "antd";
import { useKeyboard } from "../../../../contexts/KeyboardContext";
import { useEffect } from "react";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { beautifyDate, handleResponse } from "../../../../services/Auxillary";
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined  } from '@ant-design/icons';
import { EditListName } from "./EditListName";
import { AddNewList } from "./AddNewList";
import { useDatapools } from "../../../../contexts/DatapoolsContext";
import { ViewAssignedKeys } from "./ViewAssignedKeys";

import './index.css'

export function KeysListsList(){

    const { 
        isLoadingKeyLists, keyLists, errorGetKeyLists, getAllKeyLists,
        removeKeyList
    } = useKeyboard()

    const [showEditListName, setShowEditListName] = useState(false)
    const [selectedList, setSelectedList] = useState(null)

    const [showAddList, setShowAddList] = useState(false)
    const [showAssignedKeys, setShowAssignedKeys] = useState(false)

    const {selectedDatapool} = useDatapools()

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        getAllKeyLists()
    }, [selectedDatapool])

    const listActionsList = (l, hasAssignment) => [
    {
        key:'edit_name',
        label:'Update name',
        icon: <EditOutlined />,
        onClick: () => {
           setShowEditListName(true)
           setSelectedList(l)
        }
    },
    {
        key:'edit_view_assinged_keys',
        label:'Edit/View assigned keys',
        icon: <EyeOutlined/>,
        onClick: () => {
            setShowAssignedKeys(true)
            setSelectedList(l)
        }
    },
    !hasAssignment && {
        key:'remove_list',
        label:
        <Popconfirm
                title="Remove list"
                description="Are you sure to delete this list?"
                onConfirm={() => {
                removeKeyList(l)
                .then(r => handleResponse(
                    r,
                    api,
                    'Removed',
                    1,
                    () => getAllKeyLists()))
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
                placement="right"
            >
            Delete
        </Popconfirm>,
        icon: <DeleteOutlined />,
        onClick: () => {}
    }].filter(a => a)

    const renderKeyLists = () => {
        return(
            <Row gutter={[8,8]}>
                {keyLists.map((l, li) =>{
                    const {Id, Code, AddedByName, DateCreated, NumericKeys, VariableKeys} = l

                    const hasAssignment = (NumericKeys.length + VariableKeys.length)

                    return(
                        <Col
                            key={Id}
                            xs={6} 
                            className="hq-element-container"
                        >
                            <div direction="vertical" align="start" className="hq-full-width" >
                                <Row className="hq-full-width">
                                    <Col xs={hasAssignment ? 18 : 24}>
                                        <Space>
                                            <p className="default-gray">{li+1}</p>

                                            <Dropdown
                                                menu={{
                                                    title:'Actions',
                                                    items:listActionsList(l, hasAssignment)
                                                }}
                                            >
                                                <p className="default-title hoverable">{Code}</p>
                                            </Dropdown>
                                        </Space>
                                    </Col>
                                    {hasAssignment ?
                                    <Col xs={6}>
                                        <Space direction="vertical" align="start">
                                            
                                            <small className="default-gray">
                                                <span className="default-title">{NumericKeys.length}</span>
                                                {''} Numeric keys
                                            </small>
                                            <small className="default-gray">
                                                <span className="default-title">{VariableKeys.length}</span>
                                                {''} Variable keys
                                            </small>
                                        </Space>
                                    
                                    </Col>: <div/>}
                                </Row>

                                <Space direction="vertical" align="start">
                                    <small className="default-gray">{AddedByName}</small>
                                    <small className="default-gray">{beautifyDate(DateCreated)}</small>
                                </Space>
                                
                            </div>
                        </Col>
                    )
                })}
            </Row>
        )
    }

    return(
        <PagesWrapper>
            {contextHolder}
            <Divider orientation="left">
                <Space>
                Key lists

                <Button 
                    icon={<PlusOutlined style={{color:'green'}} />}
                    size="small"
                    onClick={() => setShowAddList(true)}
                >
                    Add
                </Button>
                </Space>
            </Divider>

            {isLoadingKeyLists && <Skeleton />}

            {errorGetKeyLists && !isLoadingKeyLists && 
                <ErrorComponent 
                    error={errorGetKeyLists}
                    onReload={() => getAllKeyLists()}
                />
            }

            {!(isLoadingKeyLists && errorGetKeyLists) && keyLists && renderKeyLists()}

            <EditListName 
                open={showEditListName}
                onClose={() => setShowEditListName(false)}

                list={selectedList}
                reloadData={() => getAllKeyLists()}
            />

            <AddNewList 
                open={showAddList}
                onClose={() => setShowAddList(false)}
                reloadData={() => getAllKeyLists()}
            />

            <ViewAssignedKeys 
                open={showAssignedKeys}
                onClose={() => setShowAssignedKeys(false)}
                list={selectedList}

                reloadData = {() => getAllKeyLists()}
            />
        </PagesWrapper>
    )
}