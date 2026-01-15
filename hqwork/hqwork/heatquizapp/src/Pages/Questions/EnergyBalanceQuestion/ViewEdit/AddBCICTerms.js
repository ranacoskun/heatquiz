import {Button, Drawer, Space, Tooltip, message} from "antd";
import React, {useEffect, useState } from "react";
import {ArrowLeftOutlined, CloseCircleFilled } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { Keyboard } from "../../../../Components/Keyboard";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function AddBCICTerms({open, onClose, usedKeyboard, IsBC, question, reloadQuestion}){

    if(!open) return <div/>;

    const {
        isLoadingAddEnergyBalanceBC, addEnergyBalanceBC,
        isLoadingAddEnergyBalanceIC, addEnergyBalanceIC,} = useQuestions()

    const [newList, setNewList] = useState([{
        List:[],
        echoNumber:0
    }])

    const [selectedIndex, setSelectedIndex] = useState(0)

    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            setNewList([{
                List:[],
                echoNumber:0
            }])
        }
    }, [open])

    return(
        <Drawer
        title={
            <Space size={'large'}>
                <p>Add {IsBC ? "Boundary " : "Initial "} Conditions</p>

                <Button
                    size="small"
                    type="primary"

                    loading = {isLoadingAddEnergyBalanceBC || isLoadingAddEnergyBalanceIC}

                    onClick={() => {

                        if(!newList.length){
                            messageApi.destroy()
                            messageApi.warning("Please add lines")

                            return
                        }

                        const checkAnswers = newList.filter(a => validateKeyboardAnswer(a, true)).length

                        if(checkAnswers){
                            messageApi.destroy()
                            messageApi.warning("Please check added answers")

                            return
                        }

                        const data = new FormData()

                        data.append('QuestionId', question.Id)

                        const lines = newList.map((a) =>(
                            {
                                AnswerElements: a.List.map((e,i) => (
                                {
                                    NumericKeyId: e.NumericKeyId,
                                    ImageId: e.ImageId,
                                    Value:e.char,
                                    Order: i
                                }
                            ))}))


                        console.log(lines)

                        data.append('Answers', JSON.stringify(lines))

                        if(IsBC){
                            addEnergyBalanceBC(data).then(r => handleResponse(r, messageApi, 'Added', 1, () => {
                                reloadQuestion()
                                onClose()
                            }))
                        }
                        else{
                            addEnergyBalanceIC(data).then(r => handleResponse(r, messageApi, 'Added', 1, () => {
                                reloadQuestion()
                                onClose()
                            }))
                        }                       
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
                        Id={usedKeyboard.Id}
                        List={newList[selectedIndex]}
                        onEnterKey={(l) => {
                            console.log(l)
                            let _terms = [...newList]

                            _terms[selectedIndex] = l
                            setNewList(_terms)
                        }}

                        isEnergyBalance={true}
                    /> : <p className="default-red">Please add new line</p>}
            </div>
    </Drawer>
    )
}