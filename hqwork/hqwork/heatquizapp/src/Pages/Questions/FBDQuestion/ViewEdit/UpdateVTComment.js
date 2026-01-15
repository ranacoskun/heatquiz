import React, { useEffect, useState } from "react";
import {Button, Drawer, Space, message, Divider } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { FixURL, handleResponse } from "../../../../services/Auxillary";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { AddCommentComponent } from "../../../../Components/AddCommentComponent.js/AddCommentComponent";

import "./index.css"
import { LatexRenderer } from "../../../../Components/LatexRenderer";

export function UpdateVTComment({open, onClose, VT, reloadQuestion}) {

    if(!open) return <div/>;

    const {isLoadingEditFBDVectorTerm, editFBDVectorTerm,} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const [newComment, setNewComment] = useState(null)

    const {Comment, Code, Latex} = VT

    useEffect(() => {
        if(open){
            setNewComment(Comment)
        }
    }, [open])
    
    return(
        <Drawer
        title={
        <Space>
            <p>Update Vector Term Comment</p>
            <Button
                size="small"
                type="primary"

                loading={isLoadingEditFBDVectorTerm}

                onClick={() => {
                   
                    let VM = {...VT}
                    VM.Comment = newComment

                    editFBDVectorTerm(VM).then(r => handleResponse(r, api, 'Updated', 1, () => {
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
                <Space>
                    <p className="default-title">{Code}</p>
                    <LatexRenderer latex={"$$" + Latex + "$$"} />
                </Space>
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