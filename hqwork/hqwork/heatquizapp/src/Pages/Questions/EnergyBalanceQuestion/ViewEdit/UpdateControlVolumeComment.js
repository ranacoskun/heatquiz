import React, { useEffect, useState } from "react";
import {Button, Drawer, Space, message, Divider } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { FixURL, handleResponse } from "../../../../services/Auxillary";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { AddCommentComponent } from "../../../../Components/AddCommentComponent.js/AddCommentComponent";

import "./index.css"

export function UpdateControlVolumeComment({open, onClose, controlVolume, reloadQuestion}) {

    if(!open) return <div/>;

    const {editEnergyBalanceControlVolumeComment, isLoadingEditEnergyBalanceControlVolumeComment,} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const [newComment, setNewComment] = useState(null)

    const {Correct, Comment, Base_ImageURL, smallImageHeight, smallImageWidth, dimensions} = controlVolume

    useEffect(() => {
        if(open){
            setNewComment(Comment)
        }
    }, [open])
    
    return(
        <Drawer
        title={
        <Space>
            <p>Update Control Volume Comment</p>
            <Button
                size="small"
                type="primary"

                loading={isLoadingEditEnergyBalanceControlVolumeComment}

                onClick={() => {
                    const data = new FormData()
                    data.append('Id', controlVolume.Id)
                    data.append('Comment', newComment)

                    editEnergyBalanceControlVolumeComment(data).then(r => handleResponse(r, api, 'Updated', 1, () => {
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
                        backgroundImage: `url(${FixURL(controlVolume.ImageURL || Base_ImageURL)})`,
                        backgroundPosition:'center',
                        backgroundRepeat:'no-repeat',
                        backgroundSize:'contain',
                        border:'1px solid gainsboro'
                    }}
                >
                    <div style={{...dimensions, position:'relative', border:Correct ? '1px dashed #28a745' : '1px dashed gray' }}>
                        <div style={{width:'100%', height:'100%', backgroundColor:'#f1f4f8', opacity:'40%'}}></div>
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