import { Button, Drawer, Space, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";

import './index.css'
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function UpdateQuestionLatex({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const {isLoadingEditEnergyBalanceLatex, editEnergyBalanceLatex,} = useQuestions()

    const [newLatex, setNewLatex] = useState('')

    const {QuestionText} = question

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            setNewLatex(QuestionText || '')
        }
    }, [open])

    return(
        <Drawer
        title="Edit question LaTeX"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <div>
            <p className="question-code">{question.Code}</p>
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
        <Space
            direction="vertical"
            size={'large'}
            className="hq-full-width"
        >
            <div>
                <TextArea 
                    value={newLatex}
                    rows={4} 
                    onChange={(v) => setNewLatex(v.target.value)}
                />
                <small className="default-gray">You can remove the question body by updating with a blank text</small>
            </div>

            <LatexRenderer latex={newLatex} />
        </Space>

        <br/>
        <br/>
        
        <Button
            size="small"
            type="primary"
            onClick={() => {
                const VM = ({
                    Id: question.Id,
                    QuestionText: newLatex
                })

                editEnergyBalanceLatex(VM)
                .then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                    onClose()
                    reloadQuestion()
                }))
                
            }}

            loading={isLoadingEditEnergyBalanceLatex}
        >
            Update
        </Button>
        </Drawer>
    )
}