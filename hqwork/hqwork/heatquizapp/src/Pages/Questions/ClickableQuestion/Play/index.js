import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Button, Col, Divider, List, Row, Skeleton, message } from "antd";
import { FixURL } from "../../../../services/Auxillary";

import { useAuth } from "../../../../contexts/AuthContext";
import {CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

import './Play.css'
import { ClickableChartComponent } from "./ClickableChartComponent";
import { useInterpretedTrees } from "../../../../contexts/InterpretedTreesContext";
import { ViewSolutionComponent } from "../../../../Components/ViewSolutionComponent";
import { NextButton } from "../../../../Components/NextButton";

export function ClickableQuestionPlay({Id, deadLoad, onUpdateSeriesPlayElements, showSolution, nextAction, mapKey}){
    const {
        clickableQuestionPlay, errorGetClickableQuestionPlay, isLoadingClickableQuestionPlay, getClickableQuestionPlay,
        postQuestionStatistic
    } = useQuestions()


    const {interpretedValues, isLoadingInterpretedValues, getAllInterpretedValues,} = useInterpretedTrees()

    const {currentPlayerKey} = useAuth()

    const [messageApi, contextHolder] = message.useMessage();

    const baseRef = React.createRef()
    const [offset, setOffset] = useState(0)

    const [elementAnswers, setElementAnswers] = useState([])
    const [elementAnswersStatus, setElementAnswersStatus] = useState([])
    const [showScore, setShowScore] = useState(false)
    const [finalScore, setFinalScore] = useState('')
    const [showCorrectSolution, setShowCorrectSolution] = useState(false)

    const [showPickAnswers, setShowPickAnswers] = useState(false)
    const [showPlayChart, setShowPlayChart] = useState(false)

    const [sliderValues, setSliderValues] = useState([])

    const [selectedNode, setSelectedNode] = useState(null)
    const [selectedNodeIndex, setSelectedNodeIndex] = useState(null)

    const [selectedImageLeafs, setSelectedImageLeafs] = useState([])
    
    const [startTime, setStartTime] = useState(0)

    useEffect(() => {
        if(!deadLoad) getClickableQuestionPlay(Id);
        getAllInterpretedValues()

        let _offset = 0
        const fatherCol = baseRef.current

        if(fatherCol){
            _offset = parseInt(window.getComputedStyle(fatherCol.parentNode).paddingRight.replace('px',''))
        }

        setOffset(_offset)
        setElementAnswers([])
        setElementAnswersStatus([])
        setShowCorrectSolution(false)
        setShowScore(false)
        setFinalScore('')
    }, [Id])

    useEffect(() => {
        if(clickableQuestionPlay){
            setStartTime(Date.now())

            const {Question} = clickableQuestionPlay

            const {ClickImages, ClickCharts} = Question

            setElementAnswers([...ClickImages.map((c) => null), ...ClickCharts.map((c) => null)])
        }
     }, [clickableQuestionPlay])

    useEffect(() => {
       if(errorGetClickableQuestionPlay){
            messageApi.destroy()
            messageApi.error(errorGetClickableQuestionPlay)
       }
    }, [errorGetClickableQuestionPlay])


    useEffect(() => {
        if(showPlayChart){
            setSliderValues([190,0,-190])
        }
    }, [showPlayChart])

    const checkAnswer = () => {
        const {Question} = clickableQuestionPlay

        const {ClickImages, ClickCharts} = Question

        if(elementAnswers.length !== (ClickCharts.length + ClickImages.length)){
            messageApi.destroy()
            message.warning('Please add all answers!')

            return
        }

        const status = [
            ...ClickImages.map((a, ai) => (a.Answer.Id === elementAnswers[ai].Id)),
            ...ClickCharts.map((a, ai) => (a.Answer.Id === elementAnswers[ai + ClickImages.length].Id))
        ]

        const score = (status.filter(a => a).length) + '/' + status.length

        setElementAnswersStatus(status)
        setFinalScore(score)
        setShowScore(true)

        if(showSolution) setShowCorrectSolution(true);

        const isCorrect = status.length === status.filter(a => a).length

        if(onUpdateSeriesPlayElements){

            const finalStatus = ({
                Correct: isCorrect,
                Score: score,
                Answers: elementAnswers,
                Time: Date.now() - startTime,
                Question
            })

            onUpdateSeriesPlayElements(finalStatus)
        }

        const statsVM = ({
            QuestionId: Question.Id,
            Player: currentPlayerKey,
            Correct: isCorrect,
            TotalTime: Math.trunc(0.001 * (Date.now() - startTime)),
            Key: mapKey,
            Score: score
        })

        postQuestionStatistic(statsVM)
    }

    const renderCorrectSolution = () => {
        const {Question} = clickableQuestionPlay
        const {Code, BackgroundImageURL, BackgroundImageHeight, BackgroundImageWidth, ClickImages, ClickCharts} = Question
        const imageWidth = window.innerWidth * 0.45
        const imageHeight = (BackgroundImageHeight/BackgroundImageWidth) * imageWidth

        const backgroundImageStyle = ({
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'contain',
        })

        const itemStyle = ({
            alignItems:'center',
            justifyContent:'center',
            display:'flex',
            position: 'absolute',
           
        })

        return(
            <div>
                <img
                style = {{
                    ...backgroundImageStyle,
                    height:imageHeight,
                    width:imageWidth,
                }} 

                src = {BackgroundImageURL}
                alt={Code}
                />
                {ClickImages.map((p) => {
                    const {Answer} = p

                    const itemPositionStyle = getItemPositionStyle(imageWidth, BackgroundImageWidth, p)

                    return (
                        <span 
                        key={p.Id}
                        style = {{
                            ...backgroundImageStyle,
                            ...itemStyle,
                           
                            ...itemPositionStyle,

                            [p.Background_ImageId ? "backgroundImage" : ""]:
                            p.Background_ImageId ? "url(" + FixURL(p.Background_Image.URL) + ")" : "",
                        }}
                                                >
                            
                            <img 
                                style={itemPositionStyle}
                                src={Answer.URL}
                                alt="answer"
                            />
                        </span>
                    )
                })}

                {ClickCharts.map((p) => {
                    const {Answer} = p 

                    const itemPositionStyle = getItemPositionStyle(imageWidth, BackgroundImageWidth, p)

                    return (
                        <span 
                        className="clickable-question-play-clickable-item"
                        key={p.Id}
                        style = {{
                            ...backgroundImageStyle,
                            ...itemStyle,
                            
                            ...itemPositionStyle,

                            [p.Background_ImageId ? "backgroundImage" : ""]:
                            p.Background_ImageId ? "url(" + FixURL(p.Background_Image.URL) + ")" : "",
                        }}

                        >
                            
                            <img 
                                style={itemPositionStyle}
                                src={Answer.URL}
                                alt="answer"
                            />
                        </span>
                    )
                })}
            </div>
        )
    }

    const renderQuestion = () => {
        const {Question} = clickableQuestionPlay
        const{PDFURL} = Question
        const correctAnswer = elementAnswersStatus.filter(a => a).length

        return(
            <div>
                <Row
                className="clickable-question-play-row"
                >
                    <Col xs = {12}>
                        {renderQuestionPlaySection()}
                    </Col>
                    <Col xs = {1}>
                    </Col>
                    <Col xs = {11}>
                        {showPickAnswers && renderPickSolutionClick()}
                        {showPlayChart && renderPickChartSolution()}
                        {showCorrectSolution && renderCorrectSolution()}
                    </Col>
                </Row>
                <br/>
                {!showScore && 
                <Button
                    type="primary"
                    size="small"
                    onClick={() => checkAnswer()}
                >
                    Check answer
                </Button>}

                {showScore && <Divider />}
                    
                {showScore && <p>Score: {' '} {finalScore}</p>}
                
                {showScore &&
                <Row gutter={[4,4]} className="hq-question-action-line">
                    <Col>
                        {PDFURL && 
                        <ViewSolutionComponent 
                            question={clickableQuestionPlay.Question}
                            correct={correctAnswer}
                        />}
                    </Col>

                    <Col>
                    {nextAction && <NextButton 
                        nextAction={() => nextAction()}
                      />}
                    </Col>
                </Row>}
            </div>
        )
    }

    const onClickImage = (n, ni) => {
        if(showScore) return;

        setSelectedNode(n)
        setSelectedNodeIndex(ni)
        setShowPickAnswers(true)
        setShowPlayChart(false)
    }

    const onChartImage = (n, ni) => {
        if(showScore) return;

        setSelectedNode(n)
        setSelectedNodeIndex(ni)
        setShowPickAnswers(false)
        setShowPlayChart(true)

    }

    const getItemPositionStyle = (imageWidth, BackgroundImageWidth, p) => ({
        width: ((imageWidth)/BackgroundImageWidth)* p.Width,
        height: ((imageWidth)/BackgroundImageWidth)*p.Height,
        left: ((imageWidth)/BackgroundImageWidth)*p.X - offset,
        top:  ((imageWidth)/BackgroundImageWidth)*p.Y,
    })

    const renderQuestionPlaySection = () => {
        const {Question} = clickableQuestionPlay
        const {Code, BackgroundImageURL, BackgroundImageHeight, BackgroundImageWidth, ClickImages, ClickCharts} = Question
        const imageWidth = window.innerWidth * 0.45
        const imageHeight = (BackgroundImageHeight/BackgroundImageWidth) * imageWidth

        const backgroundImageStyle = ({
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'contain',
        })

        const itemStyle = ({
            alignItems:'center',
            justifyContent:'center',
            display:'flex',
            flexDirection:'column',
            cursor:'pointer',
            position: 'absolute',
            border: "1px solid rgb(245, 245, 245)"
           
        })

        return(
            <div
            style = {{
                height:imageHeight,
                width:imageWidth,
            }} 
            >
                <img
                style = {{
                    ...backgroundImageStyle,
                    height:imageHeight,
                    width:imageWidth,
                }} 

                src = {BackgroundImageURL}
                alt={Code}
                />
                {ClickImages.map((p, pi) => {
                    const answer = elementAnswers[pi]

                    const itemPositionStyle = getItemPositionStyle(imageWidth, BackgroundImageWidth, p)

                    return (
                        <div 
                        key={p.Id}
                        style = {{
                            ...backgroundImageStyle,
                            ...itemStyle,
                           
                            ...itemPositionStyle,

                            [p.Background_ImageId ? "backgroundImage" : ""]:
                            p.Background_ImageId ? "url(" + FixURL(p.Background_Image.URL) + ")" : "",
                        }}
                        
                        onClick={() => onClickImage(p,pi)}
                        >
                            {answer && 
                            <img 
                                style={itemPositionStyle}
                                src={answer.URL}
                                alt="answer"
                            />}

                            {showScore && 
                            (elementAnswersStatus[pi] ?<CheckCircleFilled
                                style={{color:'green', opacity:'70%'}}
                            /> 
                            : 
                            <CloseCircleFilled
                                style={{color:'red', opacity:'70%'}}
                            />)}
                        </div>
                    )
                })}

                {ClickCharts.map((p, pi) => {
                    const answer = elementAnswers[pi + ClickImages.length]

                    const itemPositionStyle = getItemPositionStyle(imageWidth, BackgroundImageWidth, p)

                    return (
                        <div 
                        key={p.Id}
                        style = {{
                            ...backgroundImageStyle,
                            ...itemStyle,
                            
                            ...itemPositionStyle,

                            [p.Background_ImageId ? "backgroundImage" : ""]:
                            p.Background_ImageId ? "url(" + FixURL(p.Background_Image.URL) + ")" : "",
                        }}

                        onClick={() => onChartImage(p,pi + ClickImages.length)}
                        >
                            {answer && 
                            <img 
                                style={itemPositionStyle}
                                src={answer.URL}
                                alt="answer"
                            />}
                            {showScore &&  
                            (elementAnswersStatus[pi+ClickImages.length] ? 
                            <CheckCircleFilled
                                style={{color:'green', opacity:'70%'}}
                            /> 
                            : 
                            <CloseCircleFilled
                                style={{color:'red', opacity:'70%'}}
                            />)}
                        </div>
                    )
                })}
            </div>
        )
    }

    const pickImageForElement = (img) => {
        let _elementAnswers = [...elementAnswers]
        _elementAnswers[selectedNodeIndex] = img

        setElementAnswers(_elementAnswers)
    }

    const renderPickSolutionClick = () => {
        const {AnswerGroup} = selectedNode
        let {Images} = AnswerGroup
        if(selectedImageLeafs.length) Images = selectedImageLeafs;

        return(
            <List 
                dataSource={Images}
                renderItem={(img) => (
                    <img 
                        src={img.URL}  
                        className="clickable-question-pick-img"
                        alt="pick_answer"
                        onClick={() => {
                            if(img.Leafs.length){
                                setSelectedImageLeafs(img.Leafs)

                            }
                            else{
                                pickImageForElement(img)
                                setSelectedNode(null)
                                setSelectedImageLeafs([])
                                setShowPickAnswers(false)
                            }
                        }}
                    />
                )}
            />
        )
    }

    
    const calculateChartImage = () => {

        const LeftValues = interpretedValues.Left
        const RightValues = interpretedValues.Right
        const RatioValues = interpretedValues.RatioOfGradients
        const JumpValues = interpretedValues.Jump

        //Calculate gradients and jump
        const LeftGradient = (sliderValues[1] - sliderValues[0]) 
        const RightGradient = (sliderValues[2])
        const RatioOfGradients = Math.abs(LeftGradient) - Math.abs(RightGradient)
       
        let _Jump =  "NO JUMP"

        if(sliderValues[1] > 0) _Jump = ">";
        if(sliderValues[1] < 0) _Jump = "<";

        const Jump = _Jump

        //Get interpertation object Ids
        //Left
        const LeftInterpretationValue = (LeftValues).filter(v => {

            if(LeftGradient === 0) return (v.Value === "Zero");

            if(LeftGradient > 0) return (v.Value === "+");

            return (v.Value === "-");

        })[0]

        const LeftId = LeftInterpretationValue.Id

        //Right
        const RightInterpretationValue = (RightValues).filter(v => {

            if(RightGradient === 0) return (v.Value === "Zero");

            if(RightGradient > 0) return (v.Value === "+");

            return (v.Value === "-");

        })[0]

        const RightId = RightInterpretationValue.Id

        //Ratio
        const RatioInterpretationValue = (RatioValues)
        .filter(v => {

            if(Math.abs(RatioOfGradients) < 0.05) return (v.Value  === "=");

            if(RatioOfGradients > 1) return (v.Value === ">");

            return (v.Value === "<");

        })[0]

        const RatioId = RatioInterpretationValue.Id

        //Jump
        const JumpInterpretationValue = (JumpValues).filter(v => {
        return (v.Value === Jump)
        })[0]

        const JumpId = JumpInterpretationValue.Id        
        
        //Get Image
        const {AnswerGroup} = selectedNode 
        const {Images} = AnswerGroup 

        const image = Images
        .filter(i => (i.LeftId === LeftId 
                        && i.RightId === RightId 
                        && i.JumpId === JumpId 
                        && i.RationOfGradientsId === RatioId))[0]

        if(image){
            let _elementAnswers = [...elementAnswers]
            _elementAnswers[selectedNodeIndex] = image

            setElementAnswers(_elementAnswers)
            setShowPlayChart(false)
            
        }
        else{
            messageApi.destroy()
            messageApi.warning('Failed to find an image to corrosponds to selected chart values')
        }
        
    }

    const renderPickChartSolution = () => {
        const imageWidth = window.innerWidth * 0.225

        return(
            <div>
                <ClickableChartComponent 
                    style = {{width:imageWidth, height: imageWidth * (3/5)}}

                    slidersValues={sliderValues}
                    onUpdateSliderValue={(values) => {

                        setSliderValues(values)
                        console.log(values, sliderValues)
                    }}
                />
                
                <br/>

                <Button
                    size="small"
                    onClick={() => calculateChartImage()}

                    loading={isLoadingInterpretedValues}
                >
                    Choose
                </Button>
            </div>
        )
    }
    

    return(
        <div 
            ref={baseRef}
            className="clickable-question-play-container"
        >
            {contextHolder}
            {isLoadingClickableQuestionPlay && <Skeleton />}
            {!isLoadingClickableQuestionPlay && clickableQuestionPlay && renderQuestion()}
        </div>
    )

}