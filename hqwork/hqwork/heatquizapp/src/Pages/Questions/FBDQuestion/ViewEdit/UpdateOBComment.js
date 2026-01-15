import React, { useEffect, useState } from "react";
import {Button, Drawer, Space, message, Divider } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { FixURL, handleResponse } from "../../../../services/Auxillary";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { AddCommentComponent } from "../../../../Components/AddCommentComponent.js/AddCommentComponent";

import "./index.css"

export function UpdateOBComment({open, onClose, OB, reloadQuestion}) {

    if(!open) return <div/>;

    const { isLoadingEditFBDObjectBodyComment, editFBDObjectBodyComment,} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const [newComment, setNewComment] = useState(null)

    const {Comment, Color, Base_ImageURL, dimesions, smallImageWidth, smallImageHeight} = OB

    useEffect(() => {
        if(open){
            setNewComment(Comment)
        }
    }, [open])
    
    return(
        <Drawer
        title={
        <Space>
            <p>Update Object Body Comment</p>
            <Button
                size="small"
                type="primary"

                loading={isLoadingEditFBDObjectBodyComment}

                onClick={() => {
                    let VM = {...OB}
                    VM.Comment = newComment

                    editFBDObjectBodyComment(VM).then(r => handleResponse(r, api, 'Updated', 1, () => {
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
                <div 
                    style = {{
                        height:smallImageHeight,
                        width: smallImageWidth,
                        backgroundImage: `url(${FixURL(Base_ImageURL)})`,
                        backgroundPosition:'center',
                        backgroundRepeat:'no-repeat',
                        backgroundSize:'contain',
                        border:'1px solid gainsboro'
                    }}>
                        <div style={{...dimesions, position:'relative', border:'1px solid #28a745' }}>
                            <div style={{width:'100%', height:'100%', backgroundColor:Color,}}></div>
                        </div>    
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