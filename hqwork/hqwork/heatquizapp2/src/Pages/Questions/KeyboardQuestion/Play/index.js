import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Button, Col, Divider, List, Row, Skeleton, Space, message } from "antd";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { Keyboard } from "../../../../Components/Keyboard";

import './Play.css'
import { checkKeyboardAnswerIsCorrect, validateKeyboardAnswer } from "../Functions";
import { useAuth } from "../../../../contexts/AuthContext";
import { ViewSolutionComponent } from "../../../../Components/ViewSolutionComponent";
import { NextButton } from "../../../../Components/NextButton";
import { ImageModal } from "../../../../Components/ImageModal";

export function KeyboardQuestionPlay({Id, deadLoad, onUpdateSeriesPlayElements, showSolution, nextAction, mapKey}){
    const {keyboardQuestionPlay, errorGetKeyboardQuestionPlay, isLoadingKeyboardQuestionPlay, getKeyboardQuestionPlay, postQuestionStatistic} = useQuestions()

    const [answerList, setAnswerList] = useState({
        List:[],
        echoNumber:0
    })

    const [answerValidity, setAnswerValidity] = useState(null)

    const [answerResult, setAnswerResult] = useState(null)
    const [showAnswer, setShowAnswer] = useState(false)
    
    const [startTime, setStartTime] = useState(0)
    const {currentPlayerKey} = useAuth()

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if(!deadLoad) getKeyboardQuestionPlay(Id);

        setShowAnswer(false)
        setAnswerResult(null)
        setAnswerList({
            List:[],
            echoNumber:0
        })

        setStartTime(0)

        checkAnswerValidity()
    }, [Id])

    useEffect(() => {
        checkAnswerValidity()
    }, [answerList])

    useEffect(() => {
        if(keyboardQuestionPlay)
        {
            setStartTime(Date.now())
        }
    }, [keyboardQuestionPlay])

    const checkAnswerValidity = () => {
        const {IsEnergyBalance} = keyboardQuestionPlay || {IsEnergyBalance: false}

        const validtiy = validateKeyboardAnswer(answerList,IsEnergyBalance)

        setAnswerValidity(validtiy)
    }

    const renderQuestion = () => {
        const {Base_ImageURL, Code, Latex, Keyboard: keyboard, DisableDevision, IsEnergyBalance, Answers, PDFURL} = keyboardQuestionPlay

        const reducedLatex = answerList.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

        return(
            <div>
                {contextHolder}
                <Space 
                className="keyboard-question-play-info-row"
                size={'large'}>
                    <ImageModal
                        URL={Base_ImageURL}
                    >
                        <img 
                            alt={Code}
                            src={Base_ImageURL}
                            className="keyboard-question-play-img"
                        />
                    </ImageModal>
                    
                   <div className="keyboard-question-play-info-answer-line">
                    <LatexRenderer 
                            latex={Latex}
                    />
                    <br/>
                    
                    {reducedLatex && 
                    <LatexRenderer 
                        latex={"$$"+reducedLatex+"$$"}
                    />}                        
                    
                    
                   </div>
                </Space>
                <Divider orientation="left">  
                    <Row gutter={[4,4]} className="hq-question-action-line">
                        <Col>
                        {!showAnswer && <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                                if(answerValidity){
                                    messageApi.destroy()
                                    messageApi.warning('Please enter a correct answer')

                                    return
                                }

                                const answerResult = checkKeyboardAnswerIsCorrect(answerList, Answers, IsEnergyBalance)

                                setAnswerResult(answerResult)
                                setShowAnswer(true)

                                const isCorrect = answerResult.answerStatus
                                const score = answerResult.answerStatus ? '1/1' : '0/1'

                                if(onUpdateSeriesPlayElements){
                                    const status = ({
                                        Correct: isCorrect,
                                        Score: score,
                                        Answers: [answerList],
                                        Time: Date.now() - startTime,
                                        Question: keyboardQuestionPlay
                                    })
    
                                    onUpdateSeriesPlayElements(status)
                                }

                                const statsVM = ({
                                    QuestionId: keyboardQuestionPlay.Id,
                                    Player: currentPlayerKey,
                                    Key: mapKey,
                                    Correct: isCorrect,
                                    TotalTime: Math.trunc(0.001 * (Date.now() - startTime)),
                        
                                    Score: score
                                })
                        
                                postQuestionStatistic(statsVM)
                            }}
                        >
                            Check answer
                        </Button>}
                        </Col>

                        <Col>
                            {showAnswer && 
                            <Space
                                size={'large'}
                            >
                                <p>You answer is {answerResult.answerStatus ? 
                                    <span
                                    className="keyboard-question-play-result-correct"
                                    >
                                        correct
                                    </span>
                                : 
                                    <span
                                    className="keyboard-question-play-result-incorrect"
                                    >
                                        incorrect
                                    </span>
                                }</p>
                                
                            
                            </Space>
                            }
                        </Col>

                        <Col>
                            {showAnswer && PDFURL && 
                                <ViewSolutionComponent 
                                question={keyboardQuestionPlay}
                                correct={answerResult.answerStatus}
                            />}
                        </Col>

                        <Col>
                            {showAnswer && nextAction && 
                            <NextButton
                                nextAction={() => nextAction()}
                            />}
                        </Col>
                    </Row>

                </Divider>
                {!showAnswer &&
                    <div>
                        <Keyboard 
                            Id={keyboard.Id}
                            List={answerList}
                            onEnterKey={(list) => setAnswerList(list)}
                            enableDivision={!DisableDevision}
                            isEnergyBalance={IsEnergyBalance}
                        />
                        <br/>
                        {answerValidity && 
                        <small
                            className="keyboard-question-play-warning-text"
                        > 
                        {answerValidity}
                        </small>}
                    </div>}

                    {showAnswer && showSolution && renderAnswerList()}
                    
                <br/>
               
            </div>
        )
    }

    const renderAnswerList = () => {
        const {Answers} = keyboardQuestionPlay
        const {possibleAnswers} = answerResult

        
        return(
            <div>
                <p>Possible answers</p>
                <List 
                dataSource={Answers}
                renderItem={(a, ai) => {
                    const answerReduced = a.AnswerElements
                    .sort((c,d) => c.Id > d.Id ? 1 : -1)
                    .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

                    const myAnswer = possibleAnswers.includes(ai)

                    return(
                        <div 
                            key={ai}
                        >
                            <LatexRenderer 
                                latex={"$$"+answerReduced+"$$"}
                            />
                            {myAnswer && 
                            <small
                            className="keyboard-question-play-result-correct"
                            >
                                Your answer !
                            </small>}
                            <Divider />
                        </div>
                    )
                }}
            />
            </div>
        )
    }

    return(
        <div>
            {isLoadingKeyboardQuestionPlay && <Skeleton />}
            {!isLoadingKeyboardQuestionPlay && keyboardQuestionPlay && renderQuestion()}
        </div>
    )
}