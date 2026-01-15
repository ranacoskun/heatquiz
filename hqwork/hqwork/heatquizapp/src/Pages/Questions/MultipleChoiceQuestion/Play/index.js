import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Button, Col, Divider, Row, Skeleton, Space, message } from "antd";

import './Play.css'
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useAuth } from "../../../../contexts/AuthContext";
import { ViewSolutionComponent } from "../../../../Components/ViewSolutionComponent";
import { NextButton } from "../../../../Components/NextButton";
import { ImageModal } from "../../../../Components/ImageModal";

export function MultipleChoiceQuestion({Id, deadLoad, onUpdateSeriesPlayElements, showSolution, nextAction, mapKey}){
    console.log(mapKey)

    const {multipleChoiceQuestionPlay, errorGetMultipleChoiceQuestionPlay, isLoadingMultipleChoiceQuestionPlay, getMultipleChoiceQuestionPlay, postQuestionStatistic} = useQuestions()
    const {currentPlayerKey} = useAuth()

    const [randomChoices, setRandomChoices] = useState([])
    const [selectedChoices, setSelectedChoices] = useState([])
    const [showScore, setShowScore] = useState(false)
    const [isScoreCorrect, setIsScoreCorrect] = useState(false)

    const [startTime, setStartTime] = useState(0)

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if(!deadLoad) getMultipleChoiceQuestionPlay(Id);
        
        setShowScore(false)
        setIsScoreCorrect(false)
        setRandomChoices([])
        setSelectedChoices([])

    }, [Id])

    useEffect(() => {
        if(multipleChoiceQuestionPlay){
            const {Choices} = multipleChoiceQuestionPlay

            const _randomChoices = randomizeList(Choices)
            setRandomChoices(_randomChoices)

            setStartTime(Date.now())
        }
    }, [multipleChoiceQuestionPlay])

    const randomizeList = (choices) => {
        return choices.sort(() => 0.5 - Math.random());
    }

    const selectChoice = (c) => {
        if(showScore) return;

        let _selectedChoices = [...selectedChoices]

        if(selectedChoices.map(a => a.Id).includes(c.Id)){
            _selectedChoices = _selectedChoices.filter(a => a.Id !== c.Id)
        }
        else{
            _selectedChoices.push(c)
        }

        setSelectedChoices(_selectedChoices)
    }

    const renderQuestion = () => {
        const {Base_ImageURL, Code, Latex, PDFURL} = multipleChoiceQuestionPlay
        return(
            <div>
                {contextHolder}
                <Space 
                className="multiple-choice-question-play-info-row"
                size={'large'}>
                    <ImageModal
                        URL={Base_ImageURL}
                    >
                        <img 
                            alt={Code}
                            src={Base_ImageURL}
                            className="multiple-choice-question-play-img"
                        />
                    </ImageModal>
                    <LatexRenderer 
                        latex={Latex}
                    />
                </Space>
                <Divider orientation="left">
                    {!showScore  && 
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            

                            if(!selectedChoices.length){
                                messageApi.destroy()
                                messageApi.warning('Please select atleast one choice')

                                return
                            }
                            const correctChoices = randomChoices.filter(a => a.Correct).map(a => a.Id)
                            
                            let isCorrect = selectedChoices.filter(sc => correctChoices.includes(sc.Id)).length === correctChoices.length
                            isCorrect = isCorrect && (selectedChoices.length === correctChoices.length)

                            const score = isCorrect ? '1/1' : '0/1'

                            setShowScore(true)
                            setIsScoreCorrect(isCorrect)

                            if(onUpdateSeriesPlayElements){
                                const status = ({
                                    Correct: isCorrect,
                                    Score: score,
                                    Answers: selectedChoices,
                                    Time: Date.now() - startTime,
                                    Question: multipleChoiceQuestionPlay
                                })

                                onUpdateSeriesPlayElements(status)
                            }

                            const statsVM = ({
                                QuestionId: multipleChoiceQuestionPlay.Id,
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

                    {showScore &&
                    <Row gutter={[4,4]} className="hq-question-action-line">
                        <Col>
                        <p>
                            Your answer is {' '} 
                            {isScoreCorrect ? 
                            <span
                                    className="multiple-choice-question-play-result-correct"
                                    >
                                        correct
                                    </span>
                                : 
                                    <span
                                    className="multiple-choice-question-play-result-incorrect"
                                    >
                                        incorrect
                                    </span>
                                }</p>
                        </Col>
                        <Col>
                            {PDFURL && 
                            <ViewSolutionComponent 
                                question={multipleChoiceQuestionPlay}
                                correct={isScoreCorrect}
                            />}
                        </Col>
                        <Col>
                            {nextAction && <NextButton 
                                nextAction={() => nextAction()}
                            />}
                        </Col>
                    </Row>}
                   
                </Divider>
                <Space direction="vertical">
                    {randomChoices.map((c, ci) => {
                    const {ImageURL, Latex, Id, Correct} = c
                    const isSelected = selectedChoices.map(a => a.Id).includes(Id)

                    const choiceCorrectness = (Correct)   

                    let className = !isSelected ? "multiple-choice-question-play-choice-container" : "multiple-choice-question-play-choice-container-selected"

                    if(showScore && showSolution){
                        className += choiceCorrectness ? ' multiple-choice-question-play-choice-container-correct' : ' multiple-choice-question-play-choice-container-incorrect'
                    }

                    return(
                        <Col
                            key={c.Id}
                            className={className}
                        >
                            <div
                                className="multiple-choice-question-play-choice-container-inner"
                                onClick={() => selectChoice(c)}
                            >
                                <p
                                    className="multiple-choice-question-play-index"
                                >
                                    {ci+1}
                                </p>
                                <Space
                                direction="vertical"
                                >
                                    {ImageURL && 
                                    <img 
                                        alt={"choice"+ci+1}
                                        src={ImageURL}
                                        className="multiple-choice-question-play-choice-img"
                                    />}

                                    {Latex &&
                                    <LatexRenderer 
                                        latex={Latex}
                                    />}
                                </Space>

                                
                            </div>
                        </Col>)
                })}
                </Space>
                
            </div>
        )
    }

    return(
        <div>
            {isLoadingMultipleChoiceQuestionPlay && <Skeleton />}
            {!isLoadingMultipleChoiceQuestionPlay && multipleChoiceQuestionPlay && renderQuestion()}
        </div>
    )
}