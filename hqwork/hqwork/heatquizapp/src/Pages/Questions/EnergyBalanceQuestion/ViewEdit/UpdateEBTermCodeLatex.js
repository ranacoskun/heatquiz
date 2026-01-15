import React, { useEffect, useState } from "react";
import {Button, Drawer, Form, Input, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function UpdateEBTermCodeLatex({open, onClose, ebTerm, reloadQuestion}) {

    if(!open) return <div/>;
    const [newCode, setNewCode] = useState('')
    const [newLatex, setNewLatex] = useState('')

    const { isLoadingEditEnergyBalanceTermCodeLatexText, editEnergyBalanceTermCodeLatexText,} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            const {Code, Latex} = ebTerm

            setNewCode(Code)
            setNewLatex(Latex)
        }
    }, [open])

    return(
        <Drawer
        title="Update EB Term Code/LaTeX"
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
                <small className="default-gray">Code</small>
                <Input 
                    placeholder="New code"
                    value={newCode}
                    onChange={(v) => setNewCode(v.target.value)}
                />
            </Form.Item>
            <br/>
            <Form.Item>
                <small className="default-gray">LaTeX</small>
                <Input 
                    placeholder="New LaTeX"
                    value={newLatex}
                    onChange={(v) => setNewLatex(v.target.value)}
                />
            </Form.Item>
            <LatexRenderer latex={"$$" + newLatex + "$$"}/>
        </Form> 

        <br/>
        <Button 
            size="small"
            type="primary"

            loading={isLoadingEditEnergyBalanceTermCodeLatexText}

            onClick={() => {
                if(!newCode.trim() || !newLatex.trim()){
                    api.destroy()
                    api.warning("Please add values for code and LaTeX")

                    return
                }

                const VM = ({
                    ...ebTerm,
                    Code: newCode,
                    Latex: newLatex
                })

                editEnergyBalanceTermCodeLatexText(VM).then(r => handleResponse(r, api, 'Updated', 1, () => {
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