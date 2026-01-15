import React, { useEffect, useState } from "react";
import {Button, Drawer, Form, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function UpdateVTLatexText({open, onClose, vtTerm, reloadQuestion}) {

    if(!open) return <div/>;
    const {isLoadingEditFBDVectorTerm, editFBDVectorTerm,} = useQuestions()


    const [newLatex, setNewLatex] = useState('')

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            const {LatexText} = vtTerm

            setNewLatex(LatexText)
        }
    }, [open])

    return(
        <Drawer
        title="Update Vector Term LaTeX Text"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<div/>}
    >   
        {contextHolder}
        <Form>
            <Form.Item>
                <small className="default-gray">LaTeX text</small>
                <TextArea 
                    value={newLatex}
                    onChange={(v) => {
                        const value = v.target.value
                        setNewLatex(value)
                    }}
                />
                <small className="default-gray">You can delete the text by simply entering empty input</small>
            </Form.Item>
            <small className="default-gray">LaTeX rendering</small>
            <LatexRenderer latex={newLatex}/>
        </Form> 
        <br/>
        <br/>
        <Button 
            size="small"
            type="primary"

            loading={isLoadingEditFBDVectorTerm}

            onClick={() => {
                let VM = {...vtTerm}
                VM.LatexText = newLatex

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