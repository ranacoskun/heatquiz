import React, { useEffect, useState } from "react";
import {Alert, Button, Drawer, Form, Input, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function UpdateEBTermQuestionLatex({open, onClose, ebTermQuestion, reloadQuestion}) {

    if(!open) return <div/>;
    const [newCode, setNewCode] = useState('')

    const [api, contextHolder] = message.useMessage()

    const {isLoadingEditEnergyBalanceEBT_Question_Latex, editEnergyBalanceEBT_Question_Latex,} = useQuestions()

    useEffect(() => {
        if(open){
            const {LatexCode} = ebTermQuestion

            setNewCode(LatexCode)
        }
    }, [open])

    return(
        <Drawer
        title="Update EB Term Question LaTeX"
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
                <small className="default-gray">LaTeX</small>
                <Input 
                    placeholder="New code"
                    value={newCode}
                    onChange={(v) => setNewCode(v.target.value)}
                />
            </Form.Item>
   
            <LatexRenderer latex={"$$" + newCode + "$$"}/>
        </Form> 

        <br/>
        <Button 
            size="small"
            type="primary"

            loading={isLoadingEditEnergyBalanceEBT_Question_Latex}

            onClick={() => {
                let VM = {...ebTermQuestion}
                VM.LatexCode = newCode

                editEnergyBalanceEBT_Question_Latex(VM).then(r => handleResponse(r, api, 'Updated', 1, () => {
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