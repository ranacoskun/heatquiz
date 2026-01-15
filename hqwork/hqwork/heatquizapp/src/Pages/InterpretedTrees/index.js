import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { Button, Col, Divider, Dropdown, Popconfirm, Row, Select, Skeleton, Space, Tooltip, message } from "antd";
import { useInterpretedTrees } from "../../contexts/InterpretedTreesContext";
import { useDatapools } from "../../contexts/DatapoolsContext";
import {PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined, SlidersOutlined} from '@ant-design/icons';
import './InterpretedTrees.css'
import { EditTreeName } from "./EditTreeName";
import {AddTree} from "./AddTree"
import { AddImage } from "./AddImage";
import { EditImageName } from "./EditImageName";
import { EditImagePicture } from "./EditImagePicture";
import { EditImageValues } from "./EditImageValues";
import { ErrorComponent } from "../../Components/ErrorComponent";
import { handleResponse } from "../../services/Auxillary";

export function InterpretedTrees(){

    const {
        interpretedTrees, errorGetInterpretedTrees, isLoadingInterpretedTrees, getAllInterpretedTrees,

        removeInterpretedTree,
        removeInterpretedNode,
    } = useInterpretedTrees()
    const {selectedDatapool} = useDatapools()
    const [selectedTree, setSelectedTree] = useState(null)

    const [showAddTreeModal, setShowAddTreeModal] = useState(false)
    const [showEditTreeNameModal, setShowEditTreeNameModal] = useState(false)

    const [showAddImageModal, setShowAddImageModal] = useState(false)
    const [showEditImageNameModal, setShowEditImageNameModal] = useState(false)
    const [showEditImagePictureModal, setShowEditImagePictureModal] = useState(false)
    const [showEditImageValuesModal, setShowEditImageValuesModal] = useState(false)

    const [selectedNode, setSelectedNode] = useState(null)


    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        getAllInterpretedTrees()
    }, [selectedDatapool])

    useEffect(() => {
        if(interpretedTrees && interpretedTrees.length){
            setSelectedTree(interpretedTrees[0])
        }
        else{
            setSelectedTree(null)
        }
    }, [interpretedTrees])


    const imageActionList = (t) => [
        {
            key: 'edit_tree_name',
            label: 'Edit name ',
            icon: <EditOutlined/>,
            onClick: () => {
                setSelectedNode(t)
                setShowEditImageNameModal(true)
            }
        },
        {
            key: 'edit_tree_image',
            label: 'Edit image ',
            icon: <PictureOutlined/>,
            onClick: () => {
                setSelectedNode(t)
                setShowEditImagePictureModal(true)
            }
        },
        {
            key: 'edit_image',
            label: 'Edit values ',
            icon: <SlidersOutlined />,
            onClick: () => {
                setSelectedNode(t)
                setShowEditImageValuesModal(true)
            }
        },
        !(t.ClickCharts.length)
        &&
        {
            key: 'delete_tree',
            label: 
            <Popconfirm
                title="Remove tree"
                description="Are you sure to delete this tree?"
                        onConfirm={() => {
                            removeInterpretedNode(t)
                            .then((r) => handleResponse(r, messageApi, 'Removed', 1, () => {
                                getAllInterpretedTrees()
                            }))
                        }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
                placement="right"
            >
                Delete
            </Popconfirm>
            ,
            icon: <DeleteOutlined />,
            onClick: () => {}
        }
    ]

    const renderSelectTree = () => {
        const {Name, Images} = (selectedTree || {Name:'Please select/add', Images:[]})
        return(
            <Space size={"large"}>
            {!(isLoadingInterpretedTrees || errorGetInterpretedTrees) && interpretedTrees 
            && 
                <Select
                    onChange={(v, option) => {
                        const findSelectedTree = interpretedTrees.filter(t => t.Id === option.value)[0]

                        setSelectedTree(findSelectedTree)
                    }}
                    defaultValue={'please select'}
                    value={Name + ' ' + (Images.length ? '( ' + Images.length + ' images )' : '')}
                    className='navigation-bar-interpreted-trees-select'
                    options={
                    (interpretedTrees || [])
                        .map((d) => ({
                        value: d.Id,
                        label: d.Name
                    }))
                }
                />}

            {!isLoadingInterpretedTrees && selectedTree && 
                <Space size={'small'}>
                    <Tooltip
                        color="white"
                        placement="top"
                        title={<p>Edit name</p>}
                    >
                        <Button
                            onClick={() =>  setShowEditTreeNameModal(true)}
                        >
                            <EditOutlined/>
                            
                        </Button>
                    </Tooltip>

                    <Tooltip
                        color="white"
                        placement="top"
                        title={<p>New image</p>}
                    >
                        <Button
                            onClick={() => setShowAddImageModal(true)}
                        >
                            <PlusOutlined style={{color:'green'}}/>
                        </Button>
                    </Tooltip>

                    <Popconfirm
                        title="Remove tree"
                        description="Are you sure to delete this tree?"
                                onConfirm={() => {
                                    removeInterpretedTree(selectedTree)
                                    .then((r) => handleResponse(r, messageApi, 'Removed', 1, () => {
                                        getAllInterpretedTrees()
                                    }))
                                }}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                        placement="right"
                    >
                        <Tooltip
                            color="white"
                            placement="top"
                            title={<p>Delete tree</p>}
                        >
                            <Button>
                                <DeleteOutlined/>
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                </Space>
            }
        </Space>
        )
    }

    const renderSelectedTree = () => {
        const {Images} = selectedTree

        return(
            <div>
            <br/>
                <Row >
                    {Images.map((img) => 
                    <Col 
                        xs ={4}
                        lg={6}
                        md={4}
                        key={img.Id}
                    >
                        <Space>
                            <div>
                                <Dropdown
                                    menu={{
                                        items:imageActionList(img),
                                        title:'Actions'
                                    }}
                                >
                                    <p className="default-title hoverable">{img.Code}</p>
                                </Dropdown>
                                <small className="default-gray">{ img.ClickCharts.length ? img.ClickCharts.length + ' usage times' : ''} </small>
                                <Space size={'large'}>
                                <img 
                                    src={img.URL}
                                    className="interpreted-tree-head-img"
                                    alt={img.Name}
                                />
                                <Space direction="vertical" align="start">
                                    <p><small className="default-gray">Left{' '}</small>{img.Left.Value}</p>
                                    
                                    <p><small className="default-gray">Right{' '}</small>{img.Right.Value}</p>
                                 
                                    <p><small className="default-gray">Ratio{' '}</small>{img.RationOfGradients.Value}</p>
                                    
                                    <p><small className="default-gray">Jump{' '}</small>{img.Jump.Value}</p>
                                </Space>
                                </Space>
                            </div>
                                    
                        </Space>
                    </Col>
                    )}
                </Row>
            </div>
        )
    }

    return(
        <PagesWrapper>
            {contextHolder}
            <Divider orientation="left">
                <span className="page-title">
                    Interpreted Trees
                </span>
                <Button
                    type={'default'}
                    onClick={() => setShowAddTreeModal(true)}
                >
                    <PlusOutlined style={{color:'green'}}/>
                    New tree
                </Button>
            </Divider>

            {isLoadingInterpretedTrees && <Skeleton />}

            {errorGetInterpretedTrees && !isLoadingInterpretedTrees && 
                <ErrorComponent 
                    error={errorGetInterpretedTrees}
                    onReload={() => getAllInterpretedTrees()}
                />}

            {renderSelectTree()}
            {!isLoadingInterpretedTrees && selectedTree && renderSelectedTree()}
            
            <AddTree 
                open={showAddTreeModal}
                onClose={()=>setShowAddTreeModal(false)}
                reloadData = {() => getAllInterpretedTrees()}
            />

            <EditTreeName 
                open={showEditTreeNameModal}
                onClose={() => setShowEditTreeNameModal(false)}
                tree={selectedTree}
                reloadData = {() => getAllInterpretedTrees()}
            />

            <AddImage 
                open={showAddImageModal}
                onClose={()=>setShowAddImageModal(false)}
                baseTree={selectedTree}
                reloadData = {() => getAllInterpretedTrees()}
            />

            <EditImageName 
                open={showEditImageNameModal}
                onClose={() => setShowEditImageNameModal(false)}
                node={selectedNode}
                reloadData = {() => getAllInterpretedTrees()}
            />

            <EditImagePicture 
                open={showEditImagePictureModal}
                onClose={() => setShowEditImagePictureModal(false)}
                node={selectedNode}
                reloadData = {() => getAllInterpretedTrees()}
            />

            <EditImageValues 
                open={showEditImageValuesModal}
                onClose={() => setShowEditImageValuesModal(false)}
                node={selectedNode}
                reloadData = {() => getAllInterpretedTrees()}
            />

        </PagesWrapper>
    )
}