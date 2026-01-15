import {Button, Drawer, Space, Tooltip, message} from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined, CloseCircleFilled } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { Keyboard } from "../../../../Components/Keyboard";

export function AddAnswersToList({open, onClose, selectedKeyboard, onUpdateList, existingList}){

    if(!open) return <div/>;

    const [newList, setNewList] = useState([{
        List:[],
        echoNumber:0
    }])

    const [selectedIndex, setSelectedIndex] = useState(0)

    const [messageApi, contextHolder] = message.useMessage()

    return(
        <Drawer
        title={
            <Space size={'large'}>
                <p>Add answers/terms</p>

                <Button
                    size="small"
                    type="primary"

                    onClick={() => {
                        const termsStatus = newList.map(l => validateKeyboardAnswer(l, true)).filter(a => a).length

                        if(termsStatus){
                            messageApi.destroy()
                            messageApi.warning("All terms should be valid")
                            return
                        }

                        onUpdateList(newList)
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

            const checkTerm = validateKeyboardAnswer(a, true)

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
            isEnergyBalance={true}
        /> : <p className="default-red">Please add new line</p>}
    </Drawer>
    )
}