import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { Button, Col, Divider, Dropdown, Popconfirm, Row, Skeleton, Space, message } from "antd";
import {PlusOutlined, DeleteOutlined, EditOutlined, PictureOutlined} from '@ant-design/icons';
import { useDefaultValues } from "../../../contexts/DefaultValuesContext";
import { useDatapools } from "../../../contexts/DatapoolsContext";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { beautifyDate, handleResponse } from "../../../services/Auxillary";

import './index.css'
import { AddDefaultImage } from "./AddDefaultImage";
import { EditDefaultImageName } from "./EditDefaultImageName";
import { EditDefaultImageImage } from "./EditDefaultImageImage";

export function DefaultImagesList(){

    const {DefaultImages, errorGetDefaultImages, isLoadingDefaultImages, getDefaultImages,
        removeDefaultImage
    
    } = useDefaultValues()

    const {selectedDatapool} = useDatapools()

    const [showAddImage, setShowAddImage] = useState(false)
    const [showEditName, setShowEditName] = useState(false)
    const [showEditImage, setShowEditImage] = useState(false)

    const [selectedImage, setSelectedImage] = useState(null)

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        getDefaultImages()
    }, [selectedDatapool])

    const listActionsList = (l) => [
        {
            key: 'edit_list_name',
            label: 'Edit name ',
            icon: <EditOutlined/>,
            onClick: () => {
                setShowEditName(true)
                setSelectedImage(l)
            }
        },
        {
            key: 'edit_list_image',
            label: 'Edit Image ',
            icon: <PictureOutlined />,
            onClick: () => {
                setShowEditImage(true)
                setSelectedImage(l)
            }
        },
        {
        key: 'delete_list',
        label: 
        <Popconfirm
            title="Remove list"
            description="Are you sure to delete this list?"
                    onConfirm={() => {
                        removeDefaultImage(l)
                        .then(r => handleResponse(r, api, 'Removed', 1, () => getDefaultImages()))
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

    const renderImages = () => {
        return(
            <Row 
                className="hq-full-width"
                gutter={[4,4]}
            >
                {DefaultImages.map((l, li) => {
                    const {Id, Code, AddedByName, DateCreated, ImageURL} = l

                    return(
                        <Col
                            key={Id}
                            xs={6}
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

                                <Col>
                                    <img 
                                        alt={Code}
                                        src={ImageURL}
                                        className="default-images-list-img"
                                    />
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
                    <p> Default Images</p>

                    <Button 
                        icon={<PlusOutlined style={{color:'green'}} />}
                        size="small"
                        onClick={() => setShowAddImage(true)}
                    >
                        Add
                    </Button>
                </Space>
            </Divider>

            {isLoadingDefaultImages && <Skeleton />}

            {errorGetDefaultImages && !isLoadingDefaultImages &&
                <ErrorComponent 
                    error={errorGetDefaultImages}
                    onReload={() => getDefaultImages()}
                />
            }

            {!(isLoadingDefaultImages && errorGetDefaultImages) && DefaultImages && renderImages()}


            <AddDefaultImage 
                open={showAddImage}
                onClose={() => setShowAddImage(false)}
                reloadData={() => getDefaultImages()}
            />

            <EditDefaultImageName 
                open={showEditName}
                onClose={() => setShowEditName(false)}
                defaultImage={selectedImage}

                reloadData={() => getDefaultImages()}
            />

            <EditDefaultImageImage 
                open={showEditImage}
                onClose={() => setShowEditImage(false)}
                defaultImage={selectedImage}

                reloadData={() => getDefaultImages()}
            />
        </PagesWrapper>
    )
}