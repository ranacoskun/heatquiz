import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import {Alert, Button, Col, Divider, Row, Skeleton, Space, Tooltip,} from "antd";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import {CaretLeftOutlined, CaretRightOutlined, PauseOutlined} from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { PlotsGroupViewer } from "../Shared/PlotsGroupViewer";
import "./index.css"
import { ViewSolutionComponent } from "../../../../Components/ViewSolutionComponent";
import { RELATION_TYPE } from "../Shared/Constants";
import { NextButton } from "../../../../Components/NextButton";
import { useAuth } from "../../../../contexts/AuthContext";

var animationTimer1;
var animationTimer2;

export function DiagramQuestionPlay({Id, deadLoad, onUpdateSeriesPlayElements, nextAction, mapKey}){
 
    const {  DiagramQuestionPlay, isLoadingDiagramQuestionPlay, errorGetDiagramQuestionPlay, getDiagramQuestionPlay,
        postQuestionStatistic} = useQuestions()

    const [checkAnswer, setCheckAnswer] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [plotsGrading, setPlotsGrading] = useState([])

    const [selectedPlotIndex, setSelectedPlotIndex] = useState(0)
    const [score, setScore] = useState(null)
    const [answerCorrect, setAnswerCorrect] = useState(false)

    const [highligthSummarySection, setHighligthSummarySection] = useState(0)
    const [highligthSummaryRelation, setHighligthSummaryRelation] = useState(0)

    const [isAnimationRunning, setIsAnimationRunning] = useState(false)

    const [startTime, setStartTime] = useState(0)

    const {currentPlayerKey} = useAuth()

    useEffect(() => {
        if(!deadLoad) getDiagramQuestionPlay(Id);

        //Initialize
        setCheckAnswer(false)
        setErrorMessage(null)
        setPlotsGrading([])
        setScore(null)
        setSelectedPlotIndex(0)
        setAnswerCorrect(false)

        setHighligthSummarySection(null)
        setHighligthSummaryRelation(null)

        setIsAnimationRunning(false)
        setStartTime(Date.now())

    }, [Id])

    useEffect(() => {
        if(errorMessage){
            const timerId = setTimeout(() => {
                setErrorMessage(null)
            }, 5 * 1000 /* 5 seconds */)

            return () => {
                clearTimeout(timerId);
            };
        }
    }, [errorMessage])


    useEffect(() => {
        if(plotsGrading.length){
            let score1 = 0
            let score2 = 0
    
            for(let g of plotsGrading){
                score1 += g[0]
                score2 += g[1]
            }   
    
            const score = score1 + '/' + score2
            const correct = (score1 === score2)

            setScore(score)
            setAnswerCorrect(correct)
            setIsAnimationRunning(false)

            const {Plots} = DiagramQuestionPlay

            const plot = Plots[selectedPlotIndex]
            const grading = plotsGrading[selectedPlotIndex]
            
            const sectionGrading = grading[2]
            const relationGrading = grading[3]
            const firstSectionId = plot.Sections[0].Id
            
            runSectionsAnimation(sectionGrading, relationGrading, firstSectionId)

            const totalTime = (Date.now() - startTime) /* seconds */

            //Handle series 
            if(onUpdateSeriesPlayElements){
                const finalStatus = ({
                    Correct: correct,
                    Score: score,
                    Answers: [],
                    Time: Date.now() - startTime,
                    Question: DiagramQuestionPlay
                })
    
                onUpdateSeriesPlayElements(finalStatus)
            }

            //Post score and time
            const statsVM = ({
                QuestionId: DiagramQuestionPlay.Id,
                Player: currentPlayerKey,
                Correct: correct,
                TotalTime: Math.trunc(0.001 * totalTime),
                Key: mapKey,
                Score: score
            })
    
            postQuestionStatistic(statsVM)

        }
    }, [plotsGrading])

    const showSummary = () => {
        if(checkAnswer) return

        setCheckAnswer(true)
        setErrorMessage("......")
        setHighligthSummarySection(null)
        setHighligthSummaryRelation(null)
    }

    const renderImage = () => {
        
        return(
            <div>
                <PlotsGroupViewer 
                    question={DiagramQuestionPlay}
                    checkAnswer={checkAnswer}
                    onUpdateSummary={(error, summary) => {
                        if(error){

                            setCheckAnswer(false)
                            setErrorMessage(error)
                            return
                        }

                        setErrorMessage(null)
                        setPlotsGrading(summary)
                    }}

                    onSwitchPlot = {(pi) => setSelectedPlotIndex(pi)}

                    highligthSummarySection={highligthSummarySection}
                    highligthSummaryRelation = {highligthSummaryRelation}

                    selectedPlotIndexHighlights = {selectedPlotIndex}
                />
            </div>
        )
    }

    const getLabelText = (label) => {
        const names = {
            IsStartPositionLabelSelected:'Value left boundary',
            IsEndPositionLabelSelected:'Value right boundary',
            IsPositionRelationLabelSelected:'Value relation left/right boundary',

            IsGradientStartLabelSelected:'Gradient left boundary',
            IsGradientEndLabelSelected:'Gradient right boundary',
            IsRatioOfGradientsLabelSelected:'Gradient relation left/right boundary',

            IsLinearLabelSelected:'Linear section',
            IsMaximumSelected:'Section has maxima',
            IsMinimumSelected:'Section has minima',
        }

        return names[label]
    }

    const getRelationLabelText = (label, firstSectionId) => {
        const labelFunctions = {
            [RELATION_TYPE.POSITION]: (label) => { 
                return ({
                    Title1:'Value ' + label.RelationValue2 + ' boundary section #' + (label.FirstId-firstSectionId+1),
                    Title2:  'Value ' + label.RelationValue3 + ' boundary section #' + (label.OtherId-firstSectionId+1),
                    Relation: ' ' + label.RelationValue + ' '
                })           
            },
            [RELATION_TYPE.SLOPE]: (label) => {
                return ({
                    Title1:'Gradient ' + label.RelationValue2 + ' boundary section #' + (label.FirstId-firstSectionId+1),
                    Title2: 'Gradient ' +  label.RelationValue3 + ' boundary section #' + (label.OtherId-firstSectionId+1),
                    Relation: ' ' + label.RelationValue + ' '
                })
            },
            [RELATION_TYPE.INVERSE_SLOPE]: (label) => {
                return ({
                    Title:'Inverse slope',
                    Section1: (label.FirstId-firstSectionId+1),
                    Section2: (label.OtherId-firstSectionId+1),
                    Relation: ' ' + label.RelationValue + ' '
                })
            },
        }
        return labelFunctions[label[1].RelationType](label[1])
    }

    const showSectionHighlight = (sgi, a, ai) => {
        stopAnimation()

        setHighligthSummarySection({
            SectionIndex: sgi,
            Type: a[0],
            Status: a[1],
            SummaryIndex: ai
        })
    }

    const hideSectionHighlight = () => {
        stopAnimation()

        setHighligthSummarySection(null)
    }

    const showSectionRelationsHighlight = (r, ri, firstSectionId) => {
        stopAnimation()

        const data = r[1]
        const Status = r[0]

        const {FirstId, RelationValue2, OtherId, RelationValue3, RelationType} = data

        setHighligthSummaryRelation({
            FirstSectionIndex: FirstId - firstSectionId,
            FirstSectionLocation: RelationValue2,
            SecondSectionIndex: OtherId - firstSectionId,
            SecondSectionLocation: RelationValue3,
            Type: RelationType,
            Status: Status, 
            RelationIndex: ri
        })
    }

    const hideSectionRelationsHighlight = () => {
        stopAnimation()

        setHighligthSummaryRelation(null)
    }

    const stopAnimation = () => {

        clearInterval(animationTimer1)
        clearInterval(animationTimer2)

        setIsAnimationRunning(false)

        setHighligthSummarySection(null)
        setHighligthSummaryRelation(null)
    }

    const runSectionsAnimation = (sectionGrading,relationGrading, firstSectionId) => {
        
        clearInterval(animationTimer1)
        clearInterval(animationTimer2)

        setIsAnimationRunning(true)
        
        let animationSequence_section_summaries = 
        sectionGrading
            .map((sg, sgi) => 
            sg.map((a, ai) => ({
                SectionIndex: sgi,
                Type: a[0],
                Status: a[1],
                SummaryIndex: ai 
                }))
            ).flat()

            if(animationSequence_section_summaries.length){
                const first = animationSequence_section_summaries[0]
               
                setHighligthSummarySection(first)

                animationSequence_section_summaries = animationSequence_section_summaries.filter((a, ai) => ai !== 0)
            }
            else{
               runRelationsAnimation(relationGrading, firstSectionId)
            }
            
            animationTimer1 = setInterval(() => {
                const first = animationSequence_section_summaries[0]
                setHighligthSummarySection(first)

                if(!first){
                    clearInterval(animationTimer1)
                    clearInterval(animationTimer2)

                    if(relationGrading.length){
                        runRelationsAnimation(relationGrading, firstSectionId, sectionGrading)

                    }
                    else{
                        runSectionsAnimation(sectionGrading, relationGrading, firstSectionId)
                    }
                }
          
                animationSequence_section_summaries = animationSequence_section_summaries.filter((a, ai) => ai !== 0)

            }, 2 * 1000 /* 2 seconds */)

    }

    const runRelationsAnimation = (relationGrading, firstSectionId, sectionGrading) => {
        let animationSequence_section_relatons = relationGrading.map((r, ri) => 
        {
            const data = r[1]
            const {FirstId, RelationValue2, OtherId, RelationValue3, RelationType} = data
            return({
                FirstSectionIndex: FirstId - firstSectionId,
                FirstSectionLocation: RelationValue2,
                SecondSectionIndex: OtherId - firstSectionId,
                SecondSectionLocation: RelationValue3,
                Type: RelationType,
                Status: r[0], 
                RelationIndex: ri
                })
        })

        if(animationSequence_section_relatons.length){
            const first = animationSequence_section_relatons[0]
         
            setHighligthSummaryRelation(first)

            animationSequence_section_relatons = 
            animationSequence_section_relatons.filter((a, ai) => ai !== 0)
        
        }

        animationTimer2 = setInterval(() => {
            const first = animationSequence_section_relatons[0]

            if(first){
                setHighligthSummaryRelation(first)
            }
            else{
                setHighligthSummaryRelation(null)
                clearInterval(animationTimer1)
                clearInterval(animationTimer2)

                runSectionsAnimation(sectionGrading, relationGrading, firstSectionId)

            }
            animationSequence_section_relatons = animationSequence_section_relatons.filter((a, ai) => ai !== 0)

        }, 2000)

    }

    const renderSummary = () => {
        const {Plots, PDFURL} = DiagramQuestionPlay
        const hasMultiPlots = (Plots.length > 1)

        const selectedPlot = Plots[selectedPlotIndex]
        const isLastPlotSelected = (selectedPlotIndex === (Plots.length - 1))
        const firstSectionId = selectedPlot.Sections[0].Id

        const {Title} = selectedPlot

        const plotGrading = plotsGrading[selectedPlotIndex]
        const sectionGrading = plotGrading[2]
        const relationGrading = plotGrading[3]

        const plotScore = plotGrading[0] + "/" + plotGrading[1]

        return(
            <div className="d-q-summary-area">
                <Space
                    size = "large"
                    align = "start"
                >
                    <Space
                        className="d-question-final-score"
                        direction="vertical"
                        align="center"
                    >
                        <p className="default-title">{score}</p>
                        <p className="default-gray default-small">Final score</p>
                    </Space>
                    {PDFURL && 
                        <ViewSolutionComponent
                            question={DiagramQuestionPlay}
                            correct={answerCorrect}
                        />}
                    {nextAction && 
                    <NextButton
                        nextAction={() => nextAction()}
                    />}
                </Space>
                <Divider />
                <Space className="hq-full-width hq-opposite-arrangement">
                    <Space size="large" align="start">
                        <p className="default-title">{Title}</p>
                       
                        &nbsp;
                        &nbsp;

                        {isAnimationRunning ?
                        <div 
                            onClick={() => stopAnimation()}
                            align = "center"
                            size="small"
                            direction="vertical"
                            className="hq-clickable"
                        >
                            <PauseOutlined className="default-large default-red"/>
                            <p className="default-smaller default-gray">Animation</p>
                        </div>
                        :
                        <div 
                            onClick={() => runSectionsAnimation(sectionGrading, relationGrading, firstSectionId)}
                            align = "center"
                            size="small"
                            direction="vertical"
                            className="hq-clickable"
                        >
                            <CaretRightOutlined className="default-large default-green"/>
                            <p className="default-smaller default-gray">Animation</p>
                        </div>}
                    </Space>
                    {hasMultiPlots &&
                    <Space align="start">
                        <Tooltip
                            color="white"
                            title={<p>Previous plot</p>}
                        >
                            <CaretLeftOutlined 
                            onClick = {() => {
                                if(selectedPlotIndex){
                                    setSelectedPlotIndex(selectedPlotIndex - 1)
                                }

                                stopAnimation()
                            }}
                            style={{color: (selectedPlotIndex ? "#0275d8" : "gray"), cursor:'pointer'}}/>
                        </Tooltip>

                        <Tooltip
                            color="white"
                            title={<p>Next plot</p>}
                        >
                            <CaretRightOutlined 
                             onClick = {() => {
                                if(!isLastPlotSelected){
                                    setSelectedPlotIndex(selectedPlotIndex + 1)
                                }

                                stopAnimation()
                            }}
                            style={{color: (isLastPlotSelected ? "gray" : "#0275d8"), cursor:'pointer'}}/>
                        </Tooltip>
                    </Space>}
                </Space>
                <br/>
                <Space>
                    <p className="default-gray">Plot score</p>
                    <p className="default-title">{plotScore}</p>
                </Space>
                <br/>
                <br/>

                {sectionGrading.map((sg, sgi) => {
                    if(!sg.length) return <div/>

                    return(
                        <div key={sgi}>
                        <small className="default-gray default-underline">Section #{sgi+1}</small>

                        <div>
                            {sg.map((a, ai) => {
                                const isCorrect = a[1]

                                const isAnimated = (highligthSummarySection 
                                && (highligthSummarySection.SectionIndex === sgi) 
                                && (highligthSummarySection.SummaryIndex === ai))

                                return(
                                    <div
                                        key={ai}
                                    >
                                        <Space 
                                        
                                        onMouseEnter = {() => showSectionHighlight(sgi, a, ai)}

                                        onMouseLeave = {() => hideSectionHighlight()}
                                        
                                        className={"d-q-summary-line " + (isAnimated && "d-q-summary-line-animated")}

                                        >
                                            <p className="default-gray">({ai+1})</p>
                                            &nbsp;
                                            <p>{getLabelText(a[0])}</p>
                                            {isCorrect ? <Tooltip
                                                color="white"
                                                title={<p>Condition satisfied</p>}
                                            >
                                                <i className="default-green hq-clickable">+1</i>
                                            </Tooltip>
                                            : 
                                            <Tooltip
                                                color="white"
                                                title={<p>Condition not satisfied</p>}
                                            >
                                                <i className="default-red hq-clickable">-1</i>
                                            </Tooltip>}
                                        </Space>
                                    </div>)
                            })}
                        </div>
                        <br/>
                    </div>)})}

                    {relationGrading.length ?  
                    <div>
                        <small className="default-gray defaiult-underline">Section relations</small> 

                        <br/>
                        <Row>
                            {relationGrading.map((r, ri) => {
                                const label =  getRelationLabelText(r, firstSectionId)
                                
                                const {Relation, Title1, Title2} = label
                                
                                const title1 = Title1.replaceAll('Start', 'left').replaceAll('End', 'right')
                                const title2 = Title2.replaceAll('Start', 'left').replaceAll('End', 'right')

                                const isCorrect = r[0]
                                
                                const isAnimated = (highligthSummaryRelation && (highligthSummaryRelation.RelationIndex === ri))
                                return(
                                    <Col
                                        key={ri}
                                    >
                                        <Space
                                            direction="vertical"
                                            align="center"
                                            className={"d-q-summary-relation-box " + (isAnimated && "d-q-summary-relation-box-animated")}

                                            onMouseEnter = {() => showSectionRelationsHighlight(r, ri, firstSectionId)}

                                            onMouseLeave = {() => hideSectionRelationsHighlight()}
                                        >
                                            <p>{title1}</p>

                                            <p> {Relation} </p>

                                            <p>{title2}</p>

                                            {isCorrect ? <Tooltip
                                                color="white"
                                                title={<p>Condition satisfied</p>}
                                            >
                                                <i className="default-green hq-clickable">+1</i>
                                            </Tooltip>
                                            : 
                                            <Tooltip
                                                color="white"
                                                title={<p>Condition not satisfied</p>}
                                            >
                                                <i className="default-red hq-clickable">-1</i>
                                            </Tooltip>}
                                            
                                        </Space>

                                    </Col>
                                )
                            })}
                        </Row>
                    </div>
                    : <div/>}
                    
            </div>
        )
    }

    const renderQuestion = () => {
        const {QuestionText} = DiagramQuestionPlay
        return(
            <div>
                <Row
                    gutter={12}
                    className="hq-full-width"
                >
                    <Col>
                        {renderImage()}
                    </Col>
                    <Col>
                            {QuestionText && 
                            <div
                                className="d-q-control-area"
                            >
                                <LatexRenderer
                                className="hq-full-width"
                                latex={QuestionText}/>
                            </div>}    
                            
                            {!checkAnswer &&
                            <Space
                                size="large"
                            >
                               <Button
                                    size="small"
                                    type="primary"
                                    onClick={showSummary}
                                >
                                    Check answer
                                </Button>
                            </Space>}
                            {errorMessage && 
                                <div>
                                    <br/>
                                    <Alert 
                                        message={errorMessage}
                                        type="info"
                                        closable
                                        className="d-q-error-message"
                                    />  
                                </div>}  
                            {(checkAnswer && !errorMessage) && renderSummary()}
                    </Col>
                </Row>
            </div>
        )
    }
   

    return(
        <div>
            {isLoadingDiagramQuestionPlay && <Skeleton />}

            {errorGetDiagramQuestionPlay && !isLoadingDiagramQuestionPlay && 
            <ErrorComponent 
                error={errorGetDiagramQuestionPlay}
                onReload={() => getDiagramQuestionPlay(Id)}
            />}

            {!(isLoadingDiagramQuestionPlay || errorGetDiagramQuestionPlay) && DiagramQuestionPlay && renderQuestion()}
        </div>
    )
}