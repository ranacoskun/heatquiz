import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Col, Divider, List, Row, Skeleton, Space, Steps, Tooltip, message } from "antd";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { Keyboard } from "../../../../Components/Keyboard";
import { CloseCircleFilled, CheckCircleFilled, SmileTwoTone, FrownTwoTone,ExclamationCircleOutlined } from '@ant-design/icons';

import './index.css'
import { checkKeyboardAnswerIsCorrect, validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { DropVectorOnImage } from "./DropVectorOnImage";
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";
import { FBD_QUESTION_PLAY_FAKE_BOX_WIDTH_HEIGHT } from "./Constants";
import { MomentDirectionComponent } from "../Shared/MomentDirectionComponent";
import { NextButton } from "../../../../Components/NextButton";
import { ViewSolutionComponent } from "../../../../Components/ViewSolutionComponent";
import { CorrectVectorOnImage } from "./CorrectVectorOnImage";
import { useAuth } from "../../../../contexts/AuthContext";

export function FBDQuestionPlay({Id, deadLoad, onUpdateSeriesPlayElements, nextAction, mapKey}){

    const {FBDQuestionPlay, errorGetFBDQuestionPlay, isLoadingFBDQuestionPlay, getFBDQuestionPlay, postQuestionStatistic} = useQuestions()

    const {currentPlayerKey} = useAuth()
    
    const [currentTab, setCurrentTab] = useState(0)

    const [addedVTs, setAddedVTs] = useState([])
    const [addedVTsValidation, setAddedVTsValidation] = useState([])
    const [finalScore, setFinalScore] = useState(0)
    const [correct, setCorrect] = useState(false)

    const [allVectors, setAllVectores] = useState([])
    const [allAnswerableVectors, setAllAnswerableVectors] = useState([])
    const [allAddedAnswerableVectors, setAllAddedAnswerableVectores] = useState([])

    const [selectedVTDrop, setSelectedVTDrop] = useState(null)
    const [selectedVT, setSelectedVT] = useState(null)

    const [checkAnswer, setCheckAnswer] = useState(false)

    const [startTime, setStartTime] = useState(0)

    const [api, contextHolder] = message.useMessage()
    

    const loadData = () => {
        getFBDQuestionPlay(Id)

    }

    useEffect(() => {
        if(!deadLoad) loadData();

        setAddedVTsValidation([])
    }, [Id])

    useEffect(() => {
        if(checkAnswer){
            if(onUpdateSeriesPlayElements){

                const finalStatus = ({
                    Correct: correct,
                    Score: finalScore,
                    Answers: [],
                    Time: Date.now() - startTime,
                    Question: FBDQuestionPlay
                })
    
                onUpdateSeriesPlayElements(finalStatus)
            }
    
            const statsVM = ({
                QuestionId: FBDQuestionPlay.Id,
                Player: currentPlayerKey,
                Correct: correct,
                TotalTime: Math.trunc(0.001 * (Date.now() - startTime)),
                Key: mapKey,
                Score: finalScore
            })
            
            postQuestionStatistic(statsVM)
        }
    }, [checkAnswer])

    useEffect(() => {
        if(FBDQuestionPlay){
            const {ObjectBodies} = FBDQuestionPlay
            const vectors = ObjectBodies.flatMap(a => a.VectorTerms)

            setAllVectores(vectors)

            const answerableVTs = vectors.filter(a => a.Answers.length)

            setAllAnswerableVectors(answerableVTs)

            setStartTime(Date.now())
        }
    }, [FBDQuestionPlay])

    useEffect(() => {
        const vectors = addedVTs.filter(a => a.Answers.length)

        setAllAddedAnswerableVectores(vectors)
    }, [addedVTs])


    const flipAnswers = (answers) => {
        let _answers = [...answers]
        
        _answers = _answers.map((a) => {
            return({
                ...a,
                AnswerElements: [{Value:'-'}, {Value:'('}, ...a.AnswerElements, {Value:')'}]
            })
        })
        return _answers
    }

    const validateAddedVTsFinalScores = () => {
        const validations = addedVTs.map((t) => {
            const {Id} = t

            const originalTerm = allVectors.filter(x => x.Id === t.Id)[0]

            const {Angle: originalAngle, Clockwise: originalAngleClockwise} = originalTerm

            const {BodyObjectId, ObjectBody, Angle, Linear, Clockwise, Answer, Answers} = t

            //Check association
             const correctAssociation = (BodyObjectId === ObjectBody.Id)

            //Check direction
            let correctDirection = false
            let flipAnswer = false
            if(Linear){
                let _angle = Angle

                if(_angle < 0) _angle = _angle + 360
    
    
                let oppositeAngle = _angle + 180
                oppositeAngle = (oppositeAngle % 360)

                correctDirection = (Angle === originalAngle) ||  (_angle === originalAngle) || (oppositeAngle === originalAngle)

                flipAnswer = (oppositeAngle === originalAngle)

            }
            else{
                correctDirection = true
                flipAnswer = (originalAngleClockwise && !Clockwise)
            }

            //Check correct answer 
            let correctAnswer = true
            if(Answers.length){
                let _answers = [...Answers]

                if(flipAnswer){
                    _answers = flipAnswers(_answers)
                }

                const {answerStatus} = checkKeyboardAnswerIsCorrect(Answer, _answers)

                correctAnswer = answerStatus
            }


            return({
                Id,
                correctAssociation,
                correctDirection,
                correctAnswer,
                flipAnswer
            })
        }).sort((a, b) => a.Id - b.Id)

        setAddedVTsValidation(validations)

        //Scores 
        let totalPoints = allVectors.reduce((r, c) => {
            //Association
            r = r + 1

            //Direction
            r = r + 1

            //Definition
            r = r + (c.Answers.length ? 1 : 0)

            return r
        }, 0)

        let posPoints = validations.reduce((r, c, ci) => {
            const {
                correctAssociation,
                correctDirection,
                correctAnswer,
            } = c

            const realC = allVectors[ci]

            const {Answers} = realC

            const hasToBeDefined = Answers.length

            //Association
            r = r + (correctAssociation ? 1 : 0)

            //Direction
            r = r + (correctDirection ? 1 : 0)

            // Definition
            r = r + ((hasToBeDefined && correctAnswer) ? 1 : 0)

            return r
        }, 0)


        setFinalScore(posPoints + "/" + totalPoints)

        const isCorrect = (posPoints === totalPoints)

        setCorrect(isCorrect)
    }

    const validateFinalPage = () => {
        const hasAnswerableVTs = allAnswerableVectors.length

        if(addedVTs.length !== allVectors.length){
            return "Please add all vectors"
        }

        if(hasAnswerableVTs){
            const definitionsNotValid = addedVTs.filter(a => validateKeyboardAnswer(a.Answer)).length
            
            if(definitionsNotValid){
                return "Some term definitions are not correct"
            }   
        }

        return null

    }

    const onChange = (t) => {

        if(checkAnswer) return;

        const summaryValidation = validateFinalPage()
        const finalIndex = getFinalPageIndex()


        if(t === 1 && (addedVTs.length !== allVectors.length)){
            api.destroy()
            api.warning("Please add all vectors")

            return;
        }

        if(t === 1){
            if(allAddedAnswerableVectors.length){
                setSelectedVT(allAddedAnswerableVectors[0])
            }
            else{
                 setSelectedVT(null)
            }
        }

        if(t === finalIndex){
            if(summaryValidation){
                api.destroy()
                api.warning(summaryValidation)
    
                return
            }
            

            validateAddedVTsFinalScores()
            setCheckAnswer(true)
        }

        

        setCurrentTab(t)
    }   

    const renderQuestionBody = () => {
        const {QuestionText} = FBDQuestionPlay

        return(
            <div>
                {QuestionText && 
                    <div
                        className="eb-question-question-body"
                    >
                        <div>
                            <LatexRenderer latex={QuestionText}/>
                        </div>
                    </div>}
            </div>
        )
    }

    const renderAddTerms = () => {

        return(
            <div 
                className="hq-full-width"
            >   
                {renderQuestionBody()}
                <br/>
                <Space size={"large"} align="start">
                    <DropVectorOnImage 
                    
                    question={FBDQuestionPlay} 
                    
                    selectedVT={selectedVTDrop}
                    
                    onDropVT = {(vt, a, x, y, sBox) => {
                        const isDropped = selectedVTDrop && allVectors.filter(a => a.Id === selectedVTDrop.Id)

                        let vts = [...addedVTs]

                        if(isDropped){
                            vts = vts.filter(a => a.Id !== selectedVTDrop.Id)
                        }

                        let box = sBox

                        if(!box){
                            
                            box = ({
                                Id: Date.now(),
                                X: x - FBD_QUESTION_PLAY_FAKE_BOX_WIDTH_HEIGHT/2,
                                Y: y - FBD_QUESTION_PLAY_FAKE_BOX_WIDTH_HEIGHT/2,
                                
                                Width: FBD_QUESTION_PLAY_FAKE_BOX_WIDTH_HEIGHT,
                                Height: FBD_QUESTION_PLAY_FAKE_BOX_WIDTH_HEIGHT,

                                fake: true
                            })
                        }
                        
                        vts.push({
                            ...selectedVTDrop,
                            Answer:{
                                List:[],
                                echoNumber:0
                            },

                            X:x,
                            Y:y,

                            Angle:a,
                            ObjectBody:box
                        })

                        setAddedVTs(vts)
                        setSelectedVTDrop(null)
                    }}

                    addedVTs={addedVTs}
                    />

                    <div className="hq-full-width">
                        <List 
                            dataSource={allVectors}
                            renderItem={(v, vi) => {
                                const {Id, Latex, Linear} = v

                                const isSelected = selectedVTDrop && selectedVTDrop.Id === Id

                                const existingSelection = addedVTs.map((a, ai) => ({...a, index: ai})).filter(a => a.Id === Id)[0]
                                const Clockwise = existingSelection && existingSelection.Clockwise
                                return(
                                        <div key ={Id} >

                                            <Space>
                                                <div
                                                    className={(isSelected ? 'default-title' : '') + " hoverable-plus"}
                                                    onClick={() => {
                                                        if(isSelected) setSelectedVTDrop(null)
                                                        else setSelectedVTDrop(v)
                                                    }}>
                                                        <LatexRenderer
                                                            className="fbd-question-add-term-element"
                                                            latex={"$$" + Latex + "$$"} 
                                                        />
                                                </div>
                                                &nbsp;
                                                &nbsp;

                                                {existingSelection && 
                                                (Linear ? 
                                                <VectorDirectionComponent 
                                                    angleStep={5}
                                                    currentAngle={existingSelection.Angle}
                                                    widthHeight={0.03*window.innerWidth}
                                                    onUpdateAngle={(a) => {
                                                        let vts = [...addedVTs]
                                                        vts[existingSelection.index].Angle = a

                                                        setAddedVTs(vts)
                                                    }}


                                                    onUpdateAngleSafe = {(a) => {
                                                        let vts = [...addedVTs]
                                                        vts[existingSelection.index].Angle = a

                                                        setAddedVTs(vts)
                                                    }}

                                                    hasTextEditor = {true}
                                                />
                                                : 
                                                <MomentDirectionComponent
                                                    clockwise={Clockwise}
                                                    onFlip={() => {
                                                        let vts = [...addedVTs]
                                                        vts[existingSelection.index].Clockwise = !vts[existingSelection.index].Clockwise 

                                                        setAddedVTs(vts)
                                                    }}
                                                />
                                                )}
                                                &nbsp;
                                                &nbsp;
                                                {existingSelection && 
                                                <p 
                                                onClick={() => {
                                                    let vts = [...addedVTs]
                                                    vts = vts.filter(a => a.Id !== v.Id)
                                                    setAddedVTs(vts)
                                                }}
                                                className="default-gray default-small hq-clickable">Remove</p>}
                                            </Space>
                                            <br/>
                                            <br/>
                                        </div>
                                    )
                            }}
                        />
                    </div>
                </Space>
            </div>
        )
    }

    const renderDefineVT = () => {
        const {Keyboard: keyboard, Latex, Answer} = selectedVT

        const reducedLatex = Answer.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

        const answerValidity = validateKeyboardAnswer(Answer)

        return(
            <div className="fbd-question-term-answer-zone-base">
                <Space direction="vertical" align="start">
                    <p className="default-gray">Define</p>
                    <LatexRenderer latex={"$$" + Latex + "$$"} />
                </Space>
                <br/>
                <div className="fbd-question-term-answer-zone">
                    {reducedLatex && 
                    <LatexRenderer 
                        latex={"$$"+reducedLatex+"$$"}
                    />}
                </div>
                <small className="default-red">{answerValidity || ""}</small>
                <br/>
                <br/>
                <Keyboard 
                    Id={keyboard.Id}
                    List={Answer}
                    onEnterKey={(l) => {
                        const vtIndex = addedVTs.map((a, ai) => ({...a, index: ai})).filter(a => a.Id === selectedVT.Id)[0].index

                        let terms = [...addedVTs]

                        terms[vtIndex].Answer = l

                        setAddedVTs(terms)

                    }}
                />
            </div>
        )
    }

    const renderDefinitions = () => {        
        return(
            <div 
                className="hq-full-width"
            >   
                {renderQuestionBody()}
                <br/>
                <Space size={"large"} align="start">
                    <DropVectorOnImage 
                        question={FBDQuestionPlay} 
                                            
                        onDropVT = {(vt, a, x, y, sBox) => {}}

                        addedVTs={addedVTs}
                    />

                    <div>
                        <Row
                            gutter={[8, 8]}
                        >
                        {allAddedAnswerableVectors.map((v, vi) => {
                            const {Id, Latex, Answer} = v

                            const isSelected = selectedVT && selectedVT.Id === Id

                            let color = ""

                            const answerValidity = validateKeyboardAnswer(Answer)

                            if(!answerValidity){
                                color = "fbd-question-add-term-element-define-answered"
                            }

                            if(isSelected){
                                color = "fbd-question-add-term-element-define-selected"
                            }

                            return(
                                <Col
                                    key ={Id}
                                    onClick={() => setSelectedVT(v)}

                                    className={"fbd-question-add-term-element-define " + color}
                                >
                                    <LatexRenderer latex={"$$" + Latex + "$$"} />
                                </Col>
                            )
                        })}
                        </Row>

                        <br/>
                        {selectedVT && renderDefineVT()}
                    </div>
                </Space>
            </div>
        )
    }

    const getDrawingScore = () => {
        const drawingPoints = addedVTsValidation.reduce((r, c) => {

            const {correctAssociation} = c

            //Association
            r = r + (correctAssociation ? 1 : 0)

            return r
        }, 0)

        return (drawingPoints + "/" + allVectors.length)
    }

    const getDirectionDefinitionScore = () => {
        const DDPoints = addedVTsValidation.reduce((r, c, ci) => {
            const {correctDirection, correctAnswer} = c

            const realC = allVectors[ci]

            const {Answers} = realC

            const hasToBeDefined = Answers.length
            
           //Direction
           r = r + (correctDirection ? 1 : 0)

           // Definition
           r = r + ((hasToBeDefined && correctAnswer) ? 1 : 0)

            return r
        }, 0)

        const totalPoints =  allVectors.reduce((r, c) => {
            const {Answers} = c

            //Direction
            r = r + 1

            //Definition
            r = r + (Answers.length ? 1 : 0)

            return r
        }, 0)

        return (DDPoints + "/" + (totalPoints))
    }

    const renderFinalPage = () => {
        const {PDFURL, ObjectBodies} = FBDQuestionPlay

        const drawingScore = getDrawingScore()

        const DDScores = getDirectionDefinitionScore()

        const VTs = ObjectBodies.map(a => a.VectorTerms.map(t => ({...t, ObjectBody: a}))).flat()

        return(
            <div 
            className="hq-full-width"
        >   
            {renderQuestionBody()}
            <br/>
           
            <Space size={"large"} align="start">
                <div>
                    <DropVectorOnImage 
                        question={FBDQuestionPlay} 
                                            
                        onDropVT = {(vt, a, x, y, sBox) => {}}

                        addedVTs={addedVTs}
                    />
                    <p className="default-title">Your drawing</p>
                    <br/>
                    {checkAnswer && 
                    <Space align="start">
                        <Space
                            className="eb-question-question-final-score"
                            direction="vertical"
                            align="center"
                        >
                            <p className="default-title">{finalScore}</p>
                            <p className="default-gray default-small">final score</p>
                        </Space>
                        {PDFURL && 
                        <ViewSolutionComponent 
                            question={FBDQuestionPlay}
                            correct={finalScore === 1}
                        />}

                    {nextAction && 
                    <NextButton 
                        nextAction={() => nextAction()}
                      />}
                    </Space>
                 }
                </div>

                <div>
                    {/*<DropVectorOnImage 
                        question={FBDQuestionPlay} 
                                            
                        onDropVT = {(vt, a, x, y, sBox) => {}}

                        addedVTs={allVectors}
                    />*/}
                    <CorrectVectorOnImage 
                        question={FBDQuestionPlay} 
                                            
                        onDropVT = {(vt, a, x, y, sBox) => {}}

                        addedVTs={VTs}
                    />
                    <p className="default-green">Correct drawing</p>

                    
                </div>

                <div style={{overflowY:'scroll', height: window.innerHeight * 0.60, width: 0.4*window.innerWidth}}>
                    <Divider>
                        <Space size={'large'}>
                            <span className="default-gray hq-normal-font-weight">Vectors placement</span> 
                            <span className="default-title hq-normal-font-weight">{drawingScore}</span>
                        </Space>
                    </Divider>

                    {allVectors.map((v, vi) => {
                        const {Id, Latex} = v
                        const {correctAssociation} = addedVTsValidation[vi]
                        return(
                            <div
                                key={Id}
                            >
                                <Space>
                                    <p className="default-gray">{vi+1}</p>

                                    <LatexRenderer latex={"$$" + Latex + "$$"}/>

                                    {correctAssociation ? <CheckCircleFilled className="default-green"/> : <CloseCircleFilled className="default-red"/>}

                                    {correctAssociation ? <i className="default-green">+1</i> : <i className="default-red">-1</i>}
                                </Space>
                            </div>
                        )
                    })}

                    <Divider>
                        <Space size={'large'}>
                            <span className="default-gray hq-normal-font-weight">Direction & Definition</span> 
                            <span className="default-title hq-normal-font-weight">{DDScores}</span>
                        </Space>
                    </Divider>

                    {allVectors.map((v, vi) => {
                        const {Id, Latex, Linear, Angle, Answers, Clockwise,} = v

                        const addedVT = addedVTs.filter(t => t.Id === Id)[0]

                        const {Answer} = addedVT

                        const {correctDirection, correctAnswer, flipAnswer} = addedVTsValidation[vi]

                        const reducedLatex = Answer.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                        return(
                            <div
                                key={Id}
                            >
                            <div className="hq-element-container">
                                <Space direction="vertical" size={'large'}>
                                <Space align="start">
                                    <Space>
                                        <p className="default-gray">{vi+1}</p>

                                        <LatexRenderer latex={"$$" + Latex + "$$"}/>  
                                    </Space> 

                                    &nbsp;
                                    &nbsp; 
                                    &nbsp;
                                    &nbsp; 

                                    <Space>
                                        {Linear ? 
                                            <VectorDirectionComponent 
                                                angleStep={5}
                                                currentAngle={Angle}
                                                widthHeight={0.03*window.innerWidth}
                                                onUpdateAngle={(a) => {}}
                                                noUpdate = {true}
                                        /> : <div/>}   
                                        {correctDirection ? 
                                            <Tooltip
                                                    color="white"
                                                    title={<p>You assigned direction correctly</p>}
                                                >
                                                    <i className="default-green hq-clickable">+1</i>
                                                </Tooltip>
                                                : 
                                                <Tooltip
                                                    color="white"
                                                    title={<p>You assigned direction incorrectly, correct direction is shown here</p>}
                                                >
                                                    <i className="default-red hq-clickable">-1</i>
                                            </Tooltip>} 

                                        {flipAnswer && 
                                        <Tooltip
                                            color="white"
                                            title={
                                            <div>
                                                <p>Direction is considered correct since it is opposite of the correct direction.</p>
                                                <p> As a result, definition is also flipped.</p>
                                            </div>}
                                        >
                                            <ExclamationCircleOutlined className="default-title hq-clickable"/>
                                        </Tooltip>}
                                    </Space>

                                </Space>
                                <Space align="end">
                                    <div>
                                        {Answers.map((a, ai) => {

                                            let answerReduced = a.AnswerElements
                                            .sort((c,d) => c.Id > d.Id ? 1 : -1)
                                            .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

                                            answerReduced = flipAnswer ? "-(" + answerReduced + ")" : answerReduced

                                            return(
                                                <div
                                                    key={ai}
                                                    style={{width:'fit-content'}}
                                                >
                                                    <LatexRenderer latex={"$$" + answerReduced + "$$"}/>
                                                </div>
                                                )
                                            })}
                                            <p className="default-green">Correct solution</p>
                                        </div>
                                        &nbsp;
                                        &nbsp;
                                        &nbsp;
                                        <div>
                                            <Space>
                                                <LatexRenderer latex={"$$" + reducedLatex + "$$"}/>
                                                {correctAnswer ? <CheckCircleFilled className="default-green"/> : <CloseCircleFilled className="default-red"/>}
                                                            
                                                {correctAnswer ?
                                                    <Tooltip
                                                        color="white"
                                                        title={<p>Definition correct</p>}
                                                    >
                                                        <i className="default-green hq-clickable">+1</i>
                                                    </Tooltip>
                                                    : 
                                                    <Tooltip
                                                        color="white"
                                                        title={<p>Definition incorrect</p>}
                                                    >
                                                    <i className="default-red hq-clickable">-1</i>
                                                </Tooltip>}
                                            </Space>
                                            <p className="default-title">Your solution</p>
                                        </div>
                                    </Space>
                                </Space>

                                </div>
                                <br/>
                            </div>
                        )
                    })}
                </div>
            </Space>
        </div>
        )
    }

    const getFinalPageIndex = () => {
        let index =1 

        const hasAnswerableVTs = allAnswerableVectors

        if(hasAnswerableVTs) index = index + 1;

        return index
    }

    const renderContent = () => {
        const finalIndex = getFinalPageIndex()

        const map = {
            0: () => renderAddTerms(),
            [finalIndex]: () => renderFinalPage()
        }

        const hasAnswerableVTs = allAnswerableVectors.length

        if(hasAnswerableVTs){
            map[1] = () => renderDefinitions()
        }

        return map[currentTab]()
    }

    const renderQuestion = () => {
        const finalIndex = getFinalPageIndex()
        const summaryValidation = validateFinalPage()

        const items = [{
            key:'Draw FBD',
            title: <p className={currentTab === 0 ? "default-title highlighted" : "default-gray"}>Draw FBD</p>
        },
        ]

        const hasAnswerableVTs = allAnswerableVectors.length

        if(hasAnswerableVTs){
            items[1] = {
                key:'Definitions',
                title: <p className={currentTab === 1 ? "default-title highlighted" : "default-gray"}>Definitions</p>
            }
        }

        items.push({
            key:'Summary',
            title: <p className={currentTab === finalIndex ? "default-title highlighted" : "default-gray"}>Summary - Check answer</p>,
            icon: !summaryValidation ? <SmileTwoTone /> : <FrownTwoTone />
        })


        return(
            <div>
                <Steps 
                    
                    onChange={onChange}

                    current={currentTab}

                    items={items}
                />
                <br/>
                {renderContent()}
            </div>
        )
    }
    
    return(
        <div>
            {contextHolder}
            {isLoadingFBDQuestionPlay && <Skeleton />}

            {(!isLoadingFBDQuestionPlay && errorGetFBDQuestionPlay) && 
                <ErrorComponent 
                    error={errorGetFBDQuestionPlay}
                    onReload={() => loadData}
                />}

            {!(isLoadingFBDQuestionPlay || errorGetFBDQuestionPlay) && FBDQuestionPlay && renderQuestion()}

        </div>
    )
}