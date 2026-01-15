import React, { useEffect, useState } from "react";
import {Button, Divider, Drawer, message, Space} from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";
import Input from "antd/es/input/Input";
import { getNameForRelationNum } from "../Shared/Functions";

export function UpdateConditionComment({open, onClose, condition, reloadQuestion}) {

    if(!open) return <div/>;
    const [newComment, setNewComment] = useState('')

    const { editPVDiagramQuestionConditionComment, isLoadingEditPVDiagramQuestionConditionComment,} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            const {Comment} = condition

            setNewComment(Comment)
        }
    }, [open])

    const renderHeader = () => {
        const {IsPoint} = condition

        if(IsPoint){
            const {Name} = condition
            return(
                <div>
                    <Space
                        align="start"
                        size="large"
                    >
                        <small
                            className="default-gray"
                        >
                        Point {' '}
                            <span
                                className="default-title"
                            >
                            {Name}
                            </span>
                        </small>
                    </Space>
                </div>
            )
        }
        else{
            const {FirstPoint, SecondPoint, Value, Type} = condition

            const relationName = getNameForRelationNum(Type)


            const {Name: n1} = FirstPoint
            const {Name: n2} = SecondPoint
            
            return(
                <div>
                    <Space
                        align="center"
                        size="small"
                    >
                        <small className="default-gray default-smaller">{relationName}</small>

                        &nbsp;&nbsp;
                
                        <small className="default-gray">Point <span className="default-title">{n1}</span></small> 

                        <small className="default-title">{Value}</small>

                        <small className="default-gray">Point <span className="default-title">{n2}</span></small> 
                                                        
                    </Space>
                </div>
            )
        }
    }

    return(
        <Drawer
        title={
        <Space size="large">
            <p>Update Condition Comment</p>
            <Button 
                size="small"
                type="primary"

                loading={isLoadingEditPVDiagramQuestionConditionComment}

                onClick={() => {
                    const {Id, IsPoint, IsPositionComment} = condition

                   const data = new FormData()

                   data.append("Id", Id)
                   data.append("IsPoint", IsPoint || false)
                   data.append("IsPositionComment", IsPositionComment || false)

                   data.append("Comment", newComment)

                   editPVDiagramQuestionConditionComment(data).then(r => handleResponse(r, api, "Updated successfuly", 1, () => {
                       onClose()
                       reloadQuestion()
                   }))
                }}
            >
                Update
            </Button>
        </Space>}
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<div/>}
    >   
        {contextHolder}
        <Space align="start">
            {renderHeader()}
        </Space>       
        <Divider/>
        <Space direction="vertical" size="large" align="start">
            <div>
                <p className="default-gray">Comment</p>
                <Input
                    value={newComment}
                    className="hq-full-width"

                    onChange={(v) => {
                        const value = v.target.value

                        setNewComment(value)
                    }}
                />
                <small className="default-gray">Comment can be removed by adding an empty text</small>
            </div>
            
        </Space>
        
    </Drawer>
    )
}