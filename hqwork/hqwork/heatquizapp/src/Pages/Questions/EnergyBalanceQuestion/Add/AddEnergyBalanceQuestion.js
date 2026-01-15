import React from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { useState } from "react";
import { Button, Col, Divider, Input, List, Row, Space, Steps, Tabs, Tooltip, message } from "antd";
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";
import {ScheduleTwoTone, CheckCircleFilled, CloseCircleTwoTone, PictureTwoTone, ProjectTwoTone, PlusOutlined,  ExclamationCircleOutlined , CloseCircleFilled, DragOutlined, InsertRowAboveOutlined, SmileTwoTone, FrownTwoTone} from '@ant-design/icons';
import { UploadImage } from "../../../../Components/UploadImage";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

import './index.css'
import { CENTER_DIRECTION, EAST_DIRECTION, NORTH_DIRECTION, SOUTH_DIRECTION, WEST_DIRECTION } from "../Play/Constants";
import { SelectKeyboard } from "../../KeyboardQuestion/Add/SelectKeyboard";
import { AddAnswersToList } from "../Shared/AddAnswersToList";
import { AssignAnswersToQuestion } from "./AssignAnswersToQuestion";
import { UploadPDF } from "../../../../Components/UploadPDF";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";
import { AddCommentComponent } from "../../../../Components/AddCommentComponent.js/AddCommentComponent";
const { TextArea } = Input;

