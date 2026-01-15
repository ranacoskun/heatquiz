import {Drawer, Dropdown, List, Skeleton, Space } from "antd";
import React from "react";
import {ArrowLeftOutlined, EditOutlined, TrophyOutlined} from '@ant-design/icons';
import { useEffect } from "react";

import { useKeyboard } from "../../../contexts/KeyboardContext";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { QUESTION_TYPES_SEARCH_NAMES } from "../../Questions/List/constants";
import { QuestionPlayPocket } from "../../Questions/QuestionPlayPocket/QuestionPlayPocket";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ViewKeyboardAssignedQuestions({open, onClose, keyboard}){

    if(!open) return <div/>;

    const {isLoadingKeyboardQuestions, keyboardQuestions, errorGetKeyboardQuestions, getKeyboardQuestions} = useKeyboard()

    const [selectedQuestion, setSelectedQuestion] = useState({})
    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if(open){
            getKeyboardQuestions(keyboard.Id)
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

    const numberOfQuestions = () => {
        if(keyboardQuestions){
            const {KeyboardQuestions: KQs} = keyboardQuestions

            return (KQs.length + " ")
        }

        return ''

    }

    const renderQuestions = () => {
        const {KeyboardQuestions: KQs} = keyboardQuestions

        return(
            <Space direction="vertical" size={'large'}>
                
                <List 
                    dataSource={KQs}
                    renderItem={(q, qi) => {
                        const {Id, Type, Code, Base_ImageURL, Subtopic, LevelOfDifficulty} = q

                        const qType = QUESTION_TYPES_SEARCH_NAMES.filter(a => a.value === Type)[0].label
                        const qTopic = Subtopic.Topic.Name

                        return(
                            <div 
                                key={Id}
                                className="hq-full-width hq-element-container"
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
                                            <p className="hoverable-plus">{Code}</p>
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
            </Space>
        )
    }


    const nQuestions = numberOfQuestions()

    return(
        <div>
            <Drawer
                title={"Questions list"}
                width={'40%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}

                footer={
                    <Space size={"large"}>
                        <small className="default-gray"><strong>{nQuestions}</strong> Questions assigned to keyboard</small>

                        <small className="default-title">{keyboard.Name}</small>
                    </Space>
                }
            >
                {isLoadingKeyboardQuestions && <Skeleton />}
                {errorGetKeyboardQuestions && !isLoadingKeyboardQuestions && 
                    <ErrorComponent 
                        error={errorGetKeyboardQuestions}
                        onReload={() => getKeyboardQuestions(keyboard.Id)}
                    />
                }

                {!(isLoadingKeyboardQuestions || errorGetKeyboardQuestions) && keyboardQuestions && renderQuestions()}

            </Drawer>
            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />
        </div>
    )
}