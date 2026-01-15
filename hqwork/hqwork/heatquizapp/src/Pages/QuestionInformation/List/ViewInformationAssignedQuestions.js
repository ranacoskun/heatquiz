import {Button, Drawer, Dropdown, List, Select, Skeleton, Space, Tooltip, message } from "antd";
import React, {} from "react"
import {ArrowLeftOutlined, TrophyOutlined, EditOutlined, } from '@ant-design/icons';
import { useEffect } from "react";
import { useState } from "react";
import { useAssistanceObjects } from "../../../contexts/AssistanceObjectsContext";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { useNavigate } from "react-router-dom";
import { QuestionPlayPocket } from "../../Questions/QuestionPlayPocket/QuestionPlayPocket";
import { QUESTION_TYPES_SEARCH_NAMES } from "../../Questions/List/constants";
import { handleResponse } from "../../../services/Auxillary";

export function ViewInformationAssignedQuestions({open, onClose, info, reloadData}){

    if(!open) return <div/>;

    const [messageApi, contextHolder] = message.useMessage();
    
    const {
        informationList,
        isLoadinggQuestionsAssignedInformation, getAllQuestionsAssignedInformation, errorGetQuestionsAssignedInformation, QuestionsAssignedInformation: questions,
        
        isLoadingAssignQuestionsInformation, assignQuestionsInformation,
        isLoadingUnassignQuestionsInformation, unassignQuestionsInformation

    
    } = useAssistanceObjects()

    const [selectedReassignQuestions, setSelectedReassignQuestions] = useState([])

    const [selectedReassignInfo, setSelectedReassignInfo] = useState(null)

    const [selectedQuestion, setSelectedQuestion] = useState({})
    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if(open){
            getAllQuestionsAssignedInformation(info)
        }
    }, [open])

    const questionActionsList = (q) => [{
        key: 'view_edit_question',
        label: 'View edit question',
        icon: <EditOutlined/>,
        onClick: () => navigate('/question_view_edit/'+q.Id+'/'+q.Type)
    },
    {
        key: 'play_question',
        label: 'Play question',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setSelectedQuestion(q)
            setShowPlayQuestionModal(true)
        }
    }]

    const renderAssignedQuestionsList = () => {
        return(
            <div className="hq-full-width">
               <List 
                    dataSource={questions}
                    renderItem={(q, qi) => {
                        const {Id, Type, Code, Base_ImageURL, Subtopic, LevelOfDifficulty} = q

                        const qType = QUESTION_TYPES_SEARCH_NAMES.filter(a => a.value === Type)[0].label
                        const qTopic = Subtopic.Topic.Name

                        const isSelected = (selectedReassignQuestions.filter(a => a.Id === Id).length)

                        return(
                            <div 
                                key={Id}
                                className={"hq-full-width hq-element-container" + (isSelected ? " highlighted" : "")}
                            >
                                <Space direction="vertical" align="start">
                                    <Space>
                                        <p className="default-gray">{qi+1}</p>

                                        <Dropdown
                                            menu={{
                                                title:'Actions',
                                                items:questionActionsList(q)
                                            }}
                                        >
                                            <Tooltip
                                                color="white"
                                                placement="top"
                                                title={<p>Click to select for reassignment / unassigning</p>}
                                            >
                                                <p 
                                                    onClick={() => {
                                                        let _selectedQuestions = [...selectedReassignQuestions]
                                                        
                                                        if(isSelected){
                                                            _selectedQuestions = _selectedQuestions.filter(a =>a.Id !== Id)
                                                        }   
                                                        else{
                                                            _selectedQuestions.push(q)
                                                        }
        
                                                        setSelectedReassignQuestions(_selectedQuestions)
                                                    }}
                                                    className={"hoverable-plus" + (isSelected ? " default-title":"")}
                                                >
                                                    {Code}
                                                </p>
                                            </Tooltip>
                                        </Dropdown>
                                    </Space>
                                    
                                    <Space direction="vertical" align="center" className="hq-full-width">
                                        <img
                                            alt={Code}
                                            src={Base_ImageURL}
                                            className="hq-img-size-1"
                                        />
                                    </Space>

                                    <Space
                                        size={'large'}
                                    >   
                                        <p>{qType}</p>
                                        <p>-</p>
                                        <p>{qTopic}</p>
                                        <p>-</p>
                                        <p style={{borderBottom:1, borderBottomStyle:'solid', borderBottomColor:LevelOfDifficulty.HexColor}}>{LevelOfDifficulty.Name}</p>
                                    </Space>
                                </Space>
                            </div>
                            )
                    }}
                />
            </div>
        )
    }

    const renderAssignedQuestions = () => {

        return(
            <div className="hq-full-width">
                {isLoadinggQuestionsAssignedInformation && <Skeleton/>}

                {errorGetQuestionsAssignedInformation && !isLoadinggQuestionsAssignedInformation &&
                    <ErrorComponent 
                        error={errorGetQuestionsAssignedInformation}
                        onReload={() => getAllQuestionsAssignedInformation(info)}
                    />
                }

                {!(isLoadinggQuestionsAssignedInformation && errorGetQuestionsAssignedInformation) && renderAssignedQuestionsList()}
            </div>
        )
    }

    const renderReassignQuestions = () => {

        return(
            <Space>
                <Select
                    className="reassign-questions-select-info"
                    onChange={(v, option) => {
                        const findL = informationList.filter(l => l.Id === option.value)[0]
                        setSelectedReassignInfo(findL)
                    }}
                    defaultValue={'please select'}
                    value={(selectedReassignInfo || {'Code': 'please select'}).Code}

                        
                    options={(informationList || [])
                    .filter(a => a.Id !== info.Id)
                    .map((d) => ({
                            value: d.Id,
                            label: d.Code
                        }))}
                />

                <Button 
                    size="small"
                    type="primary"
                    onClick={() => {
                        if(!selectedReassignInfo){
                            messageApi.destroy()
                            messageApi.warning("Please select an explanation")
                            return
                        }

                        if(!selectedReassignQuestions.length){
                            messageApi.destroy()
                            messageApi.warning("Please select questions to perform this action")

                            return
                        }

                        let data = new FormData()

                        data.append("Id", selectedReassignInfo.Id)

                        for(let q of selectedReassignQuestions){
                            data.append("QuestionIds", q.Id)
                        }

                        assignQuestionsInformation(data)
                        .then(r => handleResponse(r, messageApi, 'Assigned successfully', 1, () => {
                            onClose()
                            reloadData()
                        }))
                    }}

                    loading={isLoadingAssignQuestionsInformation}
                >
                    ({selectedReassignQuestions.length}){' '}Reassign
                </Button>
                &nbsp;
                &nbsp;
                &nbsp;
                <Button 
                    size="small"
                    type="primary"
                    onClick={() => {
                        if(!selectedReassignQuestions.length){
                            messageApi.destroy()
                            messageApi.warning("Please select questions to perform this action")

                            return
                        }

                        let data = new FormData()

                        for(let q of selectedReassignQuestions){
                            data.append("QuestionIds", q.Id)
                        }

                        unassignQuestionsInformation(data)
                        .then(r => handleResponse(r, messageApi, 'Unassigned successfully', 1, () => {
                            onClose()
                            reloadData()
                        }))
                    }}

                    loading={isLoadingUnassignQuestionsInformation}
                >
                    Unassign
                </Button>
            </Space>
        )
    }

    return(
        <div>
            {contextHolder}
            <Drawer
                title={
                    <Space size={'large'}>
                        <p>Assigned questions</p>
                        {selectedReassignQuestions.length ? renderReassignQuestions() : <div/>}

                    </Space>
                }
                width={'60%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}

                footer={
                    <Space size={'large'}>
                        <small className="default-gray">Explanation</small>
                        <small className="default-title">{info.Code}</small>
                    </Space>
                }

                maskClosable={false}
            >
                {renderAssignedQuestions()}

                <QuestionPlayPocket 
                    open={showPlayQuestionModal}
                    onClose={() => setShowPlayQuestionModal(false)}

                    Id={selectedQuestion.Id}
                    Type={selectedQuestion.Type}
                />
            </Drawer>
        </div>
    )
}