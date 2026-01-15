import React, { useState } from "react";
import {Button, Divider, Drawer, Form, Input, Space, Tabs, Tooltip, message } from "antd";
import {ArrowLeftOutlined, PlusOutlined, CloseCircleFilled, InsertRowAboveOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { CENTER_DIRECTION, EAST_DIRECTION, NORTH_DIRECTION, SOUTH_DIRECTION, WEST_DIRECTION } from "../Play/Constants";
import TextArea from "antd/es/input/TextArea";
import { AssignAnswersToQuestion } from "../Add/AssignAnswersToQuestion";
import { validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function AddEbTerm({open, onClose, question, reloadQuestion}) {

    if(!open) return <div/>;

    const {isLoadingAddEnergyBalanceEBT, addEnergyBalanceEBT,} = useQuestions()

    const [newCode, setNewCode] = useState('')
    const [newLatex, setNewLatex] = useState('')
    const [newLatexText, setNewLatexText] = useState('')

    const [currentTab, setCurrentTab] = useState(1)

    const [api, contextHolder] = message.useMessage()

    const [directions, setDirections] = useState({
        North: true,
        South: false,
        East: false,
        West: false,
        Center: false,
        IsDummy: false,
    })

    const [questions, setQuestions] = useState([])
    
    const [showAddQAnswers, setShowAddQAnswers] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)

    const renderAddQuestions = () => {
        return(
            <div>
                <Space>
                <p className="default-gray">Questions</p>
                <PlusOutlined 
                    style={{color:'green', cursor:'pointer'}} 
                    onClick={() => {
                        let _questions = [...questions]

                        _questions.push({
                            Latex:'',
                            Keyboard: null,
                            Answers: []
                        })

                        setQuestions(_questions)
                    }}
                />
                </Space>
                <br/>
                <br/>
                {questions.map((q, qi) => {
                                    const {Keyboard, Latex, Answers} = q

                                    return(
                                        <div key={qi}>
                                            <Space>
                                                &nbsp;
                                                <Tooltip 
                                                    title={<p>Click to remove question</p>}
                                                    color="white"
                                                >
                                                        <CloseCircleFilled 
                                                            style={{cursor:'pointer', color:'red'}}

                                                            onClick={() => {
                                                                
                                                                let _questions = [...questions]

                                                                _questions = _questions.filter((a, ai) => qi !== ai)

                                                                setQuestions(_questions)

                                                            }}
                                                        />
                                                    </Tooltip>
                                                    &nbsp;
                                                    <p className="default-gray">{qi+1}</p>
                                                    <Input 
                                                        type="text"
                                                        value={Latex}
                                                        className="hq-full-width"
                                                        placeholder="Latex code (must be unique)"
                                                        onChange={(v) => {
                                                            const value = v.target.value

                                                            let _questions = [...questions]

                                                            _questions[qi].Latex = value

                                                            setQuestions(_questions)
                                                        }}
                                                    />

                                                    <LatexRenderer latex={"$$" + Latex + "$$"}/>
                                                                    
                                                </Space>

                                                    
                                                <p className="hq-clickable hoverable-plus"
                                                        onClick={() => {
                                                            setShowAddQAnswers(true)
                                                            setSelectedQuestion(q)
                                                            setSelectedQuestionIndex(qi)
                                                            
                                                        }}
                                                    >Set answers</p>

                                            {Keyboard && 
                                            <Space>
                                                <InsertRowAboveOutlined />
                                                <p> {Keyboard.Name} </p>
                                            </Space>}

                                            {Answers.map((ans, ans_i) => {
                                                const {List} = ans 
                                                const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'
                        
                                                return(
                                                    <div
                                                        key={ans_i}
                                                        className="hq-full-width"
                                                    >
                                                        <Space>
                                                            &nbsp;
                                                            <Tooltip 
                                                                title={<p>Click to remove answer</p>}
                                                                color="white"
                                                            >
                                                                <CloseCircleFilled 
                                                                    style={{cursor:'pointer', color:'red'}}
                        
                                                                    onClick={() => {
                                                                        let _questions = [...questions]
                        
                                                                        _questions[qi].Answers = 
                                                                        _questions[qi].Answers.filter((a, ai) => ans_i !== ai)

                                                                        setQuestions(_questions)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                            &nbsp;
                                                            <p>{ans_i+1}</p>
                                                            &nbsp;
                                                            <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                                        </Space>
                                                    </div>
                                                )
                                            })}
                                            
                                        <Divider/>
                                        </div>
                                    )
                                })}
            </div>
        )
    }

    const setDirectionForEBTerms = (direction) => {
        let _directions = ({...directions})

        _directions[direction] = !_directions[direction]

        _directions.IsDummy = false

        const noDirectionSelected = ![NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION].map(a => _directions[a]).filter(r => r).length

        if(noDirectionSelected){
            _directions.North = true
        }

        setDirections(_directions)
        
    }
    
    const setDirectionIsDummyForEBTerms = () => {

        let _directions = ({...directions})

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            _directions[d] = false

        }

        _directions.IsDummy = true

        setDirections(_directions)
    }
    
    const {North, South, East, West, Center, IsDummy} = directions

    const renderInfo = () => {
        return(
            <div>
                <Form>
                    <Form.Item>
                        <p className="default-gray">Code</p>
                        <Input
                            placeholder="New Code"
                            value={newCode}
                            onChange={(v) => setNewCode(v.target.value)}
                        />
                    </Form.Item>

                    <br/>
                    <Form.Item>
                        <p className="default-gray">LaTeX code</p>
                        <Input
                            placeholder="New LaTeX"
                            value={newLatex}
                            onChange={(v) => setNewLatex(v.target.value)}
                        />
                    </Form.Item>
                    <LatexRenderer latex={"$$" + newLatex + "$$"}/>

                    <br/>

                    <Form.Item>
                        <p className="default-gray">Latex text (optional)</p>
                        <TextArea
                            value={newLatexText}
                            onChange={(v) => {
                                const value = v.target.value
                                setNewLatexText(value)
                            }}
                        />
                        <LatexRenderer latex={newLatexText || ""}/>
                    </Form.Item>

                </Form> 

                <br/>
                <p className="default-gray">Possible directions</p>
                <Space>
                    <p 
                        onClick={() => setDirectionForEBTerms(NORTH_DIRECTION)}
                        className={North ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                    >
                        North
                    </p>
                    <p 
                        onClick={() => setDirectionForEBTerms(SOUTH_DIRECTION)}
                        className={South ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                    >
                        South
                    </p>
                    <p
                        onClick={() => setDirectionForEBTerms(WEST_DIRECTION)}
                        className={West ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                    >
                        West
                    </p>
                    <p
                        onClick={() => setDirectionForEBTerms(EAST_DIRECTION)}
                        className={East ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                    >
                        East
                    </p>
                    <p 
                        onClick={() => setDirectionForEBTerms(CENTER_DIRECTION)}
                        className={Center ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                    >
                        Center
                    </p>
                    <p 
                        onClick={() => setDirectionIsDummyForEBTerms(CENTER_DIRECTION)}
                        className={IsDummy ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}>
                            IsDummy
                    </p>                                                                
                </Space>
            </div>
        )
    }

    const validateContent_EBTerms = () => {
        if(!newCode.trim()) return "Please add code"
        if(!newLatex.trim()) return "Please add code LaTeX code"

        if(!questions.length) return "Please add questions"
        if(questions.filter(q => !q.Latex.trim()).length) return "Atleast one question has no LaTeX code"
        if(questions.filter(q => !q.Keyboard).length) return "Atleast one question has no Keyboard"
        if(questions.filter(q => !q.Answers.length).length) return "Atleast one question has no answers"
        if(questions.filter(q => q.Answers.filter(a => validateKeyboardAnswer(a)).length).length) return "Atleast one question answer is invalid"

        return null
    }

    const validation = validateContent_EBTerms()

    return(
        <Drawer
        title={
        <Space
            size={"large"}
        >
            <p>Add EB Term Question</p>
            <Button 
                size="small"
                type="primary"

                loading={isLoadingAddEnergyBalanceEBT}

                onClick={() => {
                    if(validation){
                        api.destroy()
                        api.warning(validation)
                        return
                    }

                    const data = new FormData()

                    data.append('QuestionId', question.Id)

                    data.append('Code', newCode)
                    data.append('Latex', newLatex)
                    data.append('LatexTest', newLatexText)
                            
                    data.append("West", West)
                    data.append("East", East)
                    data.append("North", North)
                    data.append("South", South)
                    data.append("Center", Center)
                    data.append("IsDummy", !(West || East || North || South || Center))

                    let qs_vm = questions.map((q) => ({
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
                            }))
                    data.append('Questions', JSON.stringify(qs_vm))

                    addEnergyBalanceEBT(data).then((r) => handleResponse(r, api, 'Added successfully', 1, () => {
                        onClose()
                        reloadQuestion()
                    }))
                }}
            >
                    Add

            </Button>

            {validation &&
            <Tooltip
                color="white"
                title={<p>{validation}</p>}
            >
                <ExclamationCircleOutlined  style = {{color:'orange'}}/>
            </Tooltip>}
        </Space>}

        width={'100%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
    >   
        {contextHolder}
        
        <Tabs 
            items={[
            {
                key:1,
                label:'General info',
                children: <div>{renderInfo()} </div>
            },{
                key:2,
                label:'Add questions',
                children: <div>{renderAddQuestions()} </div>
            }]}

            activeKey={currentTab}
            onChange={(s) => {
                setCurrentTab(s)
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
                    let _questions = [...questions]

                    _questions[selectedQuestionIndex].Answers = a

                    setQuestions(_questions)
                }} 

                onUpdateKeyboard = {(k) => {
                    let _questions = [...questions]

                    _questions[selectedQuestionIndex].Keyboard = k

                    setQuestions(_questions)

                }}
            />

        
    </Drawer>
    )
}