import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, SmileOutlined, MailOutlined} from '@ant-design/icons';
import { useAuth } from "../../contexts/AuthContext";
import { Button, Drawer, Result, Space, message } from "antd";

import './StudentFeedback.css'
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../Components/LatexRenderer";
import { useStudentFeedback } from "../../contexts/StudentFeedbackContext";

export function SendFeedback({open, onClose, question}){
    const {currentPlayerKey} = useAuth()

    const { loadingAddFeedback, addFeedbackError, addFeedback} = useStudentFeedback()

    const [newText, setNewText] = useState('')
    const [feedhackWasSent, setFeedhackWasSent] = useState(false)

    const [messageApi, contextHolder] = message.useMessage();


    useEffect(() => {
        setNewText('')
        setFeedhackWasSent(false)
    }, [open])

    useEffect(() => {
        if(addFeedbackError){
            messageApi.destroy()

            messageApi.warning(addFeedbackError)
        }

    }, [addFeedbackError])

    const renderThanksForFeedback = () => {

        return(
            <Result
                status="success"
                title="Thanks a lot for your feedback"
                subTitle="Your feedback is truly appreciated"
                extra={[
                    <SmileOutlined style={{color:'green', fontSize:'large'}}/>
                ]}
            />
        )
    }

    const renderSendFeedback = () => {
        return(
            <div>
                <small
                    className="add-comment-player-name"
                >
                    Writing feedback as 
                    <span className="add-comment-player-name-bold">
                        {currentPlayerKey}
                    </span>

                </small>
                <TextArea  
                    type="text"
                    placeholder="Send feedback for the question below, max charachter count is 500 ..."
                    value={newText}
                    onChange={(v) => setNewText(v.target.value)}
                    maxLength={500}
                    showCount = {true}
                    cols={10}
                    className="question-feedback-add-comment-text-input"
                />
                <br/>
                <br/>
                <Button
                    size="small"
                    onClick={() => {
                        let data = new FormData()

                        data.append("QuestionId", question.Id)
                        data.append("Feedback", newText.trim())
                        data.append("Player",  currentPlayerKey)

                        addFeedback(data).then(() => {
                            setFeedhackWasSent(true)
                        })
                    }}

                    loading={loadingAddFeedback}
                >
                    <MailOutlined />
                    Send
                </Button>
            </div>
        )
    }

    return(
    <Drawer
        title="Student feedback"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}

        footer={
            <div>
                    <p className="default-totöe">{question.Code}</p>
                    <Space size={'large'} align="start">
                        <div>
                            <img
                                src = {question.Base_ImageURL}
                                alt="question"
                                className="question-feedback-image"
                                
                            />
                        </div>
                        <div>
                            {question.Latex && <LatexRenderer latex={question.Latex}/>}
                        </div>
                    </Space>
            </div>
        }
    >   
        {contextHolder}
        {!feedhackWasSent && renderSendFeedback()}
        {feedhackWasSent && renderThanksForFeedback()}
    </Drawer>
    )
}