import React, { useEffect, useState } from "react";
import {Button, ColorPicker, Drawer, Form, Space, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function UpdateVTColor({open, onClose, vtTerm, reloadQuestion}) {

    if(!open) return <div/>;
    const {isLoadingEditFBDVectorTermColor, editFBDVectorTermColor} = useQuestions()


    const [newColor, setNewColor] = useState('')

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            const {ArrowColor} = vtTerm

            setNewColor(ArrowColor)
        }
    }, [open])

    const {Linear, Code, Latex, Angle} = vtTerm

    return(
        <Drawer
        title="Update Vector Term Arrow Color"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<div/>}
    >   
        {contextHolder}
        <Space size={"large"} align="start">
            <div>
                <p className="default-title">{Code}</p>
                <LatexRenderer latex={"$$" + Latex + "$$"} />
            </div>
            &nbsp;
            &nbsp;
            {Linear ? 
                <VectorDirectionComponent 
                    angleStep={5}
                    currentAngle={Angle}
                    widthHeight={0.03*window.innerWidth}
                    onUpdateAngle={(a) => {}}
                /> : <div/>}
        </Space>
        <br/>
        <Form>
            <Form.Item>
                <small className="default-gray">New arrow color</small>
                <br/>
                <Space>
                    <ColorPicker
                        value={newColor}
                        defaultValue={newColor} 

                        onChange={(c, h) => setNewColor(h)}

                        showText = {true}
                    />
                    <p className="highlighted">{newColor}</p>
                </Space>
            </Form.Item>
        </Form> 

        <br/>
        <Button 
            size="small"
            type="primary"

            loading={isLoadingEditFBDVectorTermColor}

            onClick={() => {
                let VM = {...vtTerm}
                VM.ArrowColor = newColor

                editFBDVectorTermColor(VM).then(r => handleResponse(r, api, 'Updated', 1, () => {
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