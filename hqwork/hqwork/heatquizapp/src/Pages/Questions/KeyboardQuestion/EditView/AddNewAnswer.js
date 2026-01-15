import {Button, Drawer, Space, message} from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { useEffect } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { validateKeyboardAnswer } from "../Functions";
import { Keyboard } from "../../../../Components/Keyboard";
import { handleResponse } from "../../../../services/Auxillary";

export function AddNewAnswer({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const  [api, contextHolder] = message.useMessage()
    
    const {isLoadingAddKeyboardQuestionAnswer, addKeyboardQuestionAnswer} = useQuestions()

    const {KeyboardId: keyboardId, DisableDevision, IsEnergyBalance} = question

    const [answerList, setAnswerList] = useState({
        List:[],
        echoNumber:0
    })

    const [answerValidity, setAnswerValidity] = useState(null)

    useEffect(() => {
        checkAnswerValidity()
    }, [answerList])

    const checkAnswerValidity = () => {
        const {IsEnergyBalance} = question || {IsEnergyBalance: false}

        const validtiy = validateKeyboardAnswer(answerList,IsEnergyBalance)

        setAnswerValidity(validtiy)
    }

    const reducedLatex = answerList.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'


    return(
        <Drawer
        title="Add answer"
        width={'65%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}

        footer={
            <div>
            <p className="default-title">{question.Code}</p>
            <Space size={'large'} align="start">
                <div>
                    <img
                        src = {question.Base_ImageURL}
                        alt="question"
                        className="question-feedback-image"
                        
                    />
                </div>
                <div>
                    {question.Latex && <LatexRenderer latex={question.Latex}/>}
                </div>
            </Space>
        </div>}
        >
            {contextHolder}

            {reducedLatex && 
            <LatexRenderer 
                latex={"$$"+reducedLatex+"$$"}
            />} 
            <div>
                <Keyboard 
                    Id={keyboardId}
                    List={answerList}
                    onEnterKey={(list) => setAnswerList(list)}
                    enableDivision={!DisableDevision}
                    isEnergyBalance={IsEnergyBalance}
                />
                <br/>
                {answerValidity ? 
                <small
                    className="default-red highlighted"
                > 
                    {answerValidity}
                </small> : 
                <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                        console.log(answerList.List)

                        const VM = ({
                            Id: question.Id,
                            Answer:answerList.List.map((e,i) => 
                            (
                                {
                                    NumericKeyId: e.NumericKeyId,
                                    ImageId: e.ImageId,
                                    Value:e.char,
                                    Order: i
                                }
                            ))
                        })

                        addKeyboardQuestionAnswer(VM)
                        .then(r => handleResponse(r, api, 'Answer added successfully', 1, () => {
                            onClose()
                            reloadQuestion()
                        }))
                        
                    }}

                    loading={isLoadingAddKeyboardQuestionAnswer}
                >
                    Add new answer
                </Button>}
                </div>
        </Drawer>
    )
}