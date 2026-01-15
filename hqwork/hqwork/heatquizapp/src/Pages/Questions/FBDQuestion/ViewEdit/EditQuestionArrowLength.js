import { Button, Drawer, Input, Space, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

import './index.css'
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function EditQuestionArrowLength({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const {isLoadingEditFBDArrowLength, editFBDArrowLength,} = useQuestions()

    const [newLength, setNewLength] = useState(1)

    const {ArrowLength} = question

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            setNewLength(ArrowLength || 1)
        }
    }, [open])

    return(
        <Drawer
        title="Edit Question Arrow Length"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <div>
            <p className="default-title">{question.Code}</p>
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
            <Input 
                type="number"
                value={newLength}
                onChange={(v) => {
                    const value = v.target.value

                    if(value < 1) return;

                    setNewLength(value)
                }}

                suffix="px"
            />
        </Space>

        <br/>
        <br/>
        
        <Button
            size="small"
            type="primary"
            onClick={() => {
                if(newLength < 1){
                    api.destroy()
                    api.warning('Please add valid arrow length')

                    return
                }

                let data = new FormData()
                data.append('QuestionId', question.Id)
                data.append('Length', newLength)

                editFBDArrowLength(data)
                .then((r) => handleResponse(r, api, 'Updated successfully', 1, () => {
                    onClose()
                    reloadQuestion()
                }))
                
            }}

            loading={isLoadingEditFBDArrowLength}
        >
            Update
        </Button>
        </Drawer>
    )
}