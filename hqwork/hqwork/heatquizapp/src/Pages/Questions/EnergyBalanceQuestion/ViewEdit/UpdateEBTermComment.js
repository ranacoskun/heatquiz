import React, { useEffect, useState } from "react";
import {Button, Drawer, message, Space } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";
import { AddCommentComponent } from "../../../../Components/AddCommentComponent.js/AddCommentComponent";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

export function UpdateEBTermComment({open, onClose, ebTerm, reloadQuestion}) {

    if(!open) return <div/>;
    const [newComment, setNewComment] = useState('')

    const { isLoadingEditEnergyBalanceTermCodeLatexText, editEnergyBalanceTermCodeLatexText,} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const {Code, Latex, Comment} = ebTerm

    useEffect(() => {
        if(open){
            setNewComment(Comment)
        }
    }, [open])


    return(
        <Drawer
        title="Update EB Term Comment"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<div/>}
    >   
        {contextHolder}
        <Space>
            <LatexRenderer latex={"$$" + Latex + "$$"}/>
            <p className="default-title">{Code}</p>
        </Space>
        <br/>
        <small className="default-gray">Comment</small>
        <AddCommentComponent
            value={newComment}
            onChange={(v) => setNewComment(v.target.value)}
            className="edit-eb-question-comment-input"
        />
        <small className="default-gray">You can remove the comment by adding empty text</small>
 
        <br/>
        <br/>
        <Button 
            size="small"
            type="primary"

            loading={isLoadingEditEnergyBalanceTermCodeLatexText}

            onClick={() => {
                const VM = ({
                    ...ebTerm,
                    Comment: newComment
                })

                editEnergyBalanceTermCodeLatexText(VM).then(r => handleResponse(r, api, 'Updated', 1, () => {
                    reloadQuestion()
                    onClose()
                }))
            }}
        >
            Update
        </Button>
    </Drawer>
    )
}