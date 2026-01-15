import React from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { Button, Col, Divider, Dropdown, Popconfirm, Row, Skeleton, Space, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, PictureOutlined  } from '@ant-design/icons';
import { useState } from "react";
import { useAssistanceObjects } from "../../../contexts/AssistanceObjectsContext";
import { useEffect } from "react";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { beautifyDate } from "../../../services/Auxillary";
import { useDatapools } from "../../../contexts/DatapoolsContext";
import { AddNewList } from "./AddNewList";

import './index.css'
import { EditListName } from "./EditListName";
import { EditImageMapClickImagesList } from "./EditImageMapClickImagesList";

export function MapClickImagesList(){
    
    const {mapClickImageLists: lists, isLoadingMapClickImageLists, errorGetMapClickImageLists, getAllMapClickImageLists} = useAssistanceObjects()

    const [api, contextHolder] = message.useMessage()

    const [showAddList, setShowAddList] = useState(false)

    const [showEditListName, setShowEditListName] = useState(false)
    const [showEditListImage, setShowEditListImage] = useState(false)

    const [selectedList, setSelectedList] = useState(null)


    const {selectedDatapool} = useDatapools()
    
    useEffect(() => {
        getAllMapClickImageLists()
    }, [selectedDatapool])
    
    const listActionsList = (l) => [
        {
            key: 'edit_list_name',
            label: 'Edit name ',
            icon: <EditOutlined/>,
            onClick: () => {
                setSelectedList(l)
                setShowEditListName(true)
            }
        },
        {
            key: 'edit_list_image',
            label: 'Edit image ',
            icon: <PictureOutlined />,
            onClick: () => {
                setSelectedList(l)
                setShowEditListImage(true)
            }
        },
        {
        key: 'delete_list',
        label: 
        <Popconfirm
            title="Remove list"
            description="Are you sure to delete this list?"
                    onConfirm={() => {

                    }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
            placement="right"
        >
        
            Delete
        </Popconfirm>,
        icon: <DeleteOutlined />,
        onClick: () => {
            
        }
    }]

    const renderLists = () => {
        
        return(
            <Row 
                className="hq-full-width"
                gutter={[4,4]}
            >
                {lists.map((l, li) => {
                    const {Id, Code, AddedByName, DateCreated, PDF, Link, Play, Video} = l

                    return(
                        <Col
                            key={Id}
                            xs={9}
                            className="hq-element-container"
                        >
                            <Row>
                                <Col xs={12}>
                                    <Space direction="vertical" align="start">
                                        <Space>
                                            <p className="default-gray">{li+1}</p>
                                            <Dropdown
                                                menu={{
                                                    title:'Actions',
                                                    items: listActionsList(l)
                                                }}
                                            >
                                                <p className="default-title hoverable">{Code}</p>
                                            </Dropdown>
                                        </Space>

                                        <Space direction="vertical" align="start">
                                            <small className="default-gray">{AddedByName}</small>
                                            <small className="default-gray">{beautifyDate(DateCreated)}</small>
                                        </Space>
                                    </Space>
                                </Col>
                                <Col xs={11}>
                                    <Row gutter={[12]}>
                                        {Play &&
                                        <Col xs={6}>
                                            <small className="default-gray">Play</small>
                                            <img 
                                                src={Play}
                                                className="hq-img"
                                                alt="play"
                                            />
                                        </Col>}

                                        {PDF &&
                                        <Col xs={6}>
                                            <small className="default-gray">PDF</small>

                                            <img 
                                                src={PDF}
                                                className="hq-img"
                                                alt="pdf"
                                            />
                                        </Col>}

                                        {Link &&
                                        <Col xs={6}>
                                            <small className="default-gray">Link</small>

                                            <img 
                                                src={Link}
                                                className="hq-img"
                                                alt="link"
                                            />
                                        </Col>}

                                        {Video && 
                                        <Col xs={6}>
                                            <small className="default-gray">Video</small>

                                            <img 
                                                src={Video}
                                                className="hq-img"
                                                alt="video"
                                            />
                                        </Col>}
                                    </Row>
                                </Col>
                            </Row>
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
                    <p>Map pop-up icons</p>

                    <Button 
                        icon={<PlusOutlined style={{color:'green'}} />}
                        size="small"
                        onClick={() => setShowAddList(true)}
                    >
                        Add
                    </Button>
                </Space>
            </Divider>

            <br/>
            {isLoadingMapClickImageLists && <Skeleton />}
            {errorGetMapClickImageLists && !isLoadingMapClickImageLists &&
                <ErrorComponent 
                    error={errorGetMapClickImageLists}
                    onReload={() => getAllMapClickImageLists()}
                />
            }

            {!(isLoadingMapClickImageLists && errorGetMapClickImageLists) && lists && renderLists()}


            <AddNewList 
                open={showAddList}
                onClose={()=> setShowAddList(false)}
                reloadData={() => getAllMapClickImageLists()}
            />

            <EditListName 
                open={showEditListName}
                onClose={()=> setShowEditListName(false)}
                reloadData={() => getAllMapClickImageLists()}

                list={selectedList}
            />

            <EditImageMapClickImagesList 
                open={showEditListImage}
                onClose={()=> setShowEditListImage(false)}
                reloadData={() => getAllMapClickImageLists()}

                list={selectedList}
            />
        </PagesWrapper>
    )
}