import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Button, Col, Input, List, Popconfirm, Row, Space, Tooltip, message } from "antd";
import {PlusOutlined, PictureOutlined, QuestionCircleOutlined} from '@ant-design/icons';

import './index.css'
import { FixURL, handleResponse } from "../../../../services/Auxillary";
import { EditElementAnswer } from "./EditElementAnswer";
import { CLICKABLE_CHART, CLICKABLE_IMAGE } from "../Shared/Constants";
import { SetElementAnswer } from "../Shared/SetElementAnswer";
import { EditClickableQuestionImage } from "./EditClickableQuestionImage";
import { EditQuestionExplanation } from "./EditQuestionExplanation";

export function ClickableQuestionEditView({reloadQuestion}){

    const {clickableQuestionPlay: question, 
        deleteClickableQuestionPart,
        isLoadingAddClickableQuestionParts, addClickableQuestionParts
    } = useQuestions()
    const [api, contextHolder] = message.useMessage()
    
    const imageRef = React.createRef()
    const imageRef2 = React.createRef()

    const [showEditImage, setShowEditImage] = useState(false)
    const [showEditExplanation, setShowEditExplanation] = useState(false)

    const [offset, setOffset] = useState(0)

    const [hoveredElementIndex, setHoveredElementIndex] = useState(null)

    const [selectedElement, setSelectedElement] = useState(null)
    const [selectedType, setSelectedType] = useState(null)
    const [showEditElementAnswer, setShowEditElementAnswer] = useState(false)

    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)

    const [isMovingElement, setIsMovingElement] = useState(false)
    const [movedElement, setMovedElement] = useState(false)

    const [leftOffset, setLeftOffset] = useState(0)

    const [newParts, setNewParts] = useState([])

    const [hoverElement, setHoverElement] = useState(null) 

    const [showSelectPartAnswerModal, setShowSelectPartAnswerModal] = useState(false)
    const [selectedPart, setSelectedPart] = useState(null)

    useEffect(() => {
        let _offset = 0

        if(imageRef){
            const div = imageRef.current
            
            _offset = parseInt(window.getComputedStyle(div).paddingRight.replace('px',''))

            setOffset(_offset)

        }
    }, [imageRef])

    const getItemPositionStyle = (imageWidth, BackgroundImageWidth, p) => ({
        width: ((imageWidth * p.Width)/BackgroundImageWidth),
        height: ((imageWidth * p.Height)/BackgroundImageWidth),
        left: ((imageWidth * p.X)/BackgroundImageWidth) - offset,
        top:  ((imageWidth * p.Y)/BackgroundImageWidth),
    })

    const renderQuestionImage = () => {
        const {Code, Base_ImageURL, BackgroundImageHeight, BackgroundImageWidth, ClickImages, ClickCharts} = question.Question

        const backgroundImageStyle = ({
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'contain',
            border:'1px solid rgb(245, 245, 245)',
            cursor:'crosshair'
        })

        const itemStyle = ({
            alignItems:'center',
            justifyContent:'center',
            display:'flex',
            flexDirection:'column',
            position: 'absolute',
            border:'1px solid rgb(245, 245, 245)',
            cursor:'pointer'
           
        })

        return(
            <div>
                <img
                style = {{
                    ...backgroundImageStyle,
                    height:BackgroundImageHeight,
                    width:BackgroundImageWidth,
                }} 

                src = {Base_ImageURL}
                alt={Code}

                ref={imageRef2}

                onClick={(e) => {
                    if(!(isAddingElement || isMovingElement)) return;

                    e.persist()

                    const {pageX, pageY} = e

                    const imgRef2 = imageRef2.current
                    const parentNode = imgRef2.parentNode.parentNode
                    const styles = window.getComputedStyle(parentNode)
                    const offset = Number(styles.getPropertyValue('padding-right').replace('px', ''))

                    setLeftOffset(offset)

                    const {top, left} = imgRef2.getBoundingClientRect()
                                
                    if(!isAddingElementSecond  && !isMovingElement){

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
                />
                {ClickImages.map((p, pi) => {
                    const itemPositionStyle = getItemPositionStyle(BackgroundImageWidth, BackgroundImageWidth, p)
                    const {Answer} = p
                    const {URL} = Answer

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
                        onMouseEnter={() => setHoveredElementIndex(pi)}
                        onMouseLeave={() => setHoveredElementIndex(null)}

                        >
                            <Space direction="vertical" align="center">
                                <p className="default-title highlighted">{pi+1}</p>

                                <img 
                                    src={URL}
                                    alt="Answer"
                                    className="clickable-element-img"
                                />
                            </Space>
                        </span>
                    )
                })}

                {ClickCharts.map((p, pi) => {
                    const itemPositionStyle = getItemPositionStyle(BackgroundImageWidth, BackgroundImageWidth, p)
                    const {Answer} = p
                    const {URL} = Answer

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

                        onMouseEnter={() => setHoveredElementIndex(pi + ClickImages.length)}
                        onMouseLeave={() => setHoveredElementIndex(null)}
                        >
                            <Space direction="vertical" align="center">
                            <p className="default-title highlighted">{ClickImages.length + pi+1}</p>

                                <img 
                                    src={URL}
                                    alt="Answer"
                                    className="clickable-element-img"
                                />
                            </Space>
                        </span>
                    )
                })}

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
                                    <p className="default-red default-larger">{pi+1 + ClickImages.length + ClickCharts.length}</p>
                                </Space>
                        </div>
                            )
                        })}
            </div>
        )
    }

    const renderPartsList = () => {
        const {ClickImages, ClickCharts} = question.Question

        if(newParts.length){
            return(
                <div>
                    {newParts.map((p, pi) => {
                            const {width, height, answer} = p

                            const isHovered = (pi === hoverElement)

                            return(
                                <div 
                                className={"hq-full-width" + (isHovered ? " highlighted" : "")} 
                                key={pi}>
                                    <br/>

                                    <Space size={'large'} align="start">
                                        <p className="default-title default-larger">{pi+1 + ClickImages.length + ClickCharts.length}</p>

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

                        <br/>
                        <Button
                            type="primary"
                            size="small"
                            loading={isLoadingAddClickableQuestionParts}
                            onClick={() => {
                                if(newParts.filter(a => !a.answer).length){
                                    api.destroy()
                                    api.warning("Atleast one part has no answer")

                                    return
                                }
                                
                                const {Code} = question.Question


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

                                data.append('Code', Code)

                                data.append('ClickParts', JSON.stringify({
                                    ClickImages:ClickImages,
                                    ClickCharts: ClickCharts
                                }))

                                addClickableQuestionParts(data).then(r => handleResponse(r, api, 'Added successfully', 1, () => reloadQuestion()))
                            }}
                        >
                            Add clickable parts
                        </Button>
                </div>
            )
        }


        const partsCount = ClickImages.length + ClickCharts.length
        return(
            <Space
                align="start"
                direction="vertical"
            >
                {ClickImages.length ? 
                <List 
                    dataSource={ClickImages}
                    renderItem={(c, ci) => {
                        const {Id, Answer} = c
                        const {URL} = Answer
                        return(
                            <div
                                key={Id}
                                className={(hoveredElementIndex === ci) ? "highlighted" : ""}
                            >
                                <Tooltip
                                    placement="right"
                                    color="white"
                                    title={
                                        <Space
                                            direction="vertical"
                                        >
                                            {partsCount !== 1 && 
                                            <Popconfirm
                                                title="Delete part"
                                                description="Are you sure to delete this part?"
                                                onConfirm={() => {
                                                    deleteClickableQuestionPart({...c, IsImage: true})
                                                    .then(r => handleResponse(r, api, 'Removed', 1, () => reloadQuestion()))
                                                }}
                                                onCancel={() => {}}
                                                okText="Yes"
                                                cancelText="No"
                                                placement="right"
                                            >
                                                <Button
                                                    size="small"
                                                    loading={false}
                                                    className="hq-full-width"
                                                >
                                                    Remove part 
                                                </Button>
                                            </Popconfirm>}

                                            <Button
                                                className="hq-full-width"

                                                onClick={() => {
                                                    setShowEditElementAnswer(true)
                                                    setSelectedElement(c)
                                                    setSelectedType(CLICKABLE_IMAGE)
                                                }}
                                            >
                                                Edit answer
                                            </Button>

                                            <Button
                                                className="hq-full-width"
                                            >
                                                Edit background image
                                            </Button>
                                        </Space>
                                    }
                                >
                                <Space>
                                    <p>{ci + 1}</p>
                                    <img 
                                        className="clickable-question-edit-view-part-img"
                                        alt={"part-"+ci}
                                        src={URL}
                                    />
                                </Space>
                                </Tooltip>
                            </div>
                        )
                    }}
                /> : <div/>}

                {ClickCharts.length ?
                <List 
                    dataSource={ClickCharts}
                    renderItem={(c, ci) => {
                        const {Id, Answer} = c
                        const {URL} = Answer
                        return(
                            <div
                                key={Id}
                                className={(hoveredElementIndex === ci + ClickImages.length) ? "highlighted" : ""}
                            >
                                <Tooltip
                                    placement="right"
                                    color="white"
                                    title={
                                        <Space
                                            direction="vertical"
                                        >
                                            {partsCount !== 1 && 
                                            <Popconfirm
                                                title="Delete part"
                                                description="Are you sure to delete this part?"
                                                onConfirm={() => {
                                                    deleteClickableQuestionPart({...c, IsImage: false})
                                                    .then(r => handleResponse(r, api, 'Removed', 1, () => reloadQuestion()))
                                                }}
                                                onCancel={() => {}}
                                                okText="Yes"
                                                cancelText="No"
                                                placement="right"
                                            >
                                                <Button
                                                    size="small"
                                                    loading={false}
                                                    className="hq-full-width"
                                                >
                                                    Remove part 
                                                </Button>
                                            </Popconfirm>}

                                            <Button
                                                className="hq-full-width"

                                                onClick={() => {
                                                    setShowEditElementAnswer(true)
                                                    setSelectedElement(c)
                                                    setSelectedType(CLICKABLE_CHART)
                                                }}
                                            >
                                                Edit answer
                                            </Button>

                                            <Button
                                                className="hq-full-width"
                                            >
                                                Edit background image
                                            </Button>
                                        </Space>
                                    }
                                >
                                <Space>
                                    <p>{ci + 1}</p>
                                    <img 
                                        className="clickable-question-edit-view-part-img"
                                        alt={"part-"+ci}
                                        src={URL}
                                    />
                                </Space>
                                </Tooltip>
                            </div>
                        )
                    }}
                /> : <div/>}
            </Space>
        )
    }

    return(
        <div>
            {contextHolder}
            <Row
                gutter={12}
            >
                <Col 
                    ref={imageRef}
                >
                    {renderQuestionImage()}
                </Col>
                <Col
                    xs ={1}
                >
                </Col>
                <Col
                    xs ={12}
                >
                    {renderPartsList()}
                </Col>
                <Col
                    xs ={1}
                >
                    <Space
                    align="end"
                    direction="vertical">
                        <Tooltip
                            color="white"
                            title={<p>Add clickable part</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => {
                                    setIsAddingElement(true)

                                }}
                                type={isAddingElement ? "primary" : "default"}
                            >
                                <PlusOutlined style={{color:'green'}} />
                            </Button>
                        </Tooltip>
                        <Tooltip
                            color="white"
                            title={<p>Update image</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => setShowEditImage(true)}
                            >
                                 <PictureOutlined />
                            </Button>
                        </Tooltip>
                        <Tooltip
                            color="white"
                            title={<p>Update/View explanation</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => setShowEditExplanation(true)}
                            >
                                 <QuestionCircleOutlined />
                            </Button>
                        </Tooltip>
                    </Space> 
                </Col>
            </Row>

            <EditElementAnswer 
                open={showEditElementAnswer}
                onClose={() => setShowEditElementAnswer(false)}

                element={selectedElement}
                type={selectedType}

                reloadQuestion={() => reloadQuestion()}
            />

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

            <EditClickableQuestionImage 
                open={showEditImage}
                onClose={() => setShowEditImage(false)}

                question = {question.Question}

                reloadQuestion={() => reloadQuestion()}
            />

            <EditQuestionExplanation 
                open={showEditExplanation}
                onClose={() => setShowEditExplanation(false)}

                question = {question.Question}

                reloadQuestion={() => reloadQuestion()}
            />
        </div>
    )
}