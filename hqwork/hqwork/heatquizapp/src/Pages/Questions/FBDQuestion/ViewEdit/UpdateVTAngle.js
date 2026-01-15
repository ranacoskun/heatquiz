import React, { useEffect, useState } from "react";
import {Button, Divider, Drawer, Space, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";
import { VectorRotationTool } from "../Shared/VectorRotationTool";

export function UpdateVTAngle({open, onClose, vtTerm, reloadQuestion}) {

    if(!open) return <div/>;
    const {isLoadingEditFBDVectorTerm, editFBDVectorTerm,} = useQuestions()


    const [newAngle, setNewAngle] = useState(0)

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            const {Angle} = vtTerm

            setNewAngle(Angle)
        }
    }, [open])

    const {Code, Latex, Angle} = vtTerm

    return(
        <Drawer
        title="Update Vector Term Angle"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<div/>}
    >   
        {contextHolder}
        <Space
            align="center"
        >
                <p className="default-title">{Code}</p>
                <LatexRenderer latex={"$$" + Latex + "$$"} />
        </Space>
        <Divider />
        <Space align="start" size="large">
            <Space
                direction="vertical"
                align="center"
            >
                    <small className="default-gray">Current value</small>
                    <VectorRotationTool 
                        currentAngle={Angle}
                        wh={100}
                        onUpdate={(a) => {}}
                        noUpdate
                    />
            </Space>
            &nbsp;
            &nbsp;
            &nbsp;
            <Space
                direction="vertical"
                align="center"
            >
                    <small className="default-title">New value</small>
                    <VectorRotationTool 
                        currentAngle={Angle}
                        wh={150}
                        onUpdate={(a) => {setNewAngle(a)}}
                    />
            </Space>
        </Space>
        
        
        <br/>
        <br/>
       
        <Button 
            size="small"
            type="primary"

            loading={isLoadingEditFBDVectorTerm}

            onClick={() => {
                let VM = {...vtTerm}
                VM.Angle = newAngle

                editFBDVectorTerm(VM).then(r => handleResponse(r, api, 'Updated', 1, () => {
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