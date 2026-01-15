import React, { useEffect, useState } from "react";
import {Button, Drawer, Space, message, Divider } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import {handleResponse } from "../../../../services/Auxillary";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { AddCommentComponent } from "../../../../Components/AddCommentComponent.js/AddCommentComponent";

import "./index.css"
import { LatexRenderer } from "../../../../Components/LatexRenderer";

export function UpdateBCICComment({open, onClose, condition, isBoundaryCondition, reloadQuestion}) {

    if(!open) return <div/>;

    const {editEnergyBalanceBCICComment, isLoadingEditEnergyBalanceBCICComment,} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const [newComment, setNewComment] = useState(null)
    const [answerReduced, setAnswerReduced] = useState(null)


    useEffect(() => {
        const {Comment, AnswerElements} = condition

        if(open){
            setNewComment(Comment)

            const _answerReduced = AnswerElements
            .sort((c,d) => c.Id > d.Id ? 1 : -1)
            .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

            setAnswerReduced(_answerReduced)
        }
    }, [open])
    

    
    return(
        <Drawer
        title={
        <Space>
            <p>Update {isBoundaryCondition ? "Boundary" : "Initial"} Condition Comment</p>
            <Button
                size="small"
                type="primary"

                loading={isLoadingEditEnergyBalanceBCICComment}

                onClick={() => {
                    const data = new FormData()
                    data.append('Id', condition.Id)
                    //data.append('IsBoundaryCondition', isBoundaryCondition)
                    data.append('Comment', newComment)

                    editEnergyBalanceBCICComment(data).then(r => handleResponse(r, api, 'Updated', 1, () => {
                        reloadQuestion()
                        onClose()
                    }))
                }}
            >
                Update
            </Button>
        </Space>
        }
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<div/>}
    >   
        {contextHolder}
            <div>
                <div>
                    <small className="default-gray">{isBoundaryCondition ? "Boundary" : "Initial"} Condition</small>
                    <LatexRenderer latex={"$$" + answerReduced + "$$"} />
                </div>
                <Divider/>
                <small className="default-gray">Comment</small>
                <AddCommentComponent 
                    value={newComment}
                    onChange={(v) => setNewComment(v.target.value)}
                    className="edit-eb-question-comment-input"
                />
                <small className="default-gray">You can remove the comment by adding empty text</small>

            </div>
    </Drawer>
    )
}