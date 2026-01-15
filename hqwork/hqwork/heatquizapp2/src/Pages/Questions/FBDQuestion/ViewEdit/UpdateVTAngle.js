import React, { useEffect, useState } from "react";
import {Button, Drawer, Space, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

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
            size={'large'}
            align="start"
        >
            <Space
                direction="vertical"
                align="center"
            >
                <p className="default-gray">Original Info</p>
                <Space size={"large"} align="start">
                    <div>
                        <p className="default-title">{Code}</p>
                        <LatexRenderer latex={"$$" + Latex + "$$"} />
                    </div>
                    &nbsp;
                    &nbsp;
                    <VectorDirectionComponent 
                        angleStep={5}
                        currentAngle={Angle}
                        widthHeight={0.03*window.innerWidth}
                        onUpdateAngle={(a) => {}}
                    />
                </Space>
            </Space>
            &nbsp;
            &nbsp;
            <Space
                direction="vertical"
                align="center"
            >
                <p className="default-gray">New angle</p>
                <VectorDirectionComponent 
                    angleStep={5}
                    currentAngle={newAngle}
                    widthHeight={0.06*window.innerWidth}
                    onUpdateAngle={(a) => {setNewAngle(a)}}
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