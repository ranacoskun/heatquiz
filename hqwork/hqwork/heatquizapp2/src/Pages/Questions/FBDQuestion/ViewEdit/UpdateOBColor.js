import React, { useEffect, useState } from "react";
import {Button, ColorPicker, Drawer, Form, Space, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { FixURL, handleResponse } from "../../../../services/Auxillary";
import { calculateCPdimensions } from "./Functions";
import { useQuestions } from "../../../../contexts/QuestionsContext";

export function UpdateOBColor({open, onClose, OB, question, reloadQuestion}) {

    if(!open) return <div/>;

    const {isLoadingEditFBDObjectBodyColor, editFBDObjectBodyColor} = useQuestions()

    const [newColor, setNewColor] = useState('')

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            const {Color} = OB

            setNewColor(Color)
        }
    }, [open])

    const {Base_ImageURL, Base_ImageURL_Width, Base_ImageURL_Height} = question

    const smallImageWidth = window.innerWidth * 0.20
    const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth

    const dimesions = calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height, smallImageWidth, smallImageHeight, OB )

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
        <div 
            style = {{
                height:smallImageHeight,
                width: smallImageWidth,
                backgroundImage: `url(${FixURL(Base_ImageURL)})`,
                backgroundPosition:'center',
                backgroundRepeat:'no-repeat',
                backgroundSize:'contain',
                border:'1px solid gainsboro'
            }}
        >
            <div style={{...dimesions, position:'relative', border:'1px solid #28a745' }}>
                <div style={{width:'100%', height:'100%', backgroundColor:newColor,}}></div>
                </div>    
            </div>
        <br/>
        <Form>
            <Form.Item>
                <small className="default-gray">New color</small>
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

            loading={isLoadingEditFBDObjectBodyColor}

            onClick={() => {
                let VM = {...OB}
                VM.Color = newColor

                editFBDObjectBodyColor(VM).then(r => handleResponse(r, api, 'Updated', 1, () => {
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