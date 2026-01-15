import React, { useState } from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, Divider, Dropdown, Input, List, Row, Space, Steps, Tooltip, message } from "antd";
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";
import {ScheduleTwoTone, ProjectTwoTone, SmileTwoTone, WarningTwoTone, CheckCircleFilled, CloseCircleTwoTone, CloseCircleFilled, FrownTwoTone } from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

import './index.css'
import { UploadImage } from "../../../../Components/UploadImage";
import { SelectDefaultImage } from "../../../../Components/SelectDefaultImage";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { UploadPDF } from "../../../../Components/UploadPDF";
import { handleResponse } from "../../../../services/Auxillary";

export function AddMutlipleChoiceQuestion(){

    const [api, contextHolder] = message.useMessage()

    const {isLoadingAddMultipleChoiceQuestion, addMultipleChoiceQuestion,} = useQuestions()

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

    const [choices, setChoices] = useState([])

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

    const validateChoices = () => {
        if(!choices.length){
            return "Please add choices"
        }

        if(!choices.filter(c => c.Correct).length)
        {
            return "Please add atleast one correct answer"
        }

        if(choices.filter(c => !c.ImageURL && !c.Latex.trim()).length)
        {
            return "One choice has no LaTeX nor an image"
        }

        return null
    }


    const ImageValidation = validateImage()
    const questionTextValidation = validateQuestionText()
    const choicesAreValid = validateChoices()

    const questionContentIsValid = (!ImageValidation && !questionTextValidation && !choicesAreValid)
    const questionContentFeedback = (ImageValidation || questionTextValidation || choicesAreValid)

    const canAdd = !questionInfo.validation && (questionContentIsValid)

    const removeChoice = (ci) => {
        let _cs = [...choices]
        _cs = _cs.filter((c, i) => i !== ci)
        setChoices(_cs)
    }

    const renderQuestionContent = () => {

        return(
            <div>
                <Row>
                    <Col xs = {6}>
                       <Space direction="vertical">
                       <Space size={'small'}>
                            <p>Image</p>

                            {ImageValidation && 
                            <Tooltip
                                color="white"
                                title={<p>Please upload an image or select an image</p>}
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

                                className="add-multiple-choice-question-img-box"
                                classNameImage="add-multiple-choice-question-img-box-inside-img"
                            />
                            <SelectDefaultImage 
                                onSetImage={(di) => {
                                    setNewImageURL(null)
                                    setNewImage(null)

                                    setSelectedDefaultImage(di)
                                }}

                                imageURL={(selectedDefaultImage || {ImageURL:''}).ImageURL}

                                className="add-multiple-choice-question-img-box"
                                classNameImage="add-multiple-choice-question-img-box-inside-img"
                            />
                        </Space>
                       </Space>
                    </Col>
                    <Col xs = {1} />
                    
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
                </Row>

                <Divider/>
                <Space size={'small'}>
                    <Button
                        size="small"
                        type="primary"

                        onClick={() => {
                            const isCorrect = !choices.length

                            setChoices((prev) => [...prev, {Image:null, ImageURL:null, Latex:'', Correct:isCorrect}])
                        }}
                    >
                        Add choice
                    </Button>

                    {choicesAreValid && 
                        <Tooltip
                            color="white"
                            title={<p>{choicesAreValid}</p>}
                            placement="top"
                        >
                            <WarningTwoTone size={'large'} twoToneColor={'orange'}/>
                        </Tooltip>}
                </Space>

                <br/>
                <br/>
                {choices.length ? 
                <List
                    dataSource={choices}

                    renderItem={(c, ci) => {
                        const {Latex, ImageURL, Correct} = c
                        return(
                            <div>
                                <Space
                                    align="start"
                                >
                                    &nbsp;
                                    <Tooltip
                                        color="white"
                                        placement="top"
                                        title={<p>Delete choice</p>}
                                    >
                                        <CloseCircleFilled 
                                            onClick={() => removeChoice(ci)}
                                            style={{color:'red', cursor:'pointer'}}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <Dropdown
                                        menu={{
                                            items:[{
                                                key:'flip_sign',
                                                label:  <p className={(!Correct ? "default-green" : "default-red")}>
                                                            {!Correct ? 'Correct' : 'False'}
                                                        </p>,
                                                onClick: () => {
                                                    let _cs = [...choices]

                                                    _cs[ci].Correct = !Correct

                                                    setChoices(_cs)
                                                }
                                            }]
                                        }}
                                    >
                                        <p className={"add-multiple-choice-question-correct-false " + (Correct ? "default-green" : "default-red")}>
                                            {Correct ? 'Correct' : 'False'}
                                        </p>
                                    </Dropdown>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <div className="add-multiple-choice-question-new-choice-latex-box">
                                        <p>Choice text (LaTeX input possible)</p>
                                        <TextArea 
                                            value={Latex}
                                            rows={4} 
                                            onChange={(v) => {
                                                const value = v.target.value

                                                let _cs = [...choices]

                                                _cs[ci].Latex = value

                                                setChoices(_cs)
                                            }}
                                        />

                                        <br/>
                                        <br/>
                                        <LatexRenderer className={Latex && "hq-element-container"} latex={Latex} />

                                    </div>

                                    <div>
                                        <p>Image (optional)</p>

                                        <UploadImage 
                                            onSetImage={(url, img) => {

                                                let _cs = [...choices]

                                                _cs[ci].ImageURL = url
                                                _cs[ci].Image = img

                                                setChoices(_cs)
                                            }}

                                            imageURL={ImageURL}

                                            className="add-multiple-choice-question-img-box"
                                            classNameImage="add-multiple-choice-question-img-box-inside-img"

                                            removable
                                        />
                                    </div>
                                </Space>
                                <Divider/>
                            </div>
                        )
                    }}
                />  
                : 
                <div/>}
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

        data.append('ChoicesPerRow', 1)
        data.append('AnswersString', JSON.stringify(
            choices.map((a) =>(
                {
                    Text: a.Text,
                    Latex: a.Latex,
                    Correct: a.Correct,
                    ImageURL: a.Image ? "Image" : null
                }))
            ))

            data.append('Picture', newImage) 
            data.append('DefaultImageId', selectedDefaultImage && selectedDefaultImage.Id)
            data.append('PDF', newPDF)

            for(const i of choices.filter((a) => a.Image).map(a => a.Image)){
                data.append('MultipleChoiceImages', i)
            }


            addMultipleChoiceQuestion(data)
            .then(r => handleResponse(r, api, 'Question added successfully', 1))


        }

    const renderFakeQuestion = () => {
        const imageURL = newImageURL || (selectedDefaultImage || {ImageURL:''}).ImageURL

        if(!imageURL) return <div/>

        return(
            <div className="fake-question-container">
                <Divider orientation="left">
                    <Space>
                    <p>Approximation for rendered question</p> 
                    <Button 
                        type="primary" 
                        size="small" 
                        loading={isLoadingAddMultipleChoiceQuestion}
                        onClick={() => addQuestion()}    
                    > 
                        Add question
                    </Button>
                    </Space>
                </Divider>
                <br/>
                <Space 
                className="multiple-choice-question-play-info-row"
                size={'large'}>
                    <img 
                        alt={questionInfo.Code}
                        src={imageURL}
                        className="multiple-choice-question-play-img"
                    />
                    <LatexRenderer 
                        latex={newLatex}
                    />
                </Space>
                <Divider/>
                <Row>
                    {choices.map((c, ci) => {
                    const {ImageURL, Latex} = c

                    return(
                        <Col
                            key={c.Id}
                            className="multiple-choice-question-play-choice-container"
                        >
                            <div
                                className="multiple-choice-question-play-choice-container-inner"
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
                </Row>
                
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
                        <p> Question solution</p>
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
                </Space>}
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
                            <Space className ={questionInfo.validation ? "highlighted" : "hoverable"}>
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
                            <Space className={(!questionInfo.validation && !questionContentIsValid) ? "highlighted" : "hoverable"}>
                            <p>Question content{' '}</p>
                            {(questionContentIsValid ? 
                            <CheckCircleFilled style={{color:'green'}}/> : 
                                <Tooltip 
                                        color="white"
                                        title={<p>{questionContentFeedback}</p>}
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
        </PagesWrapper>
    )
}