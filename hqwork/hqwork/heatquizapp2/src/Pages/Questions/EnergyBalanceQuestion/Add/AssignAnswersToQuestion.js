import {Button, Drawer, Space, Tabs, Tooltip, message} from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, CloseCircleFilled } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { Keyboard } from "../../../../Components/Keyboard";
import { SelectKeyboardList } from "../../../Keyboards/Shared/SelectKeyboardList";

export function AssignAnswersToQuestion({open, onClose, usedKeyboard, addedAnswers, onUpdateKeyboard, onUpdateAnswers}){

    if(!open) return <div/>;

    const [selectedKeyboard, setSelectedKeyboard] = useState(null)

    const [newList, setNewList] = useState([])

    const [selectedIndex, setSelectedIndex] = useState(0)

    const [currentTab, setCurrentTab] = useState(1)

    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        setNewList(addedAnswers)
        setSelectedKeyboard(usedKeyboard)
    }, [open, addedAnswers])

    const renderSelectedKeyboard = () => {
        return(
            <div 
                className="hq-full-width"
            >
                <SelectKeyboardList 
                    onSelect={(k) => {
                        setSelectedKeyboard(k)
                        onUpdateKeyboard(k)

                        setNewList([{
                            List:[],
                            echoNumber:0
                        }])
                        setSelectedIndex(0)

                        onUpdateAnswers([{
                            List:[],
                            echoNumber:0
                        }])

                        setCurrentTab(2)

                    }}
                />
            </div>
        )
    }

    const renderAddAnswers = () => {
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
            <Space size={'large'}>
                <p>Set answers</p>

                <Button
                    size="small"
                    type="primary"

                    onClick={() => {
                        const termsStatus = newList.map(l => validateKeyboardAnswer(l)).filter(a => a).length

                        if(termsStatus){
                            messageApi.destroy()
                            messageApi.warning("All answers should be valid")
                            return
                        }

                        onUpdateAnswers(newList)
                        onClose()
                    }}

                >
                    Add
                </Button>
            </Space>
        }
        width={'70%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
    >   
        {contextHolder}
        <Tabs 
            items={
            [{
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