import React, { useEffect, useState } from "react";
import {Button, Drawer, Form, Input, Space, Tabs, Tooltip, message } from "antd";
import {ArrowLeftOutlined, CloseCircleFilled } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { SelectKeyboardList } from "../../../Keyboards/Shared/SelectKeyboardList";
import { Keyboard } from "../../../../Components/Keyboard";
import { validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function AddEbTermQuestion({open, onClose, ebTerm, reloadQuestion}) {

    if(!open) return <div/>;

    const {isLoadingAddEnergyBalanceEBT_Question, addEnergyBalanceEBT_Question} = useQuestions()

    const [newLatex, setNewLatex] = useState('')
    const [selectedKeyboard, setSelectedKeyboard] = useState(null)

    const [newList, setNewList] = useState([])

    const [selectedIndex, setSelectedIndex] = useState(0)

    const [currentTab, setCurrentTab] = useState(1)

    const [api, contextHolder] = message.useMessage()

    const renderSelectedKeyboard = () => {
        return(
            <div 
                className="hq-full-width"
            >
                <SelectKeyboardList 
                    onSelect={(k) => {
                        setSelectedKeyboard(k)

                        setNewList([{
                            List:[],
                            echoNumber:0
                        }])

                        setSelectedIndex(0)

                        setCurrentTab(2)
                    }}
                />
            </div>
        )
    }

    const renderAddAnswers = () => {
        if(!selectedKeyboard){
            return(
                <div>
                    <p className="default-red">Please select a keyboard</p>
                </div>
            )
        }

        return(
            <div className="hq-full-width">
            <p
                        className="default-green hq-clickable"
                        onClick={() => {
                            let _terms = [...newList]

                            _terms.push({
                                List:[],
                                echoNumber:0
                            })

                            setSelectedIndex(_terms.length - 1)

                            setNewList(_terms)
                        }}
                    >Add new line</p>

                    {newList.map((a, ai) => {

                        const {List} = a

                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                        const checkTerm = validateKeyboardAnswer(a)

                        const termSelected = (ai === selectedIndex)

                        return(
                            <Space
                                key={ai}
                                className="hq-full-width"
                                direction="vertical"
                            >
                                <Space>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove term</p>}
                                        color="white"
                                    >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                let _terms = [...newList]

                                                _terms = _terms.filter((t, ti) => ai !== ti)
                                                setNewList(_terms)

                                                setSelectedIndex(0)
                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <p 
                                    onClick={() => setSelectedIndex(ai)}
                                    className={"hoverable-plus " + (termSelected ? "default-title highlighted" : "default-gray")}>{ai+1}</p>
                                    &nbsp;
                                    <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                </Space>

                                <small className="default-red">{checkTerm}</small>
                            </Space>
                        )
                    })}

                    <br/>
                    <br/>
                    {newList.length ?
                    <Keyboard
                        Id={selectedKeyboard.Id}
                        List={newList[selectedIndex]}
                        onEnterKey={(l) => {
                            let _terms = [...newList]

                            _terms[selectedIndex] = l
                            setNewList(_terms)
                        }}
                    /> : <p className="default-red">Please add new line</p>}
            </div>
        )
    }

    return(
        <Drawer
        title={
        <Space
            size={"large"}
        >
            <p>Add EB Term Question</p>
            <Button 
                size="small"
                type="primary"

                loading={isLoadingAddEnergyBalanceEBT_Question}

                onClick={() => {
                    let data = new FormData()

                    data.append('TermId', ebTerm.Id)
                    data.append('QuestionCodeLateX', newLatex)
                    data.append('Infow', true)
                    data.append('KeyboardId', selectedKeyboard.Id)
                    data.append('Answers', JSON.stringify(newList.map((a) => ({
                        AnswerElements: a.List.map((e,i) => (
                            {
                                NumericKeyId: e.NumericKeyId,
                                ImageId: e.VariableImageId,
                                Value:e.char,
                                Id: i,
                                Order:i
                            }))}
                        ))))

                    addEnergyBalanceEBT_Question(data).then(r => handleResponse(r, api, 'Added', 1, () => {
                        reloadQuestion()
                        onClose()
                    }))
                }}
            >
                Add
            </Button>
        </Space>}

        width={'100%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
        <Space>
            <LatexRenderer latex={"$$" + ebTerm.Latex + "$$"}/>
            <p className="default-title">{ebTerm.Code}</p>
        </Space>}
    >   
        {contextHolder}
        <Form>
            <Form.Item>
                <small className="default-gray">LaTeX code</small>
                <Input
                    placeholder="New LaTeX"
                    value={newLatex}
                    onChange={(v) => setNewLatex(v.target.value)}
                />
            </Form.Item>
            <LatexRenderer latex={"$$" + newLatex + "$$"}/>
        </Form> 
        <Tabs 
            items={[{
                key:1,
                label:'Select keyboard',
                children: <div>{renderSelectedKeyboard()} </div>
            },
            {
                key:2,
                label:'Add answers',
                children: <div>{renderAddAnswers()} </div>
            }]}

            activeKey={currentTab}
            onChange={(s) => {
                if(s === 2 && !newList.length){
                    let _terms = [...newList]

                    _terms.push({
                        List:[],
                        echoNumber:0
                    })

                    setSelectedIndex(_terms.length - 1)

                    setNewList(_terms)
                }

                setCurrentTab(s)
            }}
        />

        
    </Drawer>
    )
}