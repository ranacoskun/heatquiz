import React, { useEffect } from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { useState } from "react";
import { Button, Col, Divider, Input, List, Row, Space, Steps, Tabs, Tooltip, message, Select } from "antd";
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";
import {ScheduleTwoTone, CheckCircleFilled, CloseCircleTwoTone, PictureTwoTone, ProjectTwoTone, PlusOutlined, DeleteOutlined, ExclamationCircleOutlined , CloseCircleFilled, DragOutlined, InsertRowAboveOutlined, SmileTwoTone, FrownTwoTone} from '@ant-design/icons';
import { UploadImage } from "../../../../Components/UploadImage";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

import { UploadPDF } from "../../../../Components/UploadPDF";
import { AddQuestionInteractivePlot } from "../Shared/AddQuestionInteractivePlot";

import './index.css'

const { TextArea } = Input;

export function AddDiagramQuestion(){

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

    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)

    const [newParts, setNewParts] = useState([])
    const [selectedPartIndex, setSelectedPartIndex] = useState(null)

    const [isAddingSection, setIsAddingSection] = useState(false)

    const [currentSubtab, setCurrentSubtab] = useState(1)

    const [questionBody, setQuestionBody] = useState("")

    const [newPDF, setNewPDF] = useState(null)
    const [newPDFURL, setNewPDFURL] = useState(null)

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        setIsAddingSection(false)
    }, [])

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

    const renderSelectedPlot = () => {
        const selectedPart = newParts[selectedPartIndex]
        
        const {Code, Title, height, Width, OriginX, OriginY} = selectedPart
        return(
            <div
                className="hq-full-width"
            >
                <Space
                    size="middle"
                    align="start"
                    className="hq-full-width"
                >
                    <Input 
                        className="hq-full-width add-d-q-plot-code-line"
                        suffix={<p className="default-gray default-small">Code</p>}
                        value = {Code}
                        onChange={(v) => {
                            let plots = [...newParts]

                            plots[selectedPartIndex].Code = v.target.value.trim()

                            setNewParts(plots)
                        }}
                    />
                    <Button
                        onClick={() => {
                            let plots = [...newParts]

                            plots = plots.filter((a,ai) => ai !== selectedPartIndex)

                            setNewParts(plots)
                            setSelectedPartIndex(plots.length ? 0 : null)

                        }}
                    >
                        <DeleteOutlined
                            className="default-red default-small"
                        />
                    </Button>
                </Space>
                <br/>
                <br/>

                <Input 
                    className="hq-full-width"
                    suffix={<p className="default-gray default-small">Title</p>}
                    value = {Title}
                    onChange={(v) => {
                        let plots = [...newParts]

                        plots[selectedPartIndex].Title = (v.target.value) || (plots[selectedPartIndex].Title[0])

                        setNewParts(plots)
                    }}
                />
                <br/>
                <br/>
                <br/>
                <Space size="middle" align="start">
                    <div className="add-d-q-plot-metrics-area">
                        <small className="default-gray">Height</small>
                        <Input 
                            value={height}
                            suffix={<p className="default-gray default-small">px</p>}

                            type="number"

                            min="0"

                            onChange={(v) => {
                                let plots = [...newParts]

                                const value = Number(v.target.value.trim())

                                if(!value) return;

                                if(value < 0) return;
                                
                                plots[selectedPartIndex].height = value

                                setNewParts(plots)
                            }}
                        />
                    </div>
                    <div className="add-d-q-plot-metrics-area">
                        <small className="default-gray">Origin (x)</small>
                        <Input 
                            value={OriginX}
                            suffix={<p className="default-gray default-small">%</p>}

                            type="number"

                            min="0"
                            max="100"

                            onChange={(v) => {
                                let plots = [...newParts]

                                const value = Number(v.target.value.trim())

                                if(value < 0 || value > 100) return;
                                
                                plots[selectedPartIndex].OriginX = value

                                setNewParts(plots)
                            }}
                        />
                        <small className="default-gray">As percentage of width</small>

                    </div>
                    <div className="add-d-q-plot-metrics-area">
                        <small className="default-gray">Origin (y)</small>
                        <Input 
                            value={OriginY}
                            suffix={<p className="default-gray default-small">%</p>}

                            type="number"

                            min="0"
                            max="100"

                            onChange={(v) => {
                                let plots = [...newParts]

                                const value = Number(v.target.value.trim())

                                if(value < 0 || value > 100) return;
                                
                                plots[selectedPartIndex].OriginY = value

                                setNewParts(plots)
                            }}
                        />
                        <small className="default-gray">As percentage of height</small>
                    </div>
                </Space>
                <br/>
                <br/>
                <Space
                    className="hq-full-width hq-opposite-arrangement"
                >
                    <u className="default-gray">
                        Sections
                    </u>

                    <Button
                        size="small"
                        onClick={() => setIsAddingSection(!isAddingSection)}
                    >
                        <Space size="large" align="center">
                            <PlusOutlined className="default-green"/>
                            section
                        </Space>
                    </Button>
                </Space>
            </div>
        )
    }

    const renderPlots = () => {
        const selectedPart = newParts[selectedPartIndex]

        return(
            <div>
                <Space
                    className="hq-full-width"
                    size="large"
                    align="center"
                >
                    <Select
                    onChange={(v, option) => {
                        setSelectedPartIndex(v)
                        setIsAddingSection(false)
                    }}
                    defaultValue={'please add a new plot'}
                    value={(selectedPart || {}).Title || "Please add a new plot"}
                    className='add-d-q-plots-bar'
                    options={(newParts || []).map((d, di) => ({
                        value: di,
                        label: d.Title
                        }))}
                    />

                    <Tooltip
                        color="white"
                        title={<p>Add new plot</p>}
                    >
                        <Button
                            size="middle"
                            type="default"

                            onClick={() => {
                                if(isAddingElement || isAddingElementSecond){
                                    api.destroy()
                                    api.warning("Please finish adding plot")
                                    return
                                }
                                setIsAddingElement(true)
                            }}
                        >
                            <PlusOutlined className="default-green"/>
                        </Button>
                    </Tooltip>
                </Space>
                <Divider/>
                {selectedPart && renderSelectedPlot()}
            </div>
        )
    }

    const validateContent_QuestionInfo = () => {
        if(!questionBody.trim()) return "Add question body"

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

        const imageWidth = 0.45*window.innerWidth
        const imageHeight = ((newImageHeight*imageWidth)/newImageWidth)


        const validateInfo = validateContent_QuestionInfo()
        const validatePlots = validateContent_QuestionInfo()

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
                <p>Plots</p> 
            
                {validatePlots &&
                <Tooltip
                    color="white"
                    title={<p>{validatePlots}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,
            children: <div>{renderPlots()}</div>
        }]

        return(
            <div className="hq-full-width">
                <Row>
                    <Col>
                        <img 
                            alt="q-image"
                            style={{width:imageWidth, height:imageHeight, cursor:'crosshair'}}
                            src={newImageURL}

                            ref={imageRef}

                            onClick={(e) => {
                                if(!imageRef.current) return;

                                if(!(isAddingElement)) return;

                                e.persist()

                                const {pageX, pageY} = e

                                const {top, left} = imageRef.current.getBoundingClientRect()
                                
                                if(!isAddingElementSecond){

                                    let newPart = ({
                                        Code: 'Plot',
                                        Title: 'Plot',
                                        OriginX: 0,
                                        OriginY:0, 
                                        Sections:[],

                                        x: pageX - left,
                                        y: pageY - top,
                                        width: 1,
                                        height: 1,
                                        answer:null
                                    })


                                    setNewParts(prev => [...prev, newPart])
                                    setIsAddingElementSecond(true)

                                    return
                                }

                                if(isAddingElementSecond){
                                    
                                    let parts = [...newParts]

                                    const newX = pageX - left
                                    const newY = pageY - top

                                    let Last =  parts[parts.length-1]
                                
                                    Last.width = Math.abs(Last.x - newX)
                                    Last.height = Math.abs(Last.y - newY)
        
                                    Last.x = Math.min(Last.x,newX)
                                    Last.y = Math.min(Last.y, newY)

                                    setNewParts(parts)

                                    setIsAddingElement(false)
                                    setIsAddingElementSecond(false)

                                    setSelectedPartIndex(parts.length - 1)
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
                            const {width, height, OriginX, OriginY, Title, Sections, x, y} = p

                            const isPlotSelected = (selectedPartIndex === pi)

                            return(
                                <div
                                    key={pi}
                                    style={{position:'absolute', top:y, left:x, width: width, height:height}}
                                >
                                    <AddQuestionInteractivePlot 
                                        style={{width, height}}

                                        OriginX = {OriginX}
                                        OriginY = {OriginY}

                                        title={Title}

                                        plotIndex={pi}
                                        plotIsActive={isPlotSelected}

                                        sections={Sections}

                                        isAddingSection={isAddingSection}
                                    />
                                </div>
                            )
                        })}
                    </Col>
                    <Col xs={2}/>
                    <Col>
                        <Tabs
                            defaultActiveKey={1}
                            items={tabs}
                            onChange={(t) => setCurrentSubtab(t)}
                            activeKey={currentSubtab}
                            className="add-d-q-content-area"
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
        return null
    }

    const selectImageValidation = validateAddImage()
    const questionContentValidation = validateQuestionContent()

    const canAdd = !questionInfo.validation && !selectImageValidation && !questionContentValidation

    const addQuestionClick = () => {

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
                            loading={false}
                        >
                            Add question
                        </Button>
                    </Space>
                }
            </Space>
        )
    }

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



        </PagesWrapper>
    )
}