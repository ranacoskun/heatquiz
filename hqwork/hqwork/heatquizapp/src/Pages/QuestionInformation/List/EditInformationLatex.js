import { Button, Divider, Drawer, Space, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import TextArea from "antd/es/input/TextArea";

import './index.css'
import { useAssistanceObjects } from "../../../contexts/AssistanceObjectsContext";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { handleResponse } from "../../../services/Auxillary";

export function EditInformationLatex({open, onClose, info, reloadData}){

    if(!open) return <div/>;

    const { isLoadingEditQuestionInformationLatex, editQuestionInformationLatex} = useAssistanceObjects()

    const [newLatex, setNewLatex] = useState('')

    const {Latex} = info

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            setNewLatex(Latex || "")
        }
    }, [open])

    const {PDFURL} = info

    return(
        <Drawer
        title="Edit explanation LaTeX content"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <div>
                <p className="default-title">{info.Code}</p>
            </div>
        }
        >
        {contextHolder}
        {PDFURL &&
        <p className="default-title highlighted">{' '}LaTeX can be removed by updating with an empty string{' '}</p>}

        <Divider orientation="left">
            LaTex 
        </Divider>
        <Space
            direction="vertical"
            size={'large'}
            className="hq-full-width"
        >
            <TextArea 
                value={newLatex}
                rows={4} 
                onChange={(v) => setNewLatex(v.target.value)}
            />

            <LatexRenderer latex={newLatex} />
        </Space>

        <br/>
        <br/>
        
        <Button
            size="small"
            type="primary"
            onClick={() => {
                if(!newLatex.trim() && !PDFURL){
                    api.destroy()
                    api.warning('Please add LaTeX content')

                    return
                }

                const data = new FormData()

                data.append('Id', info.Id)
                data.append('Latex', newLatex)

                editQuestionInformationLatex(data)
                .then((r) => handleResponse(r, api, 'Updated successfully', 1, () => {
                    onClose()
                    reloadData()
                }))
                
            }}

            loading={isLoadingEditQuestionInformationLatex}
        >
            Update
        </Button>
        </Drawer>
    )
}