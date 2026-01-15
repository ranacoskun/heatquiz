import React, { useState } from "react";
import { PagesWrapper } from "../../PagesWrapper"
import { useLevelsOfDifficulty } from "../../contexts/LevelOfDifficultyContext";
import { useEffect } from "react";
import { Button, Col, Divider, Dropdown, Empty,  Row, Skeleton, Space, Tooltip, message } from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';

import { AddLevelOfDifficulty } from "./AddLevelOfDifficulty";
import { EditLevelOfDifficulty } from "./EditLevelOfDifficulty";
import { ViewLevelOfDifficultyQuestions } from "./ViewLevelOfDifficultyQuestions";
import { ErrorComponent } from "../../Components/ErrorComponent";

export function LevelOfDifficulty(){
    
    const {isLoadingLODsExtended, errorGetLODsExtended, LODsExtended, getAllLODsExtended,
        
    } = useLevelsOfDifficulty()

    const [messageApi, contextHolder] = message.useMessage()

    const [showAddLODModal, setShowAddLODModal] = useState(false)
    const [showEditLODModal, setShowEditLODModal] = useState(false)
    const [showViewLODQuestionsModal, setShowViewLODQuestionsModal] = useState(false)
    const [selectedLOD, setSelectedLOD] = useState(false)

    useEffect(() => {
        getAllLODsExtended()
    
    }, [])


    const colorLine = (color) => (
        <div style={{width:'100%', height:4, backgroundColor: color, marginTop:1, marginBottom:1}}></div>
    )


    const LODAction = (lod) => [{
        key: 'edit_name_color',
        label: 'Edit name / color',
        icon: <EditOutlined/>,
        onClick: () => {
            setShowEditLODModal(true)
            setSelectedLOD(lod)
        }
    },
    {
        key: 'delete_lod',
        label: 'Delete',
        icon: <DeleteOutlined/> ,
        onClick: () => {}
    }]

    const viewQuestions = (lod) => {
        setShowViewLODQuestionsModal(true)
        setSelectedLOD(lod)
    }

    const renderLODs = () => {

        return(
            <Row
                gutter={12}
            >
                {LODsExtended.length ? 
                    LODsExtended.map((lod, lodi) => {
                        const {Name, HexColor, NUsedQuestions} = lod

                        return(
                            <Col 
                            key={lod.Id}
                            lg={{span:6}}
                            md={{span:8}}
                            sm={{span:12}}
                            xs={{span:24}}>
                                <div
                                    className="hq-element-container"
                                >
                                    <div>
                                        <Dropdown
                                            menu={{
                                                items:LODAction(lod),
                                                title:'Actions'
                                                }}
                                        >
                                            <p
                                                className="hoverable"
                                            >{lodi+1}{' '}{Name}</p>
                                        </Dropdown>

                                    </div>

                                    {colorLine(HexColor)}
                                    <br/>
                                    <Tooltip
                                        color="white"
                                        title={<p>Click to view questions</p>}
                                        placement="bottom"
                                    >
                                        <p onClick={() => viewQuestions(lod)} className="hoverable-plus">{NUsedQuestions} questions</p>
                                    </Tooltip>
                                </div>
                            </Col>)
                    })
                : <Empty />}
            </Row>)
    }

    return(
        <PagesWrapper>
            {contextHolder}
            <Divider
                orientation="left"
            >
                <Space>
                    <p>Levels Of Difficulty</p>   

                    <Button
                        size="small"
                        onClick={() => setShowAddLODModal(true)}
                        icon={<PlusOutlined style={{color:'green'}}/>}
                    >
                        
                        Add
                    </Button>
                </Space>

            </Divider>
            {isLoadingLODsExtended && <Skeleton/>}
            {(!isLoadingLODsExtended && LODsExtended) && renderLODs()}

            {errorGetLODsExtended && !isLoadingLODsExtended && 
                <ErrorComponent 
                    error={errorGetLODsExtended}
                    onReload={() => getAllLODsExtended()}
                />
            }

            <AddLevelOfDifficulty 
                open={showAddLODModal}
                onClose={() => setShowAddLODModal(false)}

                reloadData={() => getAllLODsExtended()}
            />

            <EditLevelOfDifficulty 
                open={showEditLODModal}
                onClose={() => setShowEditLODModal(false)}
                LOD={selectedLOD}

                reloadData={() => getAllLODsExtended()}

            />

            <ViewLevelOfDifficultyQuestions 
                open={showViewLODQuestionsModal}
                onClose={() => setShowViewLODQuestionsModal(false)}
                LOD={selectedLOD}
            />
        </PagesWrapper>
    )
}