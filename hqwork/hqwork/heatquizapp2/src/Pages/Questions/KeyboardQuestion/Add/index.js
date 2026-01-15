import React, { useState } from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, Divider, Input, Row, Space, Steps, Switch, Tooltip, message } from "antd";
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";
import {ScheduleTwoTone, ProjectTwoTone, SmileTwoTone, FrownTwoTone, WarningTwoTone, CheckCircleFilled, CloseCircleTwoTone, InsertRowAboveOutlined, CloseCircleFilled} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

import './index.css'
import { UploadImage } from "../../../../Components/UploadImage";
import { SelectDefaultImage } from "../../../../Components/SelectDefaultImage";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { SelectKeyboard } from "./SelectKeyboard";
import { Keyboard } from "../../../../Components/Keyboard";
import { validateKeyboardAnswer } from "../Functions";
import { UploadPDF } from "../../../../Components/UploadPDF";
import { handleResponse } from "../../../../services/Auxillary";

export function AddKeyboardQuestion(){

    const [api, contextHolder] = message.useMessage()

    const {isLoadingAddKeyboardQuestion, addKeyboardQuestion} = useQuestions()

    const [currentTab, setCurrentTab] = useState(0)

    const [questionInfo, setQuestionInfo] = useState({
        Code:'',
        selectedSubtopic: null,
        selectedLOD: null,
        validation: 'Please fill data'
    })

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const [newPDF, setNewPDF] = useState(null)
    const [newPDFURL, setNewPDFURL] = useState(null)

    const [selectedDefaultImage, setSelectedDefaultImage] = useState(null)

    const [newLatex, setNewLatex] = useState('-question-text-')
    const [additionalInfo, setAdditionalInfo] = useState('')

    const [showSelectKeyboard, setShowSelectKeyboard] = useState(false)
    const [selectedKeyboard, setSelectKeyboard] = useState(null)
    const [isEnergyBalance, setIsEnergyBalance] = useState(false)
    const [disableDivision, setDisableDivision] = useState(true)

    const [answers, setAnswers] = useState([])
    const [selectedAnswer, setSelectedAnswer] = useState(0)

    const onChange = (value) => setCurrentTab(value);

    const validateImage = () => {
        if(!newImage && !selectedDefaultImage){
            return "Please upload an image or select an image"
        }

        return null
    }

    const validateQuestionText = () => {
        if(!newLatex.trim()){
            return "Please add question text"
        }

        return null
    }

    const validateAnswers = () => {
        if(!answers.length){
            return "Please select a keyboard and then add answers"
        }

        for(const a of answers){
            const validateAnswer = validateKeyboardAnswer(a, isEnergyBalance)

            if(validateAnswer){
                return validateAnswer
            }
        }

        return null
    }


    const imageValidation = validateImage()
    const questionTextValidation = validateQuestionText()
    const answersValidation = validateAnswers()

    const questionContentIsValid = (!imageValidation && !questionTextValidation && !answersValidation)
    const questionContentFeedback = (imageValidation || questionTextValidation || answersValidation)

    const canAdd = !questionInfo.validation && (questionContentIsValid)


    const removeAnswer = (ai) => {
        let _answers = [...answers]

        _answers = _answers.filter((a, aii) => aii !== ai) 

        setAnswers(_answers)
    }

    const renderQuestionContent = () => {

        return(
            <div>
                <Row>
                    <Col xs = {6}>
                        <Space direction="vertical">
                            <Space size={'small'}>
                                <p>Image</p>

                                {imageValidation && 
                                <Tooltip
                                    color="white"
                                    title={<p>{imageValidation}</p>}
                                    placement="top"
                                    
                                >
                                    <WarningTwoTone size={'large'} twoToneColor={'orange'}/>
                                </Tooltip>}
                            </Space>

                            <Space size={'large'}>
                                <UploadImage 
                                    onSetImage={(url, img) => {
                                        setNewImageURL(url)
                                        setNewImage(img)

                                        setSelectedDefaultImage(null)
                                    }}

                                    imageURL={newImageURL}

                                    className="add-keyboard-question-img-box"
                                    classNameImage="add-keyboard-question-img-box-inside-img"
                                />
                                <SelectDefaultImage 
                                    onSetImage={(di) => {
                                        setNewImageURL(null)
                                        setNewImage(null)

                                        setSelectedDefaultImage(di)
                                    }}

                                    imageURL={(selectedDefaultImage || {ImageURL:''}).ImageURL}

                                    className="add-keyboard-question-img-box"
                                    classNameImage="add-keyboard-question-img-box-inside-img"
                                />
                            </Space>
                        </Space>
                    </Col>
                    <Col xs = {1}/>

                    <Col xs = {9}>
                            <Space size={'small'}>
                                <p>Question text</p>
                                {questionTextValidation && 
                                    <Tooltip
                                        color="white"
                                        title={<p>{questionTextValidation}</p>}
                                        placement="top"
                                        
                                    >
                                        <WarningTwoTone size={'large'} twoToneColor={'orange'}/>
                                    </Tooltip>}
                            </Space>
                            <TextArea 
                                value={newLatex}
                                rows={4} 
                                onChange={(v) => setNewLatex(v.target.value)}
                            />

                            <br/>

                            <LatexRenderer latex={newLatex} />

                            <br/>

                            <p>Additional info</p>
                            <Input 
                                type="text"
                                placeholder="...."
                                value={additionalInfo}
                                onChange={(v) => setAdditionalInfo(v.target.value)}
                            />
                    </Col>
                    <Col xs = {1}/>
                    <Col xs = {7}>
                        <Space direction="vertical">
                            <p>Keyboard</p>
                            
                            <div 
                                className="please-select-area" 
                                onClick={() => setShowSelectKeyboard(true)}
                            >
                                {!selectedKeyboard ? 
                                <Space>
                                    <InsertRowAboveOutlined />
                                    <small>Click to select a keyboard</small>
                                </Space> : 
                                <Space>
                                    <InsertRowAboveOutlined />
                                    <p> {selectedKeyboard.Name} </p>
                                </Space>}
                            </div> 

                            <br/>

                            <Space direction="vertical">
                            <Tooltip
                                placement="top"
                                color="white"
                                title={
                                    <div
                                    >
                                        <p><strong>Energy balance questions</strong> are tasks where students have to establish an energy balance equation and are required to use the equal operand "="</p>
                                        <p>e.g.</p>
                                        <LatexRenderer className="default-black" latex={"$$ Q_{in} - Q_{out} = dQ/dT $$"}/>
                                        <Divider/>
                                        <p><strong>Normal questions</strong> are tasks where students are not required to make a balance but rather define a certain term</p>
                                        <p>e.g.</p>
                                        <LatexRenderer className="default-black" latex={"$$ 1/3 $$"}/>
                                    </div>
                                }
                            >
                                <Switch 
                                    checked={isEnergyBalance}
                                    onChange={() => {
                                        setIsEnergyBalance(!isEnergyBalance)
                                        setAnswers([])
                                        setSelectedAnswer(null)
                                    }}
                                    checkedChildren="Energy balance question" 
                                    unCheckedChildren="Normal question" 
                                />
                            </Tooltip>
                            <Tooltip
                                placement="top"
                                color="white"
                                title={
                                    <div
                                    >
                                        <p>Division operation can be enabled or disabled based on user preference. Some question do not need division while some do.</p>
                                        <br/>
                                        <p>Generally, it is better to avoid this operand and design a keyboard that has pre-defined fraction terms.</p>
                                        <p>e.g.</p>
                                        <LatexRenderer className="default-black" latex={"$$ 1/3 \\quad  1/{\\Phi} \\quad 1/{\\pi} \\quad 1/{\\sqrt{2}} $$"}/>

                                    </div>
                                }
                            >
                                <Switch 
                                    checked={!disableDivision}
                                    onChange={() => {
                                        setDisableDivision(!disableDivision)
                                        setAnswers([])
                                        setSelectedAnswer(null)
                                    }}
                                    checkedChildren="Division is Enabled" 
                                    unCheckedChildren="Division is Disabled" 
                                />
                            </Tooltip>
                            </Space>
                        </Space>
                    </Col>
                </Row>

                <Divider/>
                <Space size={'small'}>
                    <Button
                        size="small"
                        type="primary"

                        onClick={() => {
                            if(!selectedKeyboard){
                                api.destroy()
                                api.warning('Please select a keyboard')
                                
                                return
                            }

                            setSelectedAnswer(answers.length)
                            setAnswers((prev) => [...prev, {List:[], echoNumber:0}])
                        }}
                    >
                        Add answer
                    </Button>

                    {answersValidation && 
                        <Tooltip
                            color="white"
                            title={<p>{answersValidation}</p>}
                            placement="top"
                        >
                            <WarningTwoTone size={'large'} twoToneColor={'orange'}/>
                        </Tooltip>}
                </Space>

                <br/>
                <br/>
                {answers.map((a, ai) => {
                    const reducedLatex = a.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '---'

                    const isSelected = (ai === selectedAnswer)

                    const validateAnswer = validateKeyboardAnswer(a, isEnergyBalance)

                    return(
                        <div>

                            <Space align="center" className={"add-keyboard-answer-line " + (isSelected ? 'default-title' : '')}>
                                &nbsp;
                                <Tooltip
                                    color="white"
                                    placement="top"
                                    title={<p>Delete answer</p>}
                                >
                                    <CloseCircleFilled 
                                        onClick={() => removeAnswer(ai)}
                                        style={{color:'red', cursor:'pointer'}}
                                    />
                                </Tooltip>
                                &nbsp;
                                <Space 
                                onClick={() => setSelectedAnswer(ai)}
                                className="hoverable">
                                    <p className="default-gray">{ai+1}</p>
                                    <LatexRenderer latex={"$$" + reducedLatex + "$$"} />
                                </Space>

                                &nbsp;&nbsp;&nbsp;&nbsp;<small className="default-red">{' '}{validateAnswer}</small>
                            </Space>


                        </div>
                    )
                })}
                {selectedKeyboard && answers.length ?
                <Keyboard 
                    Id={selectedKeyboard.Id}
                    List={answers[selectedAnswer]}
                    onEnterKey={(list) => {
                        let _answers = [...answers]

                        _answers[selectedAnswer] = list
                        
                        setAnswers(_answers)
                    }}

                    enableDivision={!disableDivision}
                    isEnergyBalance={isEnergyBalance}
                /> : <div/>}
                
            </div>
        )
    }

    const addQuestion = () => {
        const data = new FormData()
        data.append('Code', questionInfo.Code)
        data.append('SubtopicId',  questionInfo.selectedSubtopic.Id)
        data.append('LODId', questionInfo.selectedLOD.Id)

        data.append('Public', false)
        data.append('Attributes', "")

        data.append('AnswerForLatex', newLatex)
        data.append('AdditionalInfo', additionalInfo)

        data.append('KeyboardId', selectedKeyboard.Id)

        data.append('IsEnergyBalance', isEnergyBalance)
        data.append('DisableDevision', disableDivision)
        data.append('AnswersString', JSON.stringify({
            Answers: answers.map((a) =>(
                {
                    Answer: a.List.map((e,i) => (
                    {
                        NumericKeyId: e.NumericKeyId,
                        ImageId: e.VariableImageId,
                        Value:e.char,
                        Order: i
                    }
                ))}))
        }))
        
        data.append('Picture', newImage)
        data.append('DefaultImageId', (selectedDefaultImage ||{Id:null}).Id)
        
        data.append('PDF', newPDF)
        
        addKeyboardQuestion(data)
            .then(r => handleResponse(r, api, 'Question added successfully', 1))
            

    }

    const renderFakeQuestion = () => {
        const imageURL = newImageURL || (selectedDefaultImage || {ImageURL:''}).ImageURL

        if(!imageURL) return <div/>

        return(
            <div>
                <Divider orientation="left">
                    <Space>
                    <p>Approximation for rendered question</p> 
                    <Button 
                        type="primary" 
                        size="small" 
                        loading={isLoadingAddKeyboardQuestion}
                        onClick={() => addQuestion()}    
                    > 
                        Add question
                    </Button>
                    </Space>
                </Divider>
                <br/>
                <Space 
                className="keyboard-question-play-info-row"
                size={'large'}>
                    <img 
                        alt={questionInfo.Code}
                        src={imageURL}
                        className="keyboard-question-play-img"
                    />
                   <div className="keyboard-question-play-info-answer-line">
                    <LatexRenderer 
                            latex={newLatex}
                    />
                    <br/>
                    
                    <LatexRenderer 
                        latex={"-"}
                    />                                          
                   </div>
                </Space>
                <Divider/>
                  
                <Keyboard 
                    Id={selectedKeyboard.Id}
                    List={{List:[]}}
                    onEnterKey={(list) => {}}
                    enableDivision={!disableDivision}
                    isEnergyBalance={isEnergyBalance}
                />
            </div>
        )

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
                        {renderFakeQuestion()}
                    </Space>
                }
            </Space>
        )
    }

    const selectContent = () => {
        const map = {
            0: () => 
            <AddQuestionFormSheet 
                existingInfo={questionInfo}
                onSetInfo = {(i) => setQuestionInfo(i)}
            />,
            1: () => renderQuestionContent(),
            2: () => renderFinalPage(),
        }

        return map[currentTab]()
    }

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
                            title:<Space className={(!questionInfo.validation && !questionContentIsValid) ? "highlighted" : "hoverable"}><p>Question content{' '}</p>
                            
                            {(questionContentIsValid ? <CheckCircleFilled style={{color:'green'}}/> : 
                            <Tooltip 
                                color="white"
                                title={<p>{questionContentFeedback}</p>}
                                placement="top"
                            >
                                <CloseCircleTwoTone twoToneColor={'red'}/>
                            </Tooltip>
                            )}</Space>,
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
                open={showSelectKeyboard}
                onClose={() => setShowSelectKeyboard(false)}
                onSelect={(k) => {
                    setSelectKeyboard(k)
                    setShowSelectKeyboard(false)
                    setAnswers([])
                    setSelectedAnswer(0)
                }}
            />
        </PagesWrapper>
    )
}