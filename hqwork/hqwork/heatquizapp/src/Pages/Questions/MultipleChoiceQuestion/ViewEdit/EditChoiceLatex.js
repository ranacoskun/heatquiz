import { Button, Drawer, Space, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";
import { useQuestions } from "../../../../contexts/QuestionsContext";

import './index.css'
import { handleResponse } from "../../../../services/Auxillary";

export function EditChoiceLatex({open, onClose, choice, question, reloadQuestion}){

    if(!open) return <div/>;

    const [newLatex, setNewLatex] = useState('')

    const {Latex, Correct, ImageURL, index} = choice

    const [api, contextHolder] = message.useMessage()
    const {isLoadingEditMultipleChoiceQuestionChoice, editMultipleChoiceQuestionChoice} = useQuestions()

    useEffect(() => {
        if(open){
            setNewLatex(Latex || '')
        }
    }, [open])

    return(
        <Drawer
        title="Edit choice LaTeX"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <Space
                size={'large'}
                align="start"
            >
                <p 
                    className={Correct ? 'default-green hq-bold-font-weight' : 'default-red hq-bold-font-weight'}
                    >
                    {index+1}
                </p>

                {Latex && <LatexRenderer latex={Latex} />}
                {ImageURL && 
                <img 
                    alt={'Choice' + index + 1}
                    className="multiple-choice-question-edit-view-choice-img"
                    src={ImageURL}
                />}
            </Space>
        }
        >
        {contextHolder}
        <Space
            direction="vertical"
            size={'large'}
            className="hq-full-width"
        >
            <TextArea 
                value={newLatex}
                rows={4} 
                onChange={(v) => setNewLatex(v.target.value)}
            />

            <LatexRenderer latex={newLatex} />
        </Space>

        <br/>
        <br/>
        
        <Button
            size="small"
            type="primary"
            onClick={() => {
                if(!newLatex.trim() && !ImageURL){
                    api.destroy()
                    api.warning('Please provide a LaTeX since this choice has no image')

                    return
                }

                const data = new FormData()
                data.append("QuestionId", question.Id)
                data.append("AnswerId", choice.Id)
                data.append("Latex", newLatex)
                data.append("Correct", Correct)

                editMultipleChoiceQuestionChoice(data)
                .then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                    onClose()
                    reloadQuestion()
                }))
              
            }}

            loading={isLoadingEditMultipleChoiceQuestionChoice}
        >
            Update
        </Button>
        </Drawer>
    )
}