import {Divider, Drawer, Dropdown, List, Space} from "antd";
import React from "react"
import {ArrowLeftOutlined, EditOutlined, TrophyOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { QuestionPlayPocket } from "../Questions/QuestionPlayPocket/QuestionPlayPocket";
import { useState } from "react";

export function ViewSubtopicQuestions({open, onClose, subtopic, reloadData}){

    if(!open) return <div/>;

    const navigate = useNavigate()

    const [selectedQuestion, setSelectedQuestion] = useState({})
    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)


    const questionActionList = (q) => [{
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

    return(
        <div>
            <Drawer
                title={"View subtopic questions"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{
                paddingBottom: 80,
                }}
                closeIcon={<ArrowLeftOutlined />}
            >
                <div className="subtopic-questions-modal-list">
                    <List 
                        dataSource={subtopic.Questions.sort((a, b) => a.Code > b.Code ? 1:-1)}
                        renderItem={(q, qi) => (
                            <div key={q.Id} className="info-line-subtopic-view-questions">
                                <Dropdown
                                    menu={{
                                        items:questionActionList(q),
                                        title:'Actions'
                                    }}
                                >
                                    <p className="default-gray hoverable-plus">
                                        <span className="default-gray">{qi+1}{' '}</span>
                                        {q.Code}
                                    </p>
                                </Dropdown>
                                
                                <img 
                                    src={q.Base_ImageURL}
                                    className="question-image-subtopic-view-questions"
                                    alt={q.Code}
                                /> 
                            </div>
                        )}
                    />
                </div>
                <Divider />
                <Space>
                    <p className="default-gray">
                        {subtopic.Topic.Name} 
                    </p>
                    <p className="default-title">
                            {subtopic.Name}
                    </p>
                </Space>
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