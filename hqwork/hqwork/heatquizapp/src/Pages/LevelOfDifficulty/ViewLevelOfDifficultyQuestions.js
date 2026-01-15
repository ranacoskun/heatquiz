import {Col, Drawer, Dropdown, Row, Skeleton, Space} from "antd";
import React from "react";
import { useLevelsOfDifficulty } from "../../contexts/LevelOfDifficultyContext";
import { beautifyDate } from "../../services/Auxillary";
import {ArrowLeftOutlined, TrophyOutlined} from '@ant-design/icons';

import { QUESTION_TYPES_SEARCH_NAMES } from "../Questions/List/constants";
import { ErrorComponent } from "../../Components/ErrorComponent";
import { useEffect } from "react";
import { QuestionPlayPocket } from "../Questions/QuestionPlayPocket/QuestionPlayPocket";
import { useState } from "react";

export function ViewLevelOfDifficultyQuestions({open, onClose, LOD}){

    if(!open) return <div/>;

    const { isLoadingLODQuestions, errorGetLODQuestions, LODQuestions, getLODQuestions} = useLevelsOfDifficulty()

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(false)


    useEffect(() => {
        if(open){
            getLODQuestions(LOD.Id)
        }
    }, [open])

    const colorLine = (color) => (
        <div style={{width:'100%', height:4, backgroundColor: color, marginTop:1, marginBottom:1}}></div>
    )


    const {Name, HexColor} = LOD


    const questionActionList = (q) => [/*{
        key: 'view_edit_question',
        label: 'View edit question',
        icon: <EditOutlined/>,
        onClick: () => {}
    },*/
    {
        key: 'play_question',
        label: 'Play question',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setShowPlayQuestionModal(true)
            setSelectedQuestion(q)
        }
    }]

    const renderQuestions = () => {
        
        return(
            <Row
                gutter={12}
            >
                {LODQuestions.map((q, qi) => 
                    {
                        const {Code, Base_ImageURL, AddedByName, DateCreated, Type, Subtopic, DatapoolName} = q  
                        let qType = QUESTION_TYPES_SEARCH_NAMES.filter(a => a.value === Type)[0]
                        qType = qType ? qType.label : ''
                        const qTopic = Subtopic.Topic.Name

                        return(<Col 
                            key={q.Id}
                            xs={12}>
                                <div
                                    className="hq-element-container"
                                >
                                    <div>
                                            <Dropdown
                                               menu={{
                                                    items:questionActionList(q),
                                                    title:'Actions'
                                                }}
                                            >
                                            <p  className="hoverable-plus"> {qi+1}{' '}{Code} </p>   
                                            </Dropdown>   
                                            <br/>      
                                            <p className="default-gray">{AddedByName}</p>
                                            <p className="default-gray">{beautifyDate(DateCreated)}</p>
                
                
                                            <img
                                                alt={Code}
                                                src={Base_ImageURL}
                                                className="hq-img-size-1"
                                            />
                                            <Space
                                                size={'large'}
                                            >   
                                                <p>{qType}</p>
                                                <p>-</p>
                                                <p>{qTopic}</p>
                                                <p>-</p>
                                                <strong><p>{DatapoolName}</p></strong>
                                            </Space>
                                        </div>
                                    </div>
                                </Col>)
                    }
                )}
            </Row>
        )
    }

    return(
        <Drawer
        title="View level of difficulty questions"
        width={'80%'}
        onClose={onClose}
        open={open}
        
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        footer={
            <div>
                <p  className="default-gray">{Name}</p>
                {colorLine(HexColor)}
            </div>
        }
        >
           
            {isLoadingLODQuestions && <Skeleton />}

            {(!isLoadingLODQuestions && LODQuestions) && renderQuestions()}

            {errorGetLODQuestions && !isLoadingLODQuestions && 
                <ErrorComponent 
                    error={errorGetLODQuestions}
                    onReload={() => getLODQuestions(LOD)}
                />
            }

            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />
            
        </Drawer>
    )
}