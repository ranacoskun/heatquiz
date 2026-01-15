import { Button, Divider, message, Select, Skeleton, Space, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { RELATION_GRADIENT_NUM, RELATION_X_POSITION_NUM, RELATION_Y_POSITION_NUM } from "../Shared/Constants";
import { conformPoints, createRelations, evaluateQuestionAnswer, generateListsForRelations, getNameForRelationNum, randomizePoints } from "../Shared/Functions";
import { PlayPVDiagramQuestionInteractivePlot } from "../Shared/PlayPVDiagramQuestionInteractivePlot";
import {ArrowRightOutlined} from '@ant-design/icons';

import './index.css'
import { useAuth } from "../../../../contexts/AuthContext";
import { NextButton } from "../../../../Components/NextButton";
import { ViewSolutionComponent } from "../../../../Components/ViewSolutionComponent";
import { CommentInPlayComponent } from "./CommentInPlayComponent";

export function PVDiagramQuestionPlay({Id, deadLoad, onUpdateSeriesPlayElements, nextAction, mapKey}){

    const {PVDiagramQuestionPlay, isLoadingPVDiagramQuestionPlay, getPVDiagramQuestionPlay, errorGetPVDiagramQuestionPlay, postQuestionStatistic} = useQuestions()
    
    const [newPointGroups, setNewPointGroups] = useState([])
    const [newPoints, setNewPoints] = useState([])

    const [selectedPointMoveIndex, setSelectedPointMoveIndex] = useState(null)
    const [selectedCPPointMoveIndex, setSelectedCPPointMoveIndex] = useState(null)

    const [relationsList, setRelationsList] = useState(null)
    const [relationsFinal, setRelationsFinal] = useState([])

    const [hasPlayed, setHasPlayed] = useState(false)
    const [checkAnswer, setCheckAnswer] = useState(false)
    const [finalEvaluations, setFinalEvaluation] = useState([])

    const [highlightedPoint, setHighlightedPoint] = useState(null)
    const [highlightedRelation, setHighlightedRelation] = useState(null)

    const [startTime, setStartTime] = useState(0)

    const [selectedGroupIndex, setSelectedGroupIndex] = useState(null)

    const [api, contextHolder] = message.useMessage()

    const {currentPlayerKey} = useAuth()

    useEffect(() => {
        if(!deadLoad) getPVDiagramQuestionPlay(Id);

        setCheckAnswer(false)
        setHasPlayed(false)
        setFinalEvaluation([])

        setRelationsList(null)
        setRelationsFinal(null)

        setHighlightedPoint(null)
        setHighlightedRelation(null)

        setStartTime(Date.now())
    }, [Id])

    useEffect(() => {
        if(PVDiagramQuestionPlay){
            const {Groups, Base_ImageURL_Width, Base_ImageURL_Height} = PVDiagramQuestionPlay

            let _groups = []

            for(const g of Groups){
                const {Points, } = g

                let _points = Points.map((p) => ({
                    ...p,
                    
                    name: p.Name,
                    color: p.InnerColor,
                    borderColor: p.OuterColor,
    
                    x: p.X,
                    y: p.Y,
                    cx:0,
                    cy: 0,
    
                    marginX: p.MarginX,
                    marginY: p.MarginY
                }))
    
                _points = randomizePoints(_points, Base_ImageURL_Width, Base_ImageURL_Height)
    
                _points = conformPoints(_points)

                const _g = ({
                    ...g,
                    points: _points
                })

                _groups.push(_g)
            }

            setSelectedGroupIndex(0)

            setNewPointGroups(_groups)
        }
    }, [PVDiagramQuestionPlay])

    useEffect(() => {

        if(!PVDiagramQuestionPlay) return;

        const {Base_ImageURL_Height} = PVDiagramQuestionPlay

        let _gs = [...newPointGroups]

        for(let [gi, g] of newPointGroups.entries()){
            const {points, IsClosedLoop: isClosedLoop, IsPointsOnlyPlay: isPointsOnlyPlay} = g

            const list = generateListsForRelations(points, isClosedLoop, isPointsOnlyPlay, Base_ImageURL_Height, true)
            const relations = createRelations(list, isPointsOnlyPlay)
            _gs[gi].relationsList = list
            _gs[gi].relationsFinal = relations
        }

        setNewPointGroups(_gs)
    },
    [...newPointGroups.map(g => g.points)])

    useEffect(() => {
        if(!checkAnswer) return;

        let _evaluations = [...finalEvaluations]

        for(let [gi, g] of newPointGroups.entries()){

            const _finalEvaluation = evaluateQuestionAnswer(g)
        
            _evaluations[gi] = _finalEvaluation
            setFinalEvaluation(_evaluations)
        }        
    }, [checkAnswer])

    useEffect(() => {
        if(!finalEvaluations.length) return;

        let _totalPoints = 0
        let _maxPoints = 0

        for(const ev of finalEvaluations){
            const {finalEvaluation: evaluation} = ev

            const {maxPoints, totalPoints} = evaluation

            _totalPoints += totalPoints
            _maxPoints += maxPoints
        }

        const totalTime = (Date.now() - startTime) /* seconds */
        const score = (_totalPoints) + "/" + _maxPoints

        const correct = (_totalPoints === _maxPoints)

        //Handle series 
        if(onUpdateSeriesPlayElements){
            const finalStatus = ({
                Correct: correct,
                Score: score,
                Answers: [],
                Time: totalTime,
                Question: PVDiagramQuestionPlay
            })
    
            onUpdateSeriesPlayElements(finalStatus)
        }

        //Post score and time
        const statsVM = ({
            QuestionId: PVDiagramQuestionPlay.Id,
            Player: currentPlayerKey,
            Correct: correct,
            TotalTime: Math.trunc(0.001 * totalTime),
            Key: mapKey,
            Score: score
        })

        postQuestionStatistic(statsVM)

    }, [finalEvaluations])

    const showSummary = () => {
        if(!hasPlayed) {
            api.destroy()
            api.warning("Please make atleast one move")

            return
        }

        setCheckAnswer(true)
    }

    const renderCorrectSolution = () => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, Groups} = PVDiagramQuestionPlay


        return(
            <div>
                <Space
                    className="hq-full-width"
                    direction="vertical"
                    align="center"
                >
                    <Space
                        className="play-q-pv-diagram-correct-solution"
                    >
                        <p className="default-gray default-small"><strong>Correct</strong> solution</p>
                    </Space>
                </Space>
                {/*<PlayPVDiagramQuestionInteractivePlot 
                     style={{width:Base_ImageURL_Width, height:Base_ImageURL_Height}}

                     imageURL = {Base_ImageURL}

                     onSelectedPointMove = {(pi) => {}}

                     onPointMove = {(p) => {}}

                     onSelectedCPPointMove = {(pi) => {}}

                     onCPPointMove = {(p) => {}}
                    showSolution = {true}

                    selectedPointMoveIndex = {null}
                    selectedCPPointMoveIndex = {null}

                    highlightedPoint = {highlightedPoint}
                    highlightedRelation = {highlightedRelation}
                />*/}

                <PlayPVDiagramQuestionInteractivePlot 
                     style={{width:Base_ImageURL_Width, height:Base_ImageURL_Height}}

                     imageURL = {Base_ImageURL}

                     groups = {Groups.map(g => ({...g, points: g.Points.map(p => ({
                        ...p,
                        name: p.Name,
                        color: p.InnerColor,
                        borderColor: p.OuterColor,
        
                        x: p.X,
                        y: p.Y,
                        cx:p.CX,
                        cy: p.CY,
        
                        marginX: p.MarginX,
                        marginY: p.MarginY
                     }))}))}

                     selectedGroupIndex = {selectedGroupIndex}

                     onSelectedPointMove = {(pi) => {}}

                     onPointMove = {(p) => {}}

                     onSelectedCPPointMove = {(pi) => {}}

                     onCPPointMove = {(p) => {}}

                    selectedPointMoveIndex = {null}
                    selectedCPPointMoveIndex = {null}

                    highlightedPoint = {highlightedPoint}
                    highlightedRelation = {highlightedRelation}

                    showSolution = {true}
                />
            </div>
        )
    }

    const renderSummary = () => {
        const group = newPointGroups[selectedGroupIndex]
        const {Code} = group

        let _totalPoints = 0
        let _maxPoints = 0

        for(const ev of finalEvaluations){
            const {finalEvaluation: evaluation} = ev

            const {maxPoints, totalPoints} = evaluation

            _totalPoints += totalPoints
            _maxPoints += maxPoints
        }

        const currentEvaluation = finalEvaluations[selectedGroupIndex]

        if(!currentEvaluation) return <div/>;

        const {finalEvaluation: evaluation} = currentEvaluation

        const {scorePointsPositionsShapes, scoreRelations, maxPoints, totalPoints} = evaluation

        const xRelations = scoreRelations.filter(r => r.Type === RELATION_X_POSITION_NUM)
        const yRelations = scoreRelations.filter(r => r.Type === RELATION_Y_POSITION_NUM)
        const mRelations = scoreRelations.filter(r => r.Type === RELATION_GRADIENT_NUM)

        const {Points, Base_ImageURL_Height, PDFURL} = PVDiagramQuestionPlay

        const answerCorrect = (maxPoints === totalPoints)

        return(
            <div
                className="hq-full-width"
            >
                <Space align="start">
                    <Space
                        className="pv-diagram-question-final-score"
                        align="center"
                    >
                        <p className="default-gray default-small">Final score</p>
                        <p className="default-title">{_totalPoints}{' '}/{' '}{_maxPoints}</p>
                    </Space>
                    {PDFURL && 
                        <ViewSolutionComponent
                                question={PVDiagramQuestionPlay}
                                correct={answerCorrect}
                            />}
                    {nextAction && 
                        <NextButton
                            nextAction={() => nextAction()}
                    />}
                </Space>
                <Divider/>
                <Space>
                    <Select
                        onChange={(v, option) => {
                            const {value: gIndex} = option
                            setSelectedGroupIndex(gIndex)
                        }}
                        defaultValue={'please select'}
                        value={Code}
                        className='play-q-pv-d-navigation-bar-groups-select'
                        options={(newPointGroups || []).map((d, di) => ({
                            value: di,
                            label: d.Code
                            }))}
                    />
                     <Space
                        className="pv-diagram-question-sub-score"
                        align="center"
                    >
                            <p className="default-gray default-small">Sub-score</p>
                            <p className="default-title">{totalPoints}{' '}/{' '}{maxPoints}</p>
                    </Space>
                </Space>
               
                <div
                    style={{height: Base_ImageURL_Height, overflowY:'scroll'}}
                >
                {scorePointsPositionsShapes.filter(r => r.checks.length).map((r, ri) => {
                    const {Id, Name, checks} = r
                    
                    return(
                        <div
                            key={Id}
                            className="hq-full-width play-pv-diagram-question-point-summary-line"

                            onMouseEnter = {() => setHighlightedPoint(ri)}

                            onMouseLeave = {() => setHighlightedPoint(null)}
                        >
                            <Space
                                align="center"
                                size="large"
                            >
                                <p
                                    className="default-gray"
                                >
                                    Point {' '}
                                    <span
                                        className="default-title"
                                    >
                                        {Name}
                                    </span>
                                </p>
                                {checks.map((c, ci) => {
                                        const {type, status, comment} = c  
                                                                            
                                        return(
                                            <div 
                                            
                                            key={ci}>
                                                <p className={"default-smallest default-gray"}>{type}</p>
                                                <Space>
                                                    {status ? 
                                                    <Tooltip
                                                        color="white"
                                                        title={<p>Condition satisfied</p>}
                                                    >
                                                        <i className="default-green hq-clickable">+1</i>
                                                    </Tooltip> : 
                                                    <Tooltip
                                                        color="white"
                                                        title={<p>Condition not satisfied</p>}
                                                    >
                                                        <i className="default-red hq-clickable">-1</i>
                                                    </Tooltip>}
                                                    {comment && <CommentInPlayComponent comment={comment}/>}
                                                </Space>
                                            </div>
                                        )
                                    })}
                            </Space>
                            
                        </div>
                    )
                })}
                <br/>

                {xRelations.map((r, ri) => {
                    const {FirstPoint, SecondPoint, Value, Type, status, Comment: comment} = r

                    const relationName = getNameForRelationNum(Type)


                    const {Name: n1} = FirstPoint
                    const {Name: n2} = SecondPoint

                    return(
                        <div
                            key={ri}
                            className="hq-full-width play-pv-diagram-question-relation-summary-line"

                            onMouseEnter = {() => setHighlightedRelation(r)}

                            onMouseLeave = {() => setHighlightedRelation(null)}
                        >
                            <Space
                                align="center"
                                size="small"
                            >
                                <p className="default-gray default-smaller">{relationName}</p>

                                &nbsp;&nbsp;

                                <span className="default-gray">Point <span className="default-title">{n1}</span></span> 

                                <p className="default-title">{Value}</p>

                                <span className="default-gray">Point <span className="default-title">{n2}</span></span> 
                                &nbsp;&nbsp;

                                {status ? 
                                <Tooltip
                                    color="white"
                                    title={<p>Condition satisfied</p>}
                                >
                                    <i className="default-green hq-clickable">+1</i>
                                </Tooltip> : 
                                <Tooltip
                                    color="white"
                                    title={<p>Condition not satisfied</p>}
                                >
                                    <i className="default-red hq-clickable">-1</i>
                                </Tooltip>}
                                {comment && <CommentInPlayComponent comment={comment}/>}

                            </Space>
                        </div>
                    )
                })}

                <br/>
                {yRelations.map((r, ri) => {
                    const {FirstPoint, SecondPoint, Value, Type, status, Comment: comment} = r

                    const relationName = getNameForRelationNum(Type)

                    const {Name: n1} = FirstPoint
                    const {Name: n2} = SecondPoint

                    return(
                        <div
                            key={ri}
                            className="hq-full-width play-pv-diagram-question-relation-summary-line"

                            onMouseEnter = {() => setHighlightedRelation(r)}

                            onMouseLeave = {() => setHighlightedRelation(null)}
                        >
                            <Space
                                align="center"
                                size="small"
                            >
                                <p className="default-gray default-smaller">{relationName}</p>

                                &nbsp;&nbsp;

                                <span className="default-gray">Point <span className="default-title">{n1}</span></span> 

                                <p className="default-title">{Value}</p>

                                <span className="default-gray">Point <span className="default-title">{n2}</span></span> 
                                
                                &nbsp;&nbsp;
                                
                                {status ? 
                                <Tooltip
                                    color="white"
                                    title={<p>Condition satisfied</p>}
                                >
                                    <i className="default-green hq-clickable">+1</i>
                                </Tooltip> : 
                                <Tooltip
                                    color="white"
                                    title={<p>Condition not satisfied</p>}
                                >
                                    <i className="default-red hq-clickable">-1</i>
                                </Tooltip>}
                                {comment && <CommentInPlayComponent comment={comment}/>}

                            </Space>

                            <br/>
                        </div>
                    )
                })}

                <br/>
                {mRelations.map((r, ri) => {
                    const {FirstPoint, SecondPoint, Value, Type, status, Comment: comment} = r
                    const {Name: n1, Id: Id1} = FirstPoint
                    const {Name: n2, Id: Id2} = SecondPoint

                    const fIndex = Points.findIndex(p => p.Id === Id1)
                    const sIndex = Points.findIndex(p => p.Id === Id2)

                    const relationName = getNameForRelationNum(Type)


                    let p1Next = newPoints[fIndex + 1]
                    let p2Next = newPoints[sIndex + 1]

                    if(!p1Next) p1Next = newPoints[0]
                    if(!p2Next) p2Next = newPoints[0]

                    const {name: nx1} = p1Next
                    const {name: nx2} = p2Next

                    return(
                        <div
                            key={ri}
                            className="hq-full-width"

                            onMouseEnter = {() => setHighlightedRelation(r)}

                            onMouseLeave = {() => setHighlightedRelation(null)}
                        >
                            <Space
                                align="center"
                                size="small"
                            >
                                <p className="default-gray default-smaller">{relationName}</p>

                                &nbsp;&nbsp;

                                <Space
                                    align="center"
                                >
                                    <span className="default-gray">(</span>
                                    <span className="default-title">{n1}</span>
                                    <ArrowRightOutlined className="default-title"/>
                                    <span className="default-title">{nx1}</span>
                                    <span className="default-gray">)</span>
                                </Space>

                                <p className="default-title">{Value}</p>

                                <Space
                                    align="center"
                                >
                                    <span className="default-gray">(</span>
                                    <span className="default-title">{n2}</span>
                                    <ArrowRightOutlined className="default-title"/>
                                    <span className="default-title">{nx2}</span>
                                    <span className="default-gray">)</span>
                                </Space>

                                &nbsp;&nbsp;
                                
                                {status ? 
                                <Tooltip
                                    color="white"
                                    title={<p>Condition satisfied</p>}
                                >
                                    <i className="default-green hq-clickable">+1</i>
                                </Tooltip> : 
                                <Tooltip
                                    color="white"
                                    title={<p>Condition not satisfied</p>}
                                >
                                    <i className="default-red hq-clickable">-1</i>
                                </Tooltip>}

                                {comment && <CommentInPlayComponent comment={comment}/>}

                            </Space>

                        </div>
                    )
                })}
                </div>
                
            </div>
        )
    }

    const renderQuestionBody = (questionText) => {
        return(
            <div
                className="pv-diagram-question-question-body"
            >
                <LatexRenderer latex={questionText}/>    
            </div>
        )
    }

    const renderQuestion = () => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, QuestionText,
            
        } = PVDiagramQuestionPlay

        return(
            <div>
                <Space align="start" size="large">
                <div>
                    {checkAnswer && 
                    <Space
                        className="hq-full-width"
                        direction="vertical"
                        align="center"
                    >
                        <Space
                            className="play-q-pv-diagram-your-solution"
                        >
                            <p className="default-gray default-small">Your solution</p>
                        </Space>
                    </Space>}
                    <PlayPVDiagramQuestionInteractivePlot 
                        style={{width:Base_ImageURL_Width, height:Base_ImageURL_Height}}
                        imageURL = {Base_ImageURL}

                        points={newPoints}
                        groups = {newPointGroups}
                        selectedGroupIndex = {selectedGroupIndex}

                        onSelectedPointMove = {(pi) => {
                            if(checkAnswer) return;
                            setSelectedPointMoveIndex(pi)
                            setSelectedCPPointMoveIndex(null)
                        }}

                        selectedPointMoveIndex = {selectedPointMoveIndex}

                        onPointMove = {(p, gi) => {
                            if(checkAnswer) return;

                            let _groups = [...newPointGroups]

                            let _points = [..._groups[gi].points]
                            const {x, y} = p

                            _points[selectedPointMoveIndex].x = x
                            _points[selectedPointMoveIndex].y = y
                            
                            //conform the control point this point
                            let nextPoint = _points[selectedPointMoveIndex + 1]
    
                            if(!nextPoint) nextPoint = _points[0]; //first point

                            const {x: nx, y: ny} = nextPoint

                            let cpX = (x + nx) * 0.5
                            let cpY = (y + ny) * 0.5

                            _points[selectedPointMoveIndex].cx = cpX
                            _points[selectedPointMoveIndex].cy = cpY

                            //Prev point
                            //conform the control point this point
                            let pIndex = selectedPointMoveIndex - 1
                            let prevPoint = _points[pIndex]
    
                            if(!prevPoint) {
                                pIndex = _points.length - 1
                                prevPoint = _points[pIndex]; // last point
                            }

                            const {x: px, y: py} = prevPoint

                            cpX = (x + px) * 0.5
                            cpY = (y + py) * 0.5

                            _points[pIndex].cx = cpX
                            _points[pIndex].cy = cpY

                            _groups[gi].points = _points

                            setNewPointGroups(_groups)
                            setHasPlayed(true)
                        }}

                        onSelectedCPPointMove = {(pi) => {
                            if(checkAnswer) return;

                            setSelectedPointMoveIndex(null)
                            setSelectedCPPointMoveIndex(pi)
                        }}

                        selectedCPPointMoveIndex = {selectedCPPointMoveIndex}

                        onCPPointMove = {(p, gi) => {
                            if(checkAnswer) return;

                            let _groups = [...newPointGroups]

                            let _points = [..._groups[gi].points]
                            const {x, y} = p

                            _points[selectedCPPointMoveIndex].cx = x
                            _points[selectedCPPointMoveIndex].cy = y

                            _groups[gi].points = _points

                            setNewPointGroups(_groups)
                            setHasPlayed(true)
                        }}

                        highlightedPoint = {highlightedPoint}
                        highlightedRelation = {highlightedRelation}
                    />
                </div>
                <div>
                    {QuestionText && !checkAnswer && renderQuestionBody(QuestionText)}

                    {checkAnswer && renderCorrectSolution()}
                    {checkAnswer && renderQuestionBody(QuestionText)}

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
                </div>
                <div>
                {checkAnswer && finalEvaluations.length && renderSummary()}
                </div>
                </Space>
               
            </div>
        )
    }

    //console.log(newPointGroups)

    return(
        <div>
            {contextHolder}
            {isLoadingPVDiagramQuestionPlay && <Skeleton />}

            {(!isLoadingPVDiagramQuestionPlay && errorGetPVDiagramQuestionPlay) && 
            
            <ErrorComponent 
                error={errorGetPVDiagramQuestionPlay}
                onReload = {() => getPVDiagramQuestionPlay(Id)}
            />}

            {!(isLoadingPVDiagramQuestionPlay || errorGetPVDiagramQuestionPlay) && PVDiagramQuestionPlay && renderQuestion()}
        </div>
    )
}