export function AddEnergyBalanceQuestion(){

    const {isLoadingAddEnergyBalanceQuestion, addEnergyBalanceQuestion} = useQuestions()
    const [currentTab, setCurrentTab] = useState(0)

    const [questionInfo, setQuestionInfo] = useState({
        Code:'',
        selectedSubtopic: null,
        selectedLOD: null,
        validation: 'Please fill data'
    })

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const [newImageWidth, setNewImageWidth] = useState(0)
    const [newImageHeight, setNewImageHeight] = useState(0)

    const imageRef = React.createRef()
    const [leftOffset, setLeftOffset] = useState(0)

    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)

    const [isMovingElement, setIsMovingElement] = useState(false)
    const [movedElement, setMovedElement] = useState(false)

    const [newParts, setNewParts] = useState([])
    const [hoverElement, setHoverElement] = useState(null) 

    const [currentSubtab, setCurrentSubtab] = useState(1)

    const [questionBody, setQuestionBody] = useState("")

    const [ebTerms, setEbTerms] = useState([])

    const [BCKeyboard, setBCKeyboard] = useState(null)
    const [showSelectKeyboardBC, setShowSelectKeyboardBC] = useState(false)
    const [showAddBCTerms, setAddBCTerms] = useState(false)
    const [bcTerms, setBCTerms] = useState([])


    const [ICKeyboard, setICKeyboard] = useState(null)
    const [showSelectKeyboardIC, setShowSelectKeyboardIC] = useState(false)
    const [showAddICTerms, setAddICTerms] = useState(false)
    const [icTerms, setICTerms] = useState([])

    const [showAddQAnswers, setShowAddQAnswers] = useState(false)
    const [selectedBCTermIndex, setSelectedBCTermIndex] = useState(0)
    const [selectedBCQuestionIndex, setSelectedBCQuestionIndex] = useState(0)
    const [selectedQuestion, setSelectedQuestion] = useState(null)

    const [newPDF, setNewPDF] = useState(null)
    const [newPDFURL, setNewPDFURL] = useState(null)

    const [api, contextHolder] = message.useMessage()

    const renderAddImage = () => {
        return(
            <div>
                <UploadImage 
                    onSetImage={(url, img) => {
                        setNewImageURL(url)
                        setNewImage(img)

                    }}

                    imageURL={newImageURL}

                    className="clickable-question-add-image-container"
                    classNameImage="clickable-question-add-image-inside"
                />
            </div>
        )
    }

    const renderAddQuestionBody = () => {
        return(
            <div className="hq-full-width">
                <p className="default-gray">Question body</p>

                <TextArea 
                    value={questionBody}
                    onChange={(v) => setQuestionBody(v.target.value)}
                    className="hq-full-width"

                />

                <br/>
                <LatexRenderer 
                    latex={questionBody}
                />
            </div>
        )
    }

    const renderControlVolumeList = () => {

        return(
            <div className="hq-full-width">
                <List 
                    dataSource={newParts}

                    renderItem={(p, pi) => {
                        const {correct, comment} = p
                        return(
                            <div
                            key={pi}
                            className="hq-full-width">
                                <Space>
                                    <p className="default-red default-large">{pi+1}</p>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove control volume</p>}
                                        color="white"
                                    >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                if(isMovingElement){
                                                    api.destroy()
                                                    api.warning("Please finish moving element #" + (movedElement + 1))
                                                    return
                                                }
            
                                                if(isAddingElementSecond){
                                                    api.destroy()
                                                    api.warning("Please finish adding")
                                                    return
                                                } 

                                                let _newParts = [...newParts]

                                                _newParts = _newParts.filter((a, ai) => ai !== pi)

                                                if(_newParts.length === 1){
                                                    _newParts[0].correct = true
                                                }

                                                setNewParts(_newParts)

                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <Tooltip
                                        color="white"
                                        title={<p>Click to move</p>}
                                    >
                                        <DragOutlined style={{color:'blue', cursor:'pointer'}} onClick={() => {
                                            if(isAddingElementSecond){
                                                api.destroy()
                                                api.warning("Please finish adding")
                                                return
                                            }

                                            if(isMovingElement){
                                                setIsMovingElement(false)
                                                setMovedElement(null)
                                                return
                                            }

                                            setIsMovingElement(true)
                                            setMovedElement(pi)
                                        }}/>
                                    </Tooltip>
                                    &nbsp;    
                                <Tooltip
                                    color="white"
                                    title={<p>Click to set as correct</p>}
                                >
                                    <div className="add-eb-question-correct-field">
                                    <p
                                        onClick={() => {
                                            let _newParts = [...newParts]

                                            _newParts = _newParts.map((a) => ({...a, correct: false}))

                                            _newParts[pi].correct = true

                                            setNewParts(_newParts)
                                        }}
                                        className={"hq-clickable " + (correct ? "default-green" : "default-gray")}>
                                            {correct ? "Correct" : "Incorrect"}
                                    </p>
                                </div>
                                </Tooltip>
                                &nbsp;    
                                <AddCommentComponent 
                                    className = "add-eb-question-comment-input"
                                    value={comment}
                                    onChange={(v) => {
                                        let _newParts = [...newParts]

                                        _newParts[pi].comment = v.target.value

                                        setNewParts(_newParts)
                                    }}
                                />                                
                            </Space>
                        <Divider />
                    </div>
                        )
                    }}
                />
            </div>
        )
    }

    const setDirectionForEBTerms = (ti, direction) => {

        let _terms = [...ebTerms]

        _terms[ti][direction] = !_terms[ti][direction]

        _terms[ti].IsDummy = false

        const noDirectionSelected = ![NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION].map(a => _terms[ti][a]).filter(r => r).length

        if(noDirectionSelected){
            _terms[ti].North = true
        }

        setEbTerms(_terms)
    }
    
    const setDirectionIsDummyForEBTerms = (ti) => {

        let _terms = [...ebTerms]

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            _terms[ti][d] = false

        }

        _terms[ti].IsDummy = true

        setEbTerms(_terms)
    }

    const renderEnergyBalanceTerms = () => {

        return(
            <div className="hq-full-width">
                <List 
                    dataSource={ebTerms}
                    
                    renderItem={(t, ti) => {
                        const {Code, Latex, LatexText, North, South, East, West, Center, IsDummy, Questions, comment} = t 
                        return(
                            <Space
                                key={ti}

                                direction="vertical"

                                className="hq-full-width"
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
                                                

                                                let _terms = [...ebTerms]

                                                _terms = _terms.filter((a, ai) => ai !== ti)

                                                setEbTerms(_terms)

                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <p className="default-gray">{ti+1}</p>

                                    <Input 
                                        type="text"
                                        value={Code}
                                        className="hq-full-width"
                                        placeholder="Term code (must be unique)"
                                        onChange={(v) => {
                                            const value = v.target.value

                                            let _terms = [...ebTerms]

                                            _terms[ti].Code = value

                                            setEbTerms(_terms)
                                        }}
                                    />
                                </Space>
                                <Space>
                                &nbsp;
                                <div className="add-eb-question-hide-element">
                                    <Tooltip>
                                    <CloseCircleFilled />
                                    </Tooltip>
                                </div>
                                &nbsp;
                                    <p className="default-white">{ti+1}</p>
                                    <Input 
                                        type="text"
                                        value={Latex}
                                        className="hq-full-width"
                                        placeholder="Latex code (must be unique)"
                                        onChange={(v) => {
                                            const value = v.target.value

                                            let _terms = [...ebTerms]

                                            _terms[ti].Latex = value

                                            setEbTerms(_terms)
                                        }}
                                    />

                                    <LatexRenderer latex={"$$" + Latex + "$$"}/>
                                </Space>
                                <Space>
                                    &nbsp;
                                    <div className="add-eb-question-hide-element">
                                        <Tooltip>
                                        <CloseCircleFilled />
                                        </Tooltip>
                                    </div>
                                    &nbsp;
                                    <p className="default-white">{ti+1}</p>
                                    <AddCommentComponent 
                                        className = "add-eb-question-comment-input"
                                        value={comment}
                                        onChange={(v) => {
                                            const value = v.target.value

                                            let _terms = [...ebTerms]

                                            _terms[ti].comment = value

                                            setEbTerms(_terms)
                                        }}
                                    />
                                </Space>
                                <br/>
                                <p className="default-gray">Instruction for definition (optional)</p>
                                <TextArea 
                                    value={LatexText}
                                    onChange={(v) => {
                                        const value = v.target.value

                                        let _terms = [...ebTerms]

                                        _terms[ti].LatexText = value

                                        setEbTerms(_terms)
                                    }}
                                />
                                <LatexRenderer latex={LatexText || ""}/>

                                <p className="default-gray">Possible directions</p>
                                <Space>
                                    <p 
                                        className={North ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                                        onClick={() => setDirectionForEBTerms(ti, NORTH_DIRECTION)}
                                    >
                                        North
                                    </p>
                                    <p 
                                        className={South ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                                        onClick={() => setDirectionForEBTerms(ti, SOUTH_DIRECTION)}
                                    >
                                        South
                                    </p>
                                    <p
                                        className={West ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                                        onClick={() => setDirectionForEBTerms(ti, WEST_DIRECTION)}
                                    >
                                        West
                                    </p>
                                    <p
                                        className={East ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                                        onClick={() => setDirectionForEBTerms(ti, EAST_DIRECTION)}
                                    >
                                        East
                                    </p>
                                    <p 
                                        className={Center ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                                        onClick={() => setDirectionForEBTerms(ti, CENTER_DIRECTION)}
                                    >
                                        Center
                                    </p>
                                    <p 
                                        onClick={() => setDirectionIsDummyForEBTerms(ti)}
                                        className={IsDummy ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}>
                                        IsDummy
                                    </p>                                                                
                                </Space>
                                <br/>
                                <Space>
                                    <p className="default-gray">Questions</p>
                                    <PlusOutlined 
                                        style={{color:'green', cursor:'pointer'}} 
                                        onClick={() => {
                                            let _terms = [...ebTerms]

                                            _terms[ti].Questions.push({
                                                Latex:'',
                                                Keyboard: null,
                                                Answers: [],
                                                Inflow: true
                                            })

                                            setEbTerms(_terms)
                                        }}
                                    />

                                </Space>
                                {Questions.map((q, qi) => {
                                    const {Keyboard, Latex, Answers, Inflow} = q

                                    return(
                                        <div key={qi} className="add-eb-question-term-question">
                                            <Space>
                                                &nbsp;
                                                <Tooltip 
                                                    title={<p>Click to remove question</p>}
                                                    color="white"
                                                >
                                                        <CloseCircleFilled 
                                                            style={{cursor:'pointer', color:'red'}}

                                                            onClick={() => {
                                                                
                                                                let _terms = [...ebTerms]

                                                                _terms[ti].Questions = _terms[ti].Questions.filter((a, ai) => qi !== ai)

                                                                setEbTerms(_terms)

                                                            }}
                                                        />
                                                    </Tooltip>
                                                    &nbsp;
                                                    <p className="default-gray">{qi+1}</p>
                                                    &nbsp;
                                                    
                                                    <div
                                                        onClick={(v) => {
                                                            let _terms = [...ebTerms]

                                                            _terms[ti].Questions[qi].Inflow = true

                                                            setEbTerms(_terms)
                                                        }}
                                                        className={"hq-clickable " + (!Inflow ? "eb-question-term-direction-inactive" : "eb-question-term-direction-green")}>
                                                            <span className="eb-question-term-word">Inflow</span>
                                                        </div>

                                                        <div 
                                                        onClick={(v) => {
                                                            let _terms = [...ebTerms]

                                                            _terms[ti].Questions[qi].Inflow = false

                                                            setEbTerms(_terms)
                                                        }}
                                                        className={"hq-clickable " + (Inflow ? "eb-question-term-direction-inactive" : "eb-question-term-direction-red")}>
                                                            <span className="eb-question-term-word">Outflow</span>
                                                    </div>
                                                    &nbsp;
                                                    &nbsp;

                                                    <Input 
                                                        type="text"
                                                        value={Latex}
                                                        className="hq-full-width"
                                                        placeholder="Latex code (must be unique)"
                                                        onChange={(v) => {
                                                            const value = v.target.value

                                                            let _terms = [...ebTerms]

                                                            _terms[ti].Questions[qi].Latex = value

                                                            setEbTerms(_terms)
                                                        }}
                                                    />

                                                    <LatexRenderer latex={"$$" + Latex + "$$"}/>
                                                                    
                                            </Space>
                                            <br/> 
                                            <br/>                                                    
                                            <Space size="large" align="start">
                                                <p className="hq-clickable hoverable-plus"
                                                    onClick={() => {
                                                        setShowAddQAnswers(true)
                                                        setSelectedQuestion(q)
                                                        setSelectedBCTermIndex(ti)
                                                        setSelectedBCQuestionIndex(qi)
                                                    }}
                                                    >
                                                    Set answers
                                                </p>
                                                
                                                <div>
                                                {Keyboard && 
                                                <Space>
                                                    <InsertRowAboveOutlined />
                                                    <p> {Keyboard.Name} </p>
                                                </Space>}
                                                <br/>
                                                {Answers.map((ans, ans_i) => {
                                                        const {List} = ans 
                                                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'
                                
                                                        return(
                                                            <div
                                                                key={ans_i}
                                                                className="hq-full-width"
                                                            >
                                                                <Space>
                                                                    <Tooltip 
                                                                        title={<p>Click to remove answer</p>}
                                                                        color="white"
                                                                    >
                                                                        <CloseCircleFilled 
                                                                            style={{cursor:'pointer', color:'red'}}
                                
                                                                            onClick={() => {
                                                                                let _terms = [...ebTerms]
                                
                                                                                _terms[ti].Questions[qi].Answers = 
                                                                                _terms[ti].Questions[qi].Answers.filter((a, ai) => ans_i !== ai)

                                                                                setEbTerms(_terms)
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                    &nbsp;
                                                                    <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                                                </Space>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </Space>

                                           
                                        </div>
                                    )
                                })}
                                <Divider />
                            </Space>
                        )
                    }}
                />
            </div>
        )
    }


    const renderBoundaryConditions = () => {
        return(
            <div>
                <p>Keyboard</p>
                            
                <div 
                    className="please-select-area" 
                    onClick={() => setShowSelectKeyboardBC(true)}
                >
                    {!BCKeyboard ? 
                        <Space>
                            <InsertRowAboveOutlined />
                            <small>Click to select a keyboard</small>
                        </Space> : 
                        <Space>
                            <InsertRowAboveOutlined />
                            <p> {BCKeyboard.Name} </p>
                        </Space>}
                </div> 
                        
                <br/>
                {BCKeyboard && <Space>
                    <p className="default-gray">Terms</p>
                    <PlusOutlined 
                        style={{color:'green', cursor:'pointer'}} 
                        onClick={() => {
                            setAddBCTerms(true)
                            setAddICTerms(false)
                        }}
                    />
                </Space>}
                {BCKeyboard &&
                <List 
                    dataSource={bcTerms}

                    renderItem={(bc, bci) => {
                        const {List, comment} = bc 
                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                        return(
                            <div
                                key={bci}
                                className="hq-full-width"
                            >
                                <Space>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove condition</p>}
                                        color="white"
                                    >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                let _terms = [...bcTerms]

                                                _terms = _terms.filter((t, ti) => bci !== ti)
                                                setBCTerms(_terms)

                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <p>{bci+1}</p>
                                    &nbsp;
                                    <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                </Space>
                                <AddCommentComponent 
                                        className = "add-eb-question-comment-input"
                                        value={comment}
                                        onChange={(v) => {
                                            const value = v.target.value

                                            let _terms = [...bcTerms]

                                            _terms[bci].comment = value

                                            setBCTerms(_terms)
                                        }}
                                    />
                            </div>
                        )
                    }}
                />}
            </div>
        )
    }

    const renderInitialConditions = () => {
        return(
            <div>
                <p>Keyboard</p>
                            
                <div 
                    className="please-select-area" 
                    onClick={() => setShowSelectKeyboardIC(true)}
                >
                    {!ICKeyboard ? 
                        <Space>
                            <InsertRowAboveOutlined />
                            <small>Click to select a keyboard</small>
                        </Space> : 
                        <Space>
                            <InsertRowAboveOutlined />
                            <p> {ICKeyboard.Name} </p>
                        </Space>}
                </div> 
                        
                <br/>
                {ICKeyboard && <Space>
                    <p className="default-gray">Terms</p>
                    <PlusOutlined 
                        style={{color:'green', cursor:'pointer'}} 
                        onClick={() => {
                            setAddBCTerms(false)
                            setAddICTerms(true)
                        }}
                    />
                </Space>}
                <br/>
                {ICKeyboard &&
                <List 
                    dataSource={icTerms}

                    renderItem={(bc, bci) => {
                        const {List, comment} = bc 

                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                        return(
                            <div
                                key={bci}
                                className="hq-full-width"
                            >
                                <Space>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove condition</p>}
                                        color="white"
                                    >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                let _terms = [...icTerms]

                                                _terms = _terms.filter((t, ti) => bci !== ti)
                                                setICTerms(_terms)

                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <p>{bci+1}</p>
                                    &nbsp;
                                    <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                </Space>
                                <AddCommentComponent 
                                        className = "add-eb-question-comment-input"
                                        value={comment}
                                        onChange={(v) => {
                                            const value = v.target.value

                                            let _terms = [...icTerms]

                                            _terms[bci].comment = value

                                            setICTerms(_terms)
                                        }}
                                    />
                            </div>
                        )
                    }}
                />}
            </div>
        )
    }

    const validateContent_QuestionInfo = () => {
        if(!questionBody.trim()) return "Add question body"

        return null
    }

    const validateContent_ControlVolume = () => {
        if(!newParts.length) return "Please add at least one control volume"

        return null
    }

    const validateContent_EBTerms = () => {
        if(!ebTerms.length) return "Please add terms"

        if(ebTerms.filter(a => !a.Code.trim()).length) return "Atleast one terms has no code"
        if(ebTerms.filter(a => !a.Latex.trim()).length) return "Atleast one terms has no LaTeX code"
        if(!ebTerms.filter(a => !a.IsDummy).length) return "Atleast one non-dummy term should exist"

        if(ebTerms.filter(a => !a.Questions.length).length) return "Atleast one terms has no questions"
        if(ebTerms.filter(a => a.Questions.filter(q => !q.Latex.trim()).length).length) return "Atleast one terms has no a question with no LaTeX code"
        if(ebTerms.filter(a => a.Questions.filter(q => !q.Keyboard).length).length) return "Atleast one terms has no a question with no Keyboard"
        if(ebTerms.filter(a => a.Questions.filter(q => !q.Answers.length).length).length) return "Atleast one terms has no a question with no answers"

        //Check repeated answers

        return null
    }

    const validateContent_BCTerms = () => {
        if(bcTerms.length){
            //Check repeated answers
        }

        return null
    }

    const validateContent_ICTerms = () => {
        if(ebTerms.length){
            //Check repeated answers
        }

        return null
    }

    const renderQuestionContent = () => {
        if(!newImage) {
            return (
                <div>
                    <p className="default-red">Please add an image</p>
                </div>
            )
        }

        const imageWidth = 0.35*window.innerWidth
        const imageHeight = ((newImageHeight*imageWidth)/newImageWidth)


        const validateInfo = validateContent_QuestionInfo()
        const validateCVs = validateContent_ControlVolume()

        const validateEBs = validateContent_EBTerms()

        const validateBCs = validateContent_BCTerms()
        const validateICs = validateContent_ICTerms()

        const tabs = [{
            key:1,
            label:
            <Space> 
                <p>Question text/info</p> 
            
                {validateInfo &&
                <Tooltip
                    color="white"
                    title={<p>{validateInfo}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,

            children: <div>{renderAddQuestionBody()} </div>
        },
        {
            key:2,
            label:
            <Space> 
                <p>Control volumes</p> 
            
                {validateCVs &&
                <Tooltip
                    color="white"
                    title={<p>{validateCVs}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,
            children: <div>{renderControlVolumeList()}</div>
        },
        {
            key:3,
            label:
            <Space> 
                <p>EB terms</p> 
            
                {validateEBs &&
                <Tooltip
                    color="white"
                    title={<p>{validateEBs}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,
            children: <div>{renderEnergyBalanceTerms()}</div>
        },
        {
            key:4,
            label:
            <Space> 
                <p>Boundary conditions</p> 
            
                {validateBCs &&
                <Tooltip
                    color="white"
                    title={<p>{validateBCs}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,
            children: <div>{renderBoundaryConditions()}</div>
        },
        {
            key:5,
            label:
            <Space> 
                <p>Initial conditions</p> 
            
                {validateICs &&
                <Tooltip
                    color="white"
                    title={<p>{validateICs}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,
            children: <div>{renderInitialConditions()}</div>
        }]

        return(
            <div className="hq-full-width">
                <Row>
                    <Col>
                        <div>
                            <img 
                            alt="new-map"
                            style={{width:imageWidth, height:imageHeight, cursor:'crosshair'}}
                            src={newImageURL}

                            ref={imageRef}

                            onClick={(e) => {
                                if(!(isAddingElement || isMovingElement)) return;

                                e.persist()

                                const {pageX, pageY} = e

                                const imgRef = imageRef.current
                                const parentNode = imgRef.parentNode.parentNode
                                const styles = window.getComputedStyle(parentNode)
                                const offset = Number(styles.getPropertyValue('padding-right').replace('px', ''))

                                setLeftOffset(offset)

                                const {top, left} = imgRef.getBoundingClientRect()
                                
                                if(!isAddingElementSecond && !isMovingElement){

                                    let newPart = ({
                                        x: pageX - left + offset,
                                        y: pageY - top,
                                        offsetX: offset,
                                        width: 1,
                                        height: 1,
                                        correct: !newParts.length
                                    })


                                    setNewParts(prev => [...prev, newPart])
                                    setIsAddingElementSecond(true)

                                    return
                                }

                                if(isAddingElementSecond){
                                    let parts = [...newParts]

                                    const newX = pageX - left + offset
                                    const newY = pageY - top

                                    let Last =  parts[parts.length-1]
                                
                                    Last.width = Math.abs(Last.x - newX)
                                    Last.height = Math.abs(Last.y - newY)
        
                                    Last.x = Math.min(Last.x,newX)
                                    Last.y = Math.min(Last.y, newY)

                                    setNewParts(parts)

                                    setIsAddingElement(false)
                                    setIsAddingElementSecond(false)
                                    return
                                }

                                if(isMovingElement){
                                    let parts = [...newParts]

                                    const newX = pageX - left + offset
                                    const newY = pageY - top
                                        
                                    parts[movedElement].x = newX
                                    parts[movedElement].y = newY

                                    setNewParts(parts)

                                    setIsMovingElement(false)
                                    setMovedElement(null)
                                    return
                                }
                            }}

                            onLoad={(img) => {

                                img.persist()

                                setNewImageWidth(img.target.naturalWidth)
                                setNewImageHeight(img.target.naturalHeight)
                            }}
                        />

                        {newParts.map((p, pi) => {
                            const {x, y, width, height, backgroundImage} = p

                            return( 
                                <div
                                    key={pi}
                                    style={{position:'absolute', left:x, top:y, width: width, height: height}}
                                    className="clickable-question-add-element"

                                    onMouseEnter={() => setHoverElement(pi)}
                                    onMouseLeave={() => setHoverElement(null)}
                                >
                                    {backgroundImage && 
                                    <img 
                                        alt="background"
                                        src={backgroundImage.URL}
                                        style={{width: width, height: height}}
                                    />}
                                    <Space className="hq-full-width" direction="vertical" align="center">
                                        <p className="default-red default-larger">{pi+1}</p>
                                    </Space>
                                </div>
                            )
                        })}
                        </div>
                    </Col>
                    <Col xs={2}/>
                    <Col>
                        <Space>
                            <Button
                                size = "small"
                                type = "primary"
                                onClick = {() => {
                                    if(isMovingElement){
                                        api.destroy()
                                        api.warning("Please finish moving element #" + (movedElement + 1))
                                        return
                                    }

                                    if(isAddingElementSecond){
                                        api.destroy()
                                        api.warning("Please finish adding")
                                        return
                                    }                                   

                                    if(isAddingElement){
                                        setIsAddingElement(false)

                                        return
                                    }

                                    setIsAddingElement(true)
                                    setCurrentSubtab(2)
                                }}
                            >   
                                Add  control volume
                            </Button>
                            
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => {
                                    const newTerm = ({
                                        Code:'',
                                        Latex:'',
                                        LatexText:'',

                                        North: true,
                                        South: false,
                                        East: false,
                                        West: false,
                                        Center: false,
                                        IsDummy: false,

                                        Questions:[]

                                    })

                                    let _terms = [...ebTerms]

                                    _terms.push(newTerm)

                                    setEbTerms(_terms)
                                    setCurrentSubtab(3)

                                }}
                            >
                                Add energy balance term
                            </Button>

                           
                        </Space>
                        <br/>
                        <br/>
                        <Tabs
                            defaultActiveKey={1}
                            items={tabs}
                            onChange={(t) => setCurrentSubtab(t)}
                            activeKey={currentSubtab}
                        />
                    </Col>
                </Row>
            </div>)
    }

    

    const selectContent = () => {
        const map = {
            0: () => 
            <AddQuestionFormSheet 
                existingInfo={questionInfo}
                onSetInfo = {(i) => setQuestionInfo(i)}
            />,
            1: () => renderAddImage(),
            2: () => renderQuestionContent(),
            3: () => renderFinalPage()
        }

        return map[currentTab]()
    }

    const validateAddImage = () => {
        if(!newImage)
            return "Please add an image"
    
        return null
    }

    const validateQuestionContent = () => {
        const validateInfo = validateContent_QuestionInfo()
        const validateCVs = validateContent_ControlVolume()

        const validateEBs = validateContent_EBTerms()

        const validateBCs = validateContent_BCTerms()
        const validateICs = validateContent_ICTerms()

        return (validateInfo || validateCVs || validateEBs || validateBCs || validateICs)
    }

    const selectImageValidation = validateAddImage()
    const questionContentValidation = validateQuestionContent()

    const canAdd = !questionInfo.validation && !selectImageValidation && !questionContentValidation

    const addQuestionClick = () => {
        if(!canAdd){
            api.destroy()
            api.warning("Please fill all required data")
            return
        }

        const imageWidth = 0.35*window.innerWidth
        const imageHeight = ((newImageHeight*imageWidth)/newImageWidth)       

        //Meta data
        const data = new FormData()
        data.append('Code', questionInfo.Code)
        data.append('SubtopicId', questionInfo.selectedSubtopic.Id)
        data.append('LODId', questionInfo.selectedLOD.Id)

        data.append('QuestionText', questionBody)

        //Supplementary materials
        data.append('PDF', newPDF)

        //Picture
        data.append('Picture', newImage)
        data.append('Width', Number.parseInt(imageWidth))
        data.append('Height', Number.parseInt(imageHeight))

        //CVs
        const CVs_VM = (newParts.map((cp) => ({

            X: Math.trunc(cp.x),
            Y: Math.trunc(cp.y),

            Width: Math.trunc(cp.width),
            Height: Math.trunc(cp.height),
            
            Correct: cp.correct,
            Comment: cp.comment
        })))

        data.append('ControlVolumes',JSON.stringify(CVs_VM))

        //EBTs
        const EBTerms_VM = (ebTerms.map((t) => ({
            Code: t.Code,
            Latex: t.Latex,
            LatexText: t.LatexText,
            Comment: t.comment,

            Questions: t.Questions.map((q) => ({
                LatexCode: q.Latex,

                Inflow: q.Inflow,
                
                KeyboardId: q.Keyboard.Id,
                Answers: q.Answers.map((a) => ({
                    AnswerElements: a.List.map((e,i) => (
                        {
                            NumericKeyId: e.NumericKeyId,
                            ImageId: e.VariableImageId,
                            Value:e.char,
                            Id: i,
                            Order:i
                        }))}
                        ))
            })),
            
            West: t.West,
            North: t.North,
            East: t.East,
            South: t.South,
            Center: t.Center,
            IsDummy: t.IsDummy,
        })))
        data.append('EnergyBalanceTerms',JSON.stringify(EBTerms_VM))

        //BCs
        if(BCKeyboard){
            data.append('BoundaryConditionsKeyboardId', BCKeyboard.Id)
            const BCs_VM = bcTerms.map((t) => ({
                Comment: t.comment,
                AnswerElements: t.List.map((e,i) => (
                    {
                        NumericKeyId: e.NumericKeyId,
                        ImageId: e.ImageId,
                        Value:e.char,
                        Order: i
                    }
            ))
        }))

            data.append('BoundaryConditions',JSON.stringify(BCs_VM))
        }
   
        //ICs
        if(ICKeyboard){
            data.append('InitialConditionsKeyboardId', ICKeyboard.Id)
            const ICs_VM = icTerms.map((t) => ({
                Comment: t.comment,
                AnswerElements: t.List.map((e,i) => (
                    {
                        NumericKeyId: e.NumericKeyId,
                        ImageId: e.ImageId,
                        Value:e.char,
                        Order: i
                    }
            ))
        }))
            data.append('InitialConditions',JSON.stringify(ICs_VM))
        }

        addEnergyBalanceQuestion(data)
        .then(r => handleResponse(r, api, 'Question added successfully', 1))
    }

    const renderFinalPage = () => {
        return(
            <Space direction="vertical">
                {!canAdd && <p className="default-red">Please fill all required data</p>}
                <br/>
                {canAdd && 
                    <Space size={'large'} align="start">
                        <div>
                            <p> Question solution (optional)</p>
                            <UploadPDF 
                                pdfURL={newPDFURL}

                                className="add-question-upload-pdf"
                                pdfClassName="add-question-upload-pdf-internal"

                                onSetPDF={(url, pdf) => {
                                    setNewPDFURL(url)
                                    setNewPDF(pdf)
                                }}
                            />
                        </div>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <Button
                            type="primary"
                            size="small" 
                            onClick={addQuestionClick}
                            loading={isLoadingAddEnergyBalanceQuestion}
                        >
                            Add question
                        </Button>
                    </Space>
                }
            </Space>
        )
    }

    console.log(bcTerms)

    const onChange = (newStep) => {setCurrentTab(newStep)}

    return(
        <PagesWrapper>
            {contextHolder}
            <Steps
                onChange={onChange}
                current={currentTab}
                items={[
                        {
                            title: 
                            <Space className={questionInfo.validation ? "highlighted" : "hoverable"}>
                                <p>Meta data{' '}</p>

                                {(!questionInfo.validation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{questionInfo.validation}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                            </Space>,
                            icon:<ScheduleTwoTone />
                        },
                        {
                            title:
                            <Space className={(!questionInfo.validation && selectImageValidation) ? "highlighted" : "hoverable"}>
                                <p>Add image{' '}</p>
                                {(!selectImageValidation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{selectImageValidation}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                           </Space>,
                            icon:<PictureTwoTone />
                        },
                        {
                            title:
                            <Space className={(!questionInfo.validation && !selectImageValidation && questionContentValidation) ? "highlighted" : "hoverable"}>
                                <p>Question content</p>
                                {(!questionContentValidation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{questionContentValidation}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                           </Space>,
                            icon:<ProjectTwoTone />
                        },
                        {
                            title: 'Final',
                            icon: canAdd ? <SmileTwoTone /> : <FrownTwoTone />
                        },
                    ]}
            />

            <br/>
            {selectContent()}

            <SelectKeyboard 
                open={showSelectKeyboardBC || showSelectKeyboardIC}
                onClose={() => {
                    setShowSelectKeyboardBC(false)
                    setShowSelectKeyboardIC(false)
                }}
                onSelect={(k) => {
                    setShowSelectKeyboardBC(false)
                    setShowSelectKeyboardIC(false)

                    if(showSelectKeyboardBC){
                        setBCKeyboard(k)
                        setBCTerms([])
                    }

                    else if(showSelectKeyboardIC){
                        setICKeyboard(k)
                        setICTerms([])
                    }
                }}
            />

            <AddAnswersToList 
                open={showAddBCTerms || showAddICTerms}
                selectedKeyboard={showAddBCTerms ? BCKeyboard : ICKeyboard}
                existingList={showAddBCTerms ? bcTerms : icTerms}
                onClose={() => {
                    setAddBCTerms(false)
                    setAddICTerms(false)
                }}

                onUpdateList={(l) => {
                    if(showAddBCTerms){
                       let _terms = [...bcTerms, ...l]
                        
                       setBCTerms(_terms)
                    }

                    else if(showAddICTerms){
                        let _terms = [...icTerms, ...l]
                        
                       setICTerms(_terms)
                    }

                }}
            />

            <AssignAnswersToQuestion 
                open={showAddQAnswers}
                onClose={() => {
                    setSelectedQuestion(null)
                    setShowAddQAnswers(false)
                }}

                usedKeyboard = {(selectedQuestion || {}).Keyboard}
                addedAnswers={(selectedQuestion || {}).Answers}

                onUpdateAnswers={(a) => {
                    let _terms = [...ebTerms]

                    _terms[selectedBCTermIndex].Questions[selectedBCQuestionIndex].Answers = a

                    setEbTerms(_terms)
                }} 

                onUpdateKeyboard = {(k) => {
                    let _terms = [...ebTerms]

                    _terms[selectedBCTermIndex].Questions[selectedBCQuestionIndex].Keyboard = k

                    setEbTerms(_terms)
                }}
            />

        </PagesWrapper>
    )
}