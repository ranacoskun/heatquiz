import React from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, Input, Row, Space, Steps, Tooltip, message } from "antd";
import {ScheduleTwoTone, ProjectTwoTone, FrownTwoTone, CheckCircleFilled, CloseCircleTwoTone, PictureTwoTone, PlusOutlined, SmileTwoTone} from '@ant-design/icons';
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";
import { useState } from "react";
import { UploadImage } from "../../../../Components/UploadImage";

import './index.css'
import { CLICKABLE_CHART, CLICKABLE_IMAGE } from "../Shared/Constants";
import { UploadPDF } from "../../../../Components/UploadPDF";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";
import { SetElementAnswer } from "../Shared/SetElementAnswer";

export function AddClickableQuestion(){

    const {isLoadingAddClickableQuestion, addClickableQuestion} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const [currentTab, setCurrentTab] = useState(0)
    const onChange = (value) => setCurrentTab(value);

    const [questionInfo, setQuestionInfo] = useState({
        Code:'',
        selectedSubtopic: null,
        selectedLOD: null,
        validation: 'Please fill data'
    })

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const imageRef = React.createRef()
    const [leftOffset, setLeftOffset] = useState(0)

    const [newImageWidth, setNewImageWidth] = useState(0)
    const [newImageHeight, setNewImageHeight] = useState(0)

    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)

    const [isMovingElement, setIsMovingElement] = useState(false)
    const [movedElement, setMovedElement] = useState(false)

    const [showSelectPartAnswerModal, setShowSelectPartAnswerModal] = useState(false)
    const [selectedPart, setSelectedPart] = useState(null)

    const [newParts, setNewParts] = useState([])

    const [newPDF, setNewPDF] = useState(null)
    const [newPDFURL, setNewPDFURL] = useState(null)

    const [hoverElement, setHoverElement] = useState(null) 

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

        return(
            <div className="hq-full-width">
                <Row>
                    <Col>
                        <div>
                            <img 
                            alt="q-image"
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
                                        type:CLICKABLE_IMAGE,
                                        answer:null
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
                                type={isAddingElement ? "primary" : "default"}
                                icon={<PlusOutlined style={{color:'green'}}/>}
                                size="small"

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

                                    if(isAddingElement){
                                        setIsAddingElement(false)

                                        return
                                    }

                                    setIsAddingElement(true)
                                }}
                            >
                                Add part
                            </Button>
                        </Space>

                        <br/>
                        {newParts.map((p, pi) => {
                            const {width, height, answer} = p

                            const isHovered = (pi === hoverElement)

                            return(
                                <div 
                                className={"hq-full-width" + (isHovered ? " highlighted" : "")} 
                                key={pi}>
                                    <br/>

                                    <Space size={'large'} align="start">
                                        <p className="default-title default-larger">{pi+1}</p>

                                        <Tooltip
                                            color="white"
                                            title={<p>Click to specify answer</p>}
                                        >
                                            <div 
                                                onClick={() => {
                                                    setShowSelectPartAnswerModal(true)
                                                    setSelectedPart(pi)
                                                }}
                                                className="clickable-question-element-answer-box">
                                                {answer &&
                                                <img    
                                                    alt="answer"
                                                    className="hq-img"
                                                    src={answer.URL}
                                                />}
                                            </div>
                                        </Tooltip>

                                        <Space direction="vertical">
                                            <Input 
                                                placeholder="Width"
                                                value={width}
                                                suffix=" - width"
                                                type="number"
                                                min={1}
                                                onChange={(v) => {
                                                    const value = Number(v.target.value)

                                                    if(value < 1) return;

                                                    const _parts = [...newParts]

                                                    _parts[pi].width = value

                                                    setNewParts(_parts)
                                                }}
                                            />

                                            <Input 
                                                placeholder="Height"
                                                value={height}
                                                suffix=" - height"
                                                type="number"
                                                min={1}
                                                onChange={(v) => {
                                                    const value = Number(v.target.value)

                                                    if(value < 1) return;

                                                    const _parts = [...newParts]

                                                    _parts[pi].height = value

                                                    setNewParts(_parts)
                                                }}
                                            />
                                        </Space>

                                        <Space direction="vertical" align="start">
                                            <Button
                                                size="small"
                                                className="hq-full-width"

                                                type={movedElement === pi ? "primary" : "default"}

                                                onClick={() => {
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
                                                }}
                                            >
                                                Move
                                            </Button>

                                            <Button 
                                                size="small"
                                                className="hq-full-width"
                                                onClick={() => {
                                                    let _parts = [...newParts]

                                                    _parts.push({...p})

                                                    setNewParts(_parts)
                                                }}
                                            >
                                                Copy
                                            </Button>

                                            <Button
                                                size="small"
                                                className="hq-full-width"

                                                onClick={() => {
                                                    let _parts = [...newParts]

                                                    _parts = _parts.filter((p, ppi) => ppi !== pi)

                                                    setNewParts(_parts)
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Space>
                                    </Space>

                                </div>
                            )
                        })}
                    </Col>
                </Row>

            </div>
        )
    }

    const addQuestionClick = () => {

        if(!canAdd){
            api.destroy()
            api.warning("Please fill all required data")
            return
        }
       
        const imageWidth = 0.35*window.innerWidth
        const imageHeight = ((newImageHeight*imageWidth)/newImageWidth)       
        
        //Click images
        let ClickImages = newParts.filter(a => a.type === CLICKABLE_IMAGE)
            .map(ci => ({
                        X : Number.parseInt(+ci.x + leftOffset),
                        Y : Number.parseInt(+ci.y),

                        Width : Math.trunc(ci.width),
                        Height : Math.trunc(ci.height),
                        AnswerId : ci.answer.Id,
            }))


        //Clickable Chart 
        let ClickCharts = newParts.filter(a => a.type === CLICKABLE_CHART)
        .map(ci => ({
                    X : Number.parseInt(+ci.x),
                    Y : Number.parseInt(+ci.y),

                    Width : Math.trunc(ci.width),
                    Height : Math.trunc(ci.height),
                    AnswerId : ci.answer.Id,
        }))
            
        const data = new FormData()
        data.append('Code', questionInfo.Code)
        data.append('SubtopicId', questionInfo.selectedSubtopic.Id)
        data.append('LODId', questionInfo.selectedLOD.Id)
        data.append('ClickParts', JSON.stringify({
            ClickImages:ClickImages,
            ClickCharts: ClickCharts
        }))
        
        data.append('Public', false)
        data.append('Attributes', "")

        data.append('Picture', newImage)
        data.append('PictureWidth', Number.parseInt(imageWidth))
        data.append('PictureHeight', Number.parseInt(imageHeight))

        data.append('PDF', newPDF)
        
        addClickableQuestion(data).then(r => handleResponse(r, api, 'Added successfully', 1))
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
                    <Button
                        type="primary"
                        size="small" 
                        onClick={addQuestionClick}
                        loading={isLoadingAddClickableQuestion}
                    >
                        Add question
                    </Button>
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
            1: () => renderAddImage(),
            2: () => renderQuestionContent(),
            3: () => renderFinalPage(),
        }

        return map[currentTab]()
    }

    const validateAddImage = () => {
        if(!newImage)
            return "Please add an image"
    
        return null
    }

    const validateQuestionContent = () => {
        if(!newParts.length)
            return "Please add parts"
        
        const noAddedAnswers = newParts.filter(a => !a.answer).length

        if(noAddedAnswers)
            return "Atleast one part has no answer"

        return null
    }

    const selectImageValidation = validateAddImage()
    const questionContentValidation = validateQuestionContent()

    const canAdd = !questionInfo.validation && !selectImageValidation && !questionContentValidation

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

            <SetElementAnswer 
                open={showSelectPartAnswerModal}
                onClose={() => setShowSelectPartAnswerModal(false)}
                elementIndex = {selectedPart}
                onSelect={(t, a) => {
                    const _parts = [...newParts]
                    _parts[selectedPart].type = t
                    _parts[selectedPart].answer = a

                    setNewParts(_parts)
                    setSelectedPart(null)
                }}
            />
        </PagesWrapper>
    )
}