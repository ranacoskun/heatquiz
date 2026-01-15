import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, ColorPicker, Divider, message, Radio, Row, Select, Space, Steps, Switch, Tabs, Tooltip } from "antd";
import {ScheduleTwoTone, ProjectTwoTone, FrownTwoTone, CheckCircleFilled, CloseCircleTwoTone, DeleteOutlined, ArrowLeftOutlined, CheckCircleOutlined, ArrowRightOutlined, EyeOutlined, BorderOutlined, PictureTwoTone, PlusOutlined, SmileTwoTone, ExclamationCircleOutlined} from '@ant-design/icons';
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";

import "./index.css"
import { UploadImage } from "../../../../Components/UploadImage";
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { AddPVDiagramQuestionInteractivePlot } from "../Shared/AddPVDiagramQuestionInteractivePlot";
import Input from "antd/es/input/Input";
import { getUniqueValues, handleResponse, moveElementInArray } from "../../../../services/Auxillary";
import { conformPoints, createRelations, generateListsForRelations, getNameForRelation, getTypeForRelation } from "../Shared/Functions";
import { UploadPDF } from "../../../../Components/UploadPDF";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import {CommentComponent} from "./CommentComponent"

export function AddPVDiagramQiestion(){

    const {addPVDiagramQuestion, isLoadingAddPVDiagramQuestion} = useQuestions()

    const [api, contextHolder] = message.useMessage()
    const [currentTab, setCurrentTab] = useState(0)
    const onChange = (value) => setCurrentTab(value);

    const [questionInfo, setQuestionInfo] = useState({
        Code:'',
        selectedSubtopic: null,
        selectedLOD: null,
        validation: 'Please fill data'
    })

    const [newPDF, setNewPDF] = useState(null)
    const [newPDFURL, setNewPDFURL] = useState(null)

    const imageRef = React.createRef()

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const [imageWidth, setImageWidth] = useState(0)
    const [imageHeight, setImageHeight] = useState(0)

    const [newImageWidth, setNewImageWidth] = useState(0)
    const [newImageHeight, setNewImageHeight] = useState(0)

    const [newPointGroups, setNewPointGroups] = useState([])
    const [selectedGroupIndex, setSelectedGroupIndex] = useState(null)

    const [newPoints, setNewPoints] = useState([])

    const [relationsList, setRelationsList] = useState(null)
    const [relationsFinal, setRelationsFinal] = useState([])

    const [highlightedShape, setHighlightedShape] = useState(null)
    const [highlightedSlope, setHighlightedSlope] = useState(null)
    const [highlightedRelation, setHighlightedRelation] = useState(null)

    const [selectedShapeConditions, setSelectedShapeConditions] = useState([])
    const [selectedPointPositionConditions, setSelectedPointPositionConditions] = useState([])
    const [selectedPointSlopeConditions, setSelectedPointSlopeConditions] = useState([])

    const [selectedXPositionRelations, setSelectedXPositionRelations] = useState([])
    const [selectedYPositionRelations, setSelectedYPositionRelations] = useState([])
    const [selectedGradientRelations, setSelectedGradientRelations] = useState([])

    const [currentSubtab, setCurrentSubtab] = useState(1)

    const [questionBody, setQuestionBody] = useState("")

    const [isPermutableScoreEvaluation, setIsPermutableScoreEvaluation] = useState(false)

    const [isAdding, setIsAdding] = useState(false)

    const [currentPointsTab, setCurrentPointsTab] = useState(0)
    const [currentGroupTab, setCurrentGroupTab] = useState(0)

    const [selectedHighlightPointIndex, setSelectedHighlightPointIndex] = useState(null)

    const [selectedPointMoveIndex, setSelectedPointMoveIndex] = useState(null)
    const [selectedCPPointMoveIndex, setSelectedCPPointMoveIndex] = useState(null)
    
    const clearConditions = () => {
        setRelationsList(null)
        setRelationsFinal([])

        setSelectedShapeConditions([])
        setSelectedPointPositionConditions([])
        setSelectedPointSlopeConditions([])

        setSelectedXPositionRelations([])
        setSelectedYPositionRelations([])
        setSelectedGradientRelations([])

        setHighlightedShape(null)
        setHighlightedSlope(null)
        setHighlightedRelation(null)
    }

    /*useEffect(() => {
        if(!newPoints.length){
            clearConditions()
            return;
        }

        const list = generateListsForRelations(newPoints, isClosedLoop, isPointsOnlyPlay, imageHeight)
        const relations = createRelations(list, isPointsOnlyPlay)

        const {xRelationsFinal, yRelationsFinal, mRelationsFinal} = relations

        setRelationsList(list)
        setRelationsFinal(relations)

        //Initialize
         const {pointsShape, pointsSlope} = list
        setSelectedShapeConditions(pointsShape.map(a => false))

        setSelectedPointPositionConditions(newPoints.map(a => false))
        setSelectedPointSlopeConditions(pointsSlope.map(a => false))
            
        setSelectedXPositionRelations(xRelationsFinal.map(a => false))
        setSelectedYPositionRelations(yRelationsFinal.map(a => false))
        setSelectedGradientRelations(mRelationsFinal.map(a => false))
    }, [newPoints, isClosedLoop, isPointsOnlyPlay])*/

    useEffect(() => {
        let _gs = [...newPointGroups]

        //Get relations
        for(let [gi, g] of newPointGroups.entries()){
            const {Points: points, IsClosedLoop: isClosedLoop, IsPointsOnlyPlay: isPointsOnlyPlay} = g
            console.log(isClosedLoop, isPointsOnlyPlay)
            const list = generateListsForRelations(points, isClosedLoop, isPointsOnlyPlay, imageHeight)
            const relations = createRelations(list, isPointsOnlyPlay)

            const {xRelationsFinal, yRelationsFinal, mRelationsFinal} = relations
            const {pointsShape, pointsSlope} = list

            _gs[gi].relationsList = list
            _gs[gi].relationsFinal = relations

            _gs[gi].selectedShapeConditions = pointsShape.map(a => false)
            _gs[gi].selectedShapeConditionsComments = pointsShape.map(a => null)

            _gs[gi].selectedPointPositionConditions = points.map(a => false)
            _gs[gi].selectedPointPositionConditionsComments = points.map(a => null)

            _gs[gi].selectedPointSlopeConditions = pointsSlope.map(a => false)
            _gs[gi].selectedPointSlopeConditionsComments = pointsSlope.map(a => null)

            _gs[gi].selectedXPositionRelations = xRelationsFinal.map(a => false)
            _gs[gi].selectedXPositionRelationsComments = xRelationsFinal.map(a => null)

            _gs[gi].selectedYPositionRelations = yRelationsFinal.map(a => false)
            _gs[gi].selectedYPositionRelationsComments = yRelationsFinal.map(a => null)

            _gs[gi].selectedGradientRelations = mRelationsFinal.map(a => false)
            _gs[gi].selectedGradientRelationsComments = mRelationsFinal.map(a => null)

        }

        setNewPointGroups(_gs)
    },
    //Trigger when points move
    [...newPointGroups.map(g => g.Points), ...newPointGroups.map(g => g.IsClosedLoop), ...newPointGroups.map(g => g.IsPointsOnlyPlay)])

    const renderAddImage = () => {
        return(
            <div>
                <UploadImage 
                    onSetImage={(url, img) => {
                        setNewImageURL(url)
                        setNewImage(img)

                        setNewPoints([])
                        setCurrentPointsTab(0)

                        setIsAdding(false)
                        setSelectedHighlightPointIndex(null)
                        setSelectedPointMoveIndex(null)
                        setSelectedCPPointMoveIndex(null)
                    }}

                    imageURL={newImageURL}

                    className="pv-question-add-image-container"
                    classNameImage="pv-question-add-image-inside"
                />
            </div>
        )
    }

    const validateContent_QuestionInfo = () => {
        if(!questionBody.trim()) return "Add question body"

        return null
    }

    const validateContent_QuestionContent = () => {
        //Check groups exist
        if(!newPointGroups.length) return "Please add atleast one group"

        //Group names
        const names = newPointGroups.map(a => a.Code.trim())
        const uniqueNames = getUniqueValues(names)

        if(names.length !== uniqueNames.length) return "Groups codes should be unique"

        for(let g of newPointGroups){
            const {Points, Code,
                selectedShapeConditions, selectedPointPositionConditions, selectedPointSlopeConditions,
                selectedXPositionRelations, selectedYPositionRelations, selectedGradientRelations} = g

            //Check names
            if(!Code.trim()) return "All groups should have a name"

            if(Points.filter(a => !a.Name.trim()).length) return  "(" + Code + ") :" +  "All points should have a name"

            //Check points
            if(!Points.length) return  "(" + Code + ") :" +  "Should have atleast one point"

            const names = Points.map(a => a.Name.trim())
            const uniqueNames = getUniqueValues(names)

            if(names.length !== uniqueNames.length) return "(" + Code + ") :" +  "Point names should be unique"

            //Check conditions
            const conditionsNum = (
                selectedShapeConditions.filter(a => a).length + 
                selectedPointPositionConditions.filter(a => a).length + 
                selectedPointSlopeConditions.filter(a => a).length + 
                selectedXPositionRelations.filter(a => a).length + 
                selectedYPositionRelations.filter(a => a).length + 
                selectedGradientRelations.filter(a => a).length 
            )

            if(conditionsNum < 1) return "(" + Code + ") :" +  "Should have atleast one condition selection"
        }

        return null
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
                <br/>
                <br/>
               
                <p className="default-gray">Permutable score evaluation</p>
                <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    checked={isPermutableScoreEvaluation}
                    onChange = {(c) => setIsPermutableScoreEvaluation(!isPermutableScoreEvaluation)}
                />

               
            </div>
        )
    }

    const renderPointInList = (p, pi, pointsLength) => {
        const {Name, Color, BorderColor, MarginY, MarginX} = p
        const isHighlighted = (pi === selectedHighlightPointIndex)

        const canMoveLeft = (pi !== 0)
        const canMoveRight = ((pi + 1) !== pointsLength)

        return(
            <div
                key={pi}
                className="hq-full-width"
            >
            <div>
                <small className="default-gray">Name</small>
                <Input
                    value={Name}
                    className="hq-full-width"
                    onChange={(v) => {
                        const value = v.target.value

                        let _groups = [...newPointGroups]

                        let _points = [..._groups[selectedGroupIndex].Points]
                              
                        _points[pi].Name = value

                        _groups[selectedGroupIndex].Points = _points

                        setNewPointGroups(_groups)                     
                    }}

                    className="add-pv-d-question-tabs"
                />
            </div>
            <br/>
            <div>
                <small className="default-gray">Margin-X</small>
                <Input
                    value={MarginX}
                    className="hq-full-width"
                    type="number"
                    min="0"

                    onChange={(v) => {
                        const value = v.target.value

                        if(value < 0) return;

                        let _groups = [...newPointGroups]

                        let _points = [..._groups[selectedGroupIndex].Points]
                              
                        _points[pi].MarginX = value

                        _groups[selectedGroupIndex].Points = _points

                        setNewPointGroups(_groups)   
                    }}

                    className="add-pv-d-question-tabs"
                />
            </div>
            <br/>
            <div>
                <small className="default-gray">Margin-Y</small>
                <Input
                    value={MarginY}
                    className="hq-full-width"
                    type="number"
                    min="0"

                    onChange={(v) => {
                        const value = v.target.value

                        if(value < 0) return;

                        let _groups = [...newPointGroups]

                        let _points = [..._groups[selectedGroupIndex].Points]
                              
                        _points[pi].MarginY = value

                        _groups[selectedGroupIndex].Points = _points

                        setNewPointGroups(_groups)   
                    }}

                    className="add-pv-d-question-tabs"
                />
            </div>
            <br/>
            <div>
                <small className="default-gray">Inner color</small>
                <Space align="center" size="large">
                    <ColorPicker
                        value={Color}
                        defaultValue={Color} 

                        onChange={(c, h) => {

                            let _groups = [...newPointGroups]

                            let _points = [..._groups[selectedGroupIndex].Points]
                                
                            _points[pi].Color = h

                            _groups[selectedGroupIndex].Points = _points

                            setNewPointGroups(_groups)   
                        }}
                        showText = {true}
                        className="add-pv-d-question-tabs"
                    />
                    <p className="highlighted">{Color}</p>
                </Space>
            </div>
            <br/>
            <div>
                <small className="default-gray">Outer color</small>
                <Space align="center" size="large">
                    <ColorPicker
                        value={BorderColor}
                        defaultValue={BorderColor} 

                        onChange={(c, h) => {

                            let _groups = [...newPointGroups]

                            let _points = [..._groups[selectedGroupIndex].Points]
                                
                            _points[pi].BorderColor = h

                            _groups[selectedGroupIndex].Points = _points

                            setNewPointGroups(_groups)  
                        }}
                        showText = {true}
                        className="add-pv-d-question-tabs"
                    />
                    <p className="highlighted">{BorderColor}</p>
                </Space>
            </div>    
            <br/>
            <Space>
                {/*<Space 
                    size="small" 
                    className="hq-clickable" 
                    onClick = {() => {
                        setSelectedHighlightPointIndex(isHighlighted ? null : pi)
                    }}
                >
                    <EyeOutlined className = {isHighlighted ? "default-title" : ""}/>
                    <p className="default-gray default-smaller">Highlight</p>
                </Space> 

                &nbsp;&nbsp;&nbsp;&nbsp;*/}

                <Space 
                    size="small" 
                    className="hq-clickable" 
                    onClick = {() => {
                        let _groups = [...newPointGroups]

                        let _points = [..._groups[selectedGroupIndex].Points]
                                            
                        _points = _points.filter((pp, ppi) => pi !== ppi)

                        _groups[selectedGroupIndex].Points = _points

                        setNewPointGroups(_groups)

                        setNewPoints(_points)
                        setCurrentPointsTab(0)
                        setSelectedHighlightPointIndex(null)

                        clearConditions()
                    }}
                >
                    <DeleteOutlined />
                    <p className="default-gray default-smaller">Remove</p>
                </Space>   

                &nbsp;&nbsp;&nbsp;&nbsp;

                <Space 
                    size="small" 
                    className="hq-clickable" 
                    onClick = {() => {
                        if(!canMoveLeft) return;
                        let _groups = [...newPointGroups]

                        let _points = [..._groups[selectedGroupIndex].Points]
                                            
                        let _movedPoints = moveElementInArray(pi, p, _points, true)
                        _movedPoints = conformPoints(_movedPoints)

                        _groups[selectedGroupIndex].Points = _movedPoints

                        setNewPointGroups(_groups)
                        setCurrentPointsTab(pi-1)
                    }}
                >
                    <ArrowLeftOutlined className={canMoveLeft ? "default-title" : ""}/>
                    <p className="default-gray default-smaller">Move left</p>
                </Space>  

                &nbsp;&nbsp;&nbsp;&nbsp;

                <Space 
                    size="small" 
                    className="hq-clickable" 
                    onClick = {() => {
                        if(!canMoveRight) return;

                        let _groups = [...newPointGroups]

                        let _points = [..._groups[selectedGroupIndex].Points]
                                            
                        let _movedPoints = moveElementInArray(pi, p, _points, false)
                        _movedPoints = conformPoints(_movedPoints)

                        _groups[selectedGroupIndex].Points = _movedPoints

                        setNewPointGroups(_groups)
                        setCurrentPointsTab(pi+1)
                    }}
                >
                    <ArrowRightOutlined className={canMoveRight ? "default-title" : ""}/>
                    <p className="default-gray default-smaller">Move right</p>
                </Space>   
            </Space>
            <Divider/>
        </div>
        )
    }

    const settingsSection = () => {
        const group = newPointGroups[selectedGroupIndex]
        const {ConnectingLineColor, ConnectingLineWidth, IsClosedLoop, IsPointsOnlyPlay} = group

        return(
                <div>
                   
                {!IsPointsOnlyPlay ? 
                <div>
                    <br/>
                    <p className="default-gray">Line color</p>
                    <Space align="center" size="large">
                        <ColorPicker
                            value={ConnectingLineColor}
                            defaultValue={ConnectingLineColor} 
                            className="hq-full-width"

                            onChange={(c, h) => {
                                let _groups = [...newPointGroups]

                                _groups[selectedGroupIndex].ConnectingLineColor = h

                                setNewPointGroups(_groups)
                            }}
                            showText = {true}
                        />
                        <p className="highlighted">{ConnectingLineColor}</p>
                    </Space>
               
                    <br/>
                    <p className="default-gray">Line width</p>
                    <Input
                        value={ConnectingLineWidth}
                        className="hq-full-width"
                        type="number"
                        min="1"

                        onChange={(v) => {
                            const value = v.target.value

                            if(value < 0) return;

                            let _groups = [...newPointGroups]

                            _groups[selectedGroupIndex].ConnectingLineWidth = value

                            setNewPointGroups(_groups)
                        }}

                    />
                </div> :<div/>}
                <br/>
                <p className="default-gray">Points-only play</p>
                <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    checked={IsPointsOnlyPlay}
                    onChange = {(c) => {
                        
                        let _groups = [...newPointGroups]

                        _groups[selectedGroupIndex].IsPointsOnlyPlay = !IsPointsOnlyPlay
                        _groups[selectedGroupIndex].IsClosedLoop = false

                        setNewPointGroups(_groups)
                    }}
                />
                <br/>
                <p className="default-gray">Closed loop</p>
                <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    checked={IsClosedLoop}
                    onChange = {(c) => {
                        if(IsPointsOnlyPlay){
                            api.destroy()
                            api.warning("Points only play is active!")

                            return
                        }
                        
                        let _groups = [...newPointGroups]

                        _groups[selectedGroupIndex].IsClosedLoop = !IsClosedLoop

                        setNewPointGroups(_groups)
                    }}
                />
            </div>
        )
    }

    const pointsSection = () => {
        const group = newPointGroups[selectedGroupIndex]
        const {Points} = group

        const pointsTabs = Points.map(
            (p, pi) => {
                const {Name, Color, BorderColor} = p

                return ({
                    key: pi,
                    label: 
                    <Space align="center" size="large"> 
                        <small className="default-gray">{pi+1}</small> 
                        <small className="default-gray">{Name}</small> 
                        <BorderOutlined  style={{color:BorderColor, backgroundColor:Color}}/>
                    </Space>,
                    children:
                     <div>{renderPointInList(p, pi, Points.length)} </div>
                })
            }
        )

        return(
            <div>
                {Points.length ? 
                <Tabs
                    defaultActiveKey={0}
                    items={pointsTabs}
                    onChange={(t) => setCurrentPointsTab(t)}
                    activeKey={currentPointsTab}
                    className="add-pv-d-question-tabs"
                /> : <div/>}
            </div>
        )
    }

    const selectCondition = (propName, pi, isSelected) => {
        let _groups = [...newPointGroups]

        let data = [..._groups[selectedGroupIndex][propName]]
                                              
        data[pi] =  !isSelected
                
        _groups[selectedGroupIndex][propName] = data
                
        setNewPointGroups(_groups)  
    }

    const setConditionComment = (propName, pi, v) => {
        let _groups = [...newPointGroups]

        let data = [..._groups[selectedGroupIndex][propName + "Comments"]]
                                              
        data[pi] = v.target.value
                
        _groups[selectedGroupIndex][propName + "Comments"] = data
                
        setNewPointGroups(_groups)  
    }


    const conditionsSection = () => {
        const group = newPointGroups[selectedGroupIndex]

        const {
            relationsList, relationsFinal, Points,
            selectedShapeConditions, selectedShapeConditionsComments,
            selectedPointPositionConditions, selectedPointPositionConditionsComments,
            selectedPointSlopeConditions,selectedPointSlopeConditionsComments,
            selectedXPositionRelations, selectedXPositionRelationsComments,
            selectedYPositionRelations, selectedYPositionRelationsComments,
            selectedGradientRelations, selectedGradientRelationsComments} 
            = group

        if(!Points.length) return <div/>;
        if(!relationsList) return <div/>;

        const {pointsShape, pointsSlope} = relationsList

        const {xRelationsFinal, yRelationsFinal, mRelationsFinal} = relationsFinal

        return(
            <div
                className="add-q-pv-d-conditions-list"
            >
                <Divider>Shape/Location/Gradient conditions</Divider>
                {pointsShape.map((p, pi) => {
                                       
                    const {shape} = p
                    const point = Points[pi]

                    let nextP = Points[pi + 1]
                    if(!nextP) nextP = Points[0]

                    const {Name} = point
                    const {Name: nName} = nextP

                    const isSelected = selectedShapeConditions[pi]
                    const comment = selectedShapeConditionsComments[pi]

                    return(
                        <div
                            key={pi}
                            className="hq-full-width"

                            onMouseEnter = {() => setHighlightedShape(pi)}

                            onMouseLeave = {() => setHighlightedShape(null)}
                        >
                            <Space
                                align="center"

                                size="large"
                            >
                                <Space
                                    align="center"
                                >
                                    <span className="default-gray">Shape</span> 
                                    <span className="default-title">{Name}</span>
                                    <ArrowRightOutlined className="default-title"/>
                                    <span className="default-title">{nName}</span>
                                </Space>

                                <p className="add-q-pv-d-conditions-shape-name">{shape}</p>
                                <Tooltip
                                    color="white"
                                    title={<p>Click to select/unselect condition</p>}
                                >
                                    <CheckCircleOutlined 
                                    onClick={() => selectCondition("selectedShapeConditions", pi, isSelected)}
                                        
                                    className={"hq-clickable default-large " + (isSelected ? "default-green" : "default-gray")}/>
                                </Tooltip>
                               
                            </Space>
                            <CommentComponent 
                                onChange = {(v) => setConditionComment("selectedShapeConditions", pi, v)}
                                value = {comment}
                            />
                        </div>
                    )
                })}

                <br/>
                
                {Points.map((p, pi) => {
                    const {MarginX, MarginY, Name} = p
                    const isSelected = selectedPointPositionConditions[pi]
                    const comment = selectedPointPositionConditionsComments[pi]

                    return(
                        <div
                            key={pi}
                            className="hq-full-width"
                        >
                            <Space
                                align="center"

                                size="large"
                            >
                                <span className="default-gray">Point <span className="default-title">{Name}</span></span> 
                                <p className="default-smaller default-title">{'{'}x , y{'}'}</p>
                                <span className="default-gray">x: ±{MarginX}</span>
                                <span className="default-gray">y: ±{MarginY}</span>
                                <Tooltip
                                    color="white"
                                    title={<p>Click to select/unselect condition</p>}
                                >
                                    <CheckCircleOutlined 
                                    onClick={() => selectCondition("selectedPointPositionConditions", pi, isSelected)}
                                    className={"hq-clickable default-large " + (isSelected ? "default-green" : "default-gray")}/>
                                </Tooltip>
                            </Space>
                            <CommentComponent 
                                onChange = {(v) => setConditionComment("selectedPointPositionConditions", pi, v)}
                                value = {comment}
                            />
                        </div>
                    )
                })}
                
                <br/>

                {pointsSlope.map((p, pi) => {
                    const point = Points[pi]

                    let nextP = Points[pi + 1]
                    if(!nextP) nextP = Points[0]

                    const {Name} = point
                    const {Name:nName} = nextP

                    const {state} = p

                    const isSelected = selectedPointSlopeConditions[pi]
                    const comment = selectedPointSlopeConditionsComments[pi]

                    return(
                        <div
                            key={pi}
                            className="hq-full-width"

                            onMouseEnter = {() => setHighlightedSlope(pi)}

                            onMouseLeave = {() => setHighlightedSlope(null)}
                        >
                            <Space
                                align="center"

                                size="large"
                            >
                                <Space
                                    align="center"
                                >
                                    <span className="default-gray">Gradient</span> 
                                    <span className="default-title">{Name}</span>
                                    <ArrowRightOutlined className="default-title"/>
                                    <span className="default-title">{nName}</span>                                
                                </Space>

                                <p className="add-q-pv-d-conditions-shape-name">{state}</p>

                                <Tooltip
                                    color="white"
                                    title={<p>Click to select/unselect condition</p>}
                                >
                                    <CheckCircleOutlined 
                                    onClick={() => selectCondition("selectedPointSlopeConditions", pi, isSelected)}

                                    className={"hq-clickable default-large " + (isSelected ? "default-green" : "default-gray")}/>
                                </Tooltip>
                               
                            </Space>
                            <CommentComponent 
                                onChange = {(v) => setConditionComment("selectedPointSlopeConditions", pi, v)}
                                value = {comment}
                            />
                        </div>
                    )
                })}

                <Divider>Relations conditions</Divider>
                {xRelationsFinal.map((r, ri) => {
                    const {firstIndex, secondIndex, relation, type} = r

                    const relationName = getNameForRelation(type)

                    const p1 = Points[firstIndex]
                    const p2 = Points[secondIndex]

                    const {Name: n1} = p1
                    const {Name: n2} = p2

                    const isSelected = selectedXPositionRelations[ri]
                    const comment = selectedXPositionRelationsComments[ri]

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

                                <span className="default-gray">Point <span className="default-title">{n1}</span></span> 

                                <p className="default-title">{relation}</p>

                                <span className="default-gray">Point <span className="default-title">{n2}</span></span> 
                                
                                &nbsp;&nbsp;

                                <Tooltip
                                    color="white"
                                    title={<p>Click to select/unselect condition</p>}
                                >
                                    <CheckCircleOutlined
                                    onClick={() => selectCondition("selectedXPositionRelations", ri, isSelected)}
                                    className={"hq-clickable default-large " + (isSelected ? "default-green" : "default-gray")}/>
                                </Tooltip>
                            </Space>
                            <CommentComponent 
                                onChange = {(v) => setConditionComment("selectedXPositionRelations", ri, v)}
                                value = {comment}
                            />
                        </div>
                    )
                })}

                <br/>
                {yRelationsFinal.map((r, ri) => {
                    const {firstIndex, secondIndex, relation, type} = r

                    const relationName = getNameForRelation(type)

                    const p1 = Points[firstIndex]
                    const p2 = Points[secondIndex]

                    const {Name: n1} = p1
                    const {Name: n2} = p2

                    const isSelected = selectedYPositionRelations[ri]
                    const comment = selectedYPositionRelationsComments[ri]

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

                                <span className="default-gray">Point <span className="default-title">{n1}</span></span> 

                                <p className="default-title">{relation}</p>

                                <span className="default-gray">Point <span className="default-title">{n2}</span></span> 
                                
                                &nbsp;&nbsp;

                                <Tooltip
                                    color="white"
                                    title={<p>Click to select/unselect condition</p>}
                                >
                                    <CheckCircleOutlined 
                                    onClick={() => selectCondition("selectedYPositionRelations", ri, isSelected)}
                                    className={"hq-clickable default-large " + (isSelected ? "default-green" : "default-gray")}/>
                                </Tooltip>
                            </Space>
                            <CommentComponent 
                                onChange = {(v) => setConditionComment("selectedYPositionRelations", ri, v)}
                                value = {comment}
                            />
                        </div>
                    )
                })}

                <br/>
                {mRelationsFinal.map((r, ri) => {
                    const {firstIndex, secondIndex, relation, type} = r

                    const relationName = getNameForRelation(type)

                    const p1 = Points[firstIndex]
                    const p2 = Points[secondIndex]

                    let p1Next = Points[firstIndex + 1]
                    let p2Next = Points[secondIndex + 1]

                    if(!p1Next) p1Next = Points[0]
                    if(!p2Next) p2Next = Points[0]

                    const {Name: n1} = p1
                    const {Name: n2} = p2

                    const {Name: nx1} = p1Next
                    const {Name: nx2} = p2Next

                    const isSelected = selectedGradientRelations[ri]
                    const comment = selectedGradientRelationsComments[ri]

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

                                <p className="default-title">{relation}</p>

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

                                <Tooltip
                                    color="white"
                                    title={<p>Click to select/unselect condition</p>}
                                >
                                    <CheckCircleOutlined
                                    onClick={() => selectCondition("selectedGradientRelations", ri, isSelected)} 
                                   
                                    className={"hq-clickable default-large " + (isSelected ? "default-green" : "default-gray")}/>
                                </Tooltip>
                            </Space>
                            <CommentComponent 
                                onChange = {(v) => setConditionComment("selectedGradientRelations", ri, v)}
                                value = {comment}
                            />
                        </div>
                    )
                })}
            </div>
        )
        
    }

    const mapGroupView = (tab) => {
        const map = {
            0: settingsSection,
            1: pointsSection,
            2: conditionsSection
        }

        return map[tab]()
    }
 
    const renderPointGroupsList = () => {   

        const group = (newPointGroups[selectedGroupIndex]) || {Code: 'Please select', Points: []}
        const {Id: groupId, Code} = group

        return(
            <div>
                <Space>
                    <Select
                        onChange={(v, option) => {
                            const {value: gIndex} = option
                            setSelectedGroupIndex(gIndex)
                            setCurrentGroupTab(0)
                            setCurrentPointsTab(0)

                            setIsAdding(false)

                            setSelectedPointMoveIndex(null)
                            setSelectedCPPointMoveIndex(null)
                        }}
                        defaultValue={'please select'}
                        value={Code}
                        className='add-q-pv-d-navigation-bar-groups-select'
                        options={(newPointGroups || []).map((d, di) => ({
                            value: di,
                            label: d.Code
                            }))}
                    />
                    <Button
                        type="default"
                        size="small"
                        icon={<PlusOutlined className="default-green"/>}

                        onClick={() => {
                            let groups = [...newPointGroups, {
                                Id: 1,
                                Code:'Group #' + (newPointGroups.length+1), 
                                ConnectingLineColor:'green',
                                ConnectingLineWidth: 1, 
                                IsClosedLoop: false,
                                Points: [],

                                relationsList: [],
                                relationsFinal: [],
                                
                                selectedShapeConditions: [],
                                selectedShapeConditionsComments: [],

                                selectedPointPositionConditions: [],
                                selectedPointPositionConditionsComments: [],

                                selectedPointSlopeConditions: [],
                                selectedPointSlopeConditionsComments: [],
                                
                                selectedXPositionRelations: [],
                                selectedXPositionRelationsComments: [],

                                selectedYPositionRelations: [],
                                selectedYPositionRelationsComments: [],

                                selectedGradientRelations: [],
                                selectedGradientRelationsComments: [],
                            }]

                            setNewPointGroups(groups)

                            setSelectedGroupIndex(groups.length - 1)

                            setCurrentGroupTab(0)
                        }}
                    >
                        New group
                    </Button>
                </Space>
                <br/>
                <br/>
                {groupId ? 
                <Space
                    align="center"
                >
                        <div>
                            <Input
                                value={Code}
                                className="add-q-pv-d-group-code"

                                onChange={(v) => {
                                    const value = v.target.value

                                    let _groups = [...newPointGroups]

                                    _groups[selectedGroupIndex].Code = value

                                    setNewPointGroups(_groups)
                                }}

                            />
                        </div>
                        <Button
                            type="default"
                            size="small"
                            icon={<DeleteOutlined className="default-red"/>}

                            onClick={() => {
                                const _groups = newPointGroups.filter((g, gi) => gi !== selectedGroupIndex)

                                setNewPointGroups(_groups)
                                setSelectedGroupIndex(0)
                            }}
                        >
                            Delete
                        </Button>
                        <Button
                            type="default"
                            size="small"
                            icon={<PlusOutlined className="default-green"/>}

                            onClick={() => {
                                if(!Object.is(selectedPointMoveIndex, null)){
                                    api.warning("Please finish moving selected point")
                                    return
                                }

                                if(!Object.is(selectedCPPointMoveIndex, null)){
                                    api.warning("Please finish moving selected control point point")
                                    return
                                }
                                setCurrentGroupTab(1)
                                setIsAdding(!isAdding)
                            }}
                        >
                            New point
                        </Button>
                </Space> : <div/>}
                <br/>
                <br/>
                {groupId ?
                    <div>
                    <Radio.Group value={currentGroupTab} onChange={(e) => setCurrentGroupTab(e.target.value)} buttonStyle="solid">
                        <Radio.Button value={0}>Settings</Radio.Button>
                        <Radio.Button value={1}>Points</Radio.Button>
                        <Radio.Button value={2}>Conditions</Radio.Button>
                    </Radio.Group>
                    <br/>
                    {mapGroupView(currentGroupTab)}
                </div> : <div/>}
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

        const validateInfo = validateContent_QuestionInfo()
        const validatePoints = validateContent_QuestionContent()

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
                <p>Plot point groups</p> 
            
                {validatePoints &&
                <Tooltip
                    color="white"
                    title={<p>{validatePoints}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,
            children: <div>{renderPointGroupsList()}</div>
        }]

        return(
            <div> 
                <Row>
                    <Col>
                        <div>
                            
                        <AddPVDiagramQuestionInteractivePlot 
                            style={{width:imageWidth, height:imageHeight, border:'red solid 1px'}}

                            isAdding = {isAdding}

                            imageURL = {newImageURL}

                            onAdd= {(p) => {
                                let _groups = [...newPointGroups]

                                let _points = [..._groups[selectedGroupIndex].Points]
                                const {x, y} = p

                                _points.push({
                                    ...p,
                                    Name:'point',
                                    Color:'lightgreen',
                                    BorderColor:'green',
                                    MarginY: 0,
                                    MarginX: 0, 
                                    cx: x, 
                                    cy: y
                                })

                                _points = conformPoints(_points)
                                _groups[selectedGroupIndex].Points = _points

                                setNewPointGroups(_groups)
                                setCurrentPointsTab(_points.length - 1)
                                setIsAdding(false)
                            }}

                            points={newPoints}
                            groups = {newPointGroups}
                            selectedGroupIndex = {selectedGroupIndex}

                            selectedPointIndex = {selectedHighlightPointIndex}

                            onSelectedPointMove = {(pi) => {
                                setSelectedPointMoveIndex(pi)
                                setSelectedCPPointMoveIndex(null)
                            }}

                            selectedPointMoveIndex = {selectedPointMoveIndex}

                            onPointMove = {(p, gi) => {
                                let _groups = [...newPointGroups]

                                let _points = [..._groups[gi].Points]
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

                                _groups[gi].Points = _points

                                setNewPointGroups(_groups)
                            }}

                            onSelectedCPPointMove = {(pi) => {
                                setSelectedPointMoveIndex(null)
                                setSelectedCPPointMoveIndex(pi)
                            }}

                            selectedCPPointMoveIndex = {selectedCPPointMoveIndex}

                            onCPPointMove = {(p, gi) => {
                                let _groups = [...newPointGroups]

                                let _points = [..._groups[gi].Points]
                                const {x, y} = p

                                _points[selectedCPPointMoveIndex].cx = x
                                _points[selectedCPPointMoveIndex].cy = y

                                _groups[gi].Points = _points

                                setNewPointGroups(_groups)
                            }}

                            highlightedShape = {highlightedShape}
                            highlightedSlope = {highlightedSlope}
                            highlightedRelation = {highlightedRelation}
                        />  

                        <img 
                            alt="new-map"

                            style={{width:0, height:0}}

                            src={newImageURL}

                            ref={imageRef}

                            onLoad={(img) => {

                                img.persist()   

                                const _w = img.target.naturalWidth
                                const _h = img.target.naturalHeight

                                setNewImageWidth(_w )
                                setNewImageHeight(_h)

                                const _imageWidth = 0.35*window.innerWidth
                                const _imageHeight = ((_h*_imageWidth)/_w)

                                setImageWidth(_imageWidth)
                                setImageHeight(_imageHeight)
                            }}
                        />
                        
                        </div>
                    </Col>
                    <Col xs={2}/>
                    <Col>
                        <Tabs
                            defaultActiveKey={1}
                            items={tabs}
                            onChange={(t) => {
                                setCurrentSubtab(t)
                                setCurrentGroupTab(0)
                                setCurrentPointsTab(t === 1 ? -1 : 0)
                                setSelectedHighlightPointIndex(null)

                                setSelectedPointMoveIndex(null)
                                setSelectedCPPointMoveIndex(null)
                            }}
                            activeKey={currentSubtab}
                            className="add-pv-d-question-tabs"
                        />
                    </Col>
                </Row>
            </div>
        )
    }

    const validateAddImage = () => {
        if(!newImage)
            return "Please add an image"
    
        return null
    }

    const validateQuestionContent = () => {
        const validateInfo = validateContent_QuestionInfo()
        const validatePoints = validateContent_QuestionContent()

        if(validateInfo) return validateInfo;
        if(validatePoints) return validatePoints;

        return null
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

        const data = new FormData()
        data.append('Code', questionInfo.Code)
        data.append('SubtopicId', questionInfo.selectedSubtopic.Id)
        data.append('LODId', questionInfo.selectedLOD.Id)

        data.append('QuestionText', questionBody)

        data.append('IsPermutableScoreEvaluation', isPermutableScoreEvaluation)

        data.append('Picture', newImage)
        data.append('Width', Number.parseInt(imageWidth))
        data.append('Height', Number.parseInt(imageHeight))

        data.append('PDF', newPDF)


        const groups = newPointGroups.map((g) => {
            const {Points, 
                selectedShapeConditions, selectedShapeConditionsComments,
                selectedPointPositionConditions, selectedPointPositionConditionsComments,
                selectedPointSlopeConditions,selectedPointSlopeConditionsComments,
                selectedXPositionRelations, selectedXPositionRelationsComments,
                selectedYPositionRelations, selectedYPositionRelationsComments,
                selectedGradientRelations, selectedGradientRelationsComments,
                relationsFinal, relationsList,
                ConnectingLineWidth, ConnectingLineColor
            } = g

                let relations = []

                const {xRelationsFinal, yRelationsFinal, mRelationsFinal} = relationsFinal
                const {pointsShape} = relationsList
        
                relations = selectedXPositionRelations.map((r, ri) => {
                    if(!r) return null;
        
                    const _relation = xRelationsFinal[ri]
                    const {firstIndex, secondIndex, type, relation} = _relation
        
                    const typeCode = getTypeForRelation(type)

                    const comment = selectedXPositionRelationsComments[ri]

                    return({
                        FirstPointId: firstIndex,
                        SecondPointId: secondIndex,
        
                        Value: relation,
        
                        Type: typeCode,

                        Comment: comment
                    })
                }).filter(a => a)
        
                relations = [...relations, ...selectedYPositionRelations.map((r, ri) => {
                    if(!r) return null;
        
                    const _relation = yRelationsFinal[ri]
                    const {firstIndex, secondIndex, type, relation} = _relation
        
                    const typeCode = getTypeForRelation(type)

                    const comment = selectedYPositionRelationsComments[ri]

                    return({
                        FirstPointId: firstIndex,
                        SecondPointId: secondIndex,
        
                        Value: relation,
        
                        Type: typeCode,

                        Comment: comment
                    })
                }).filter(a => a)]
        
                relations = [...relations, ...selectedGradientRelations.map((r, ri) => {
                    if(!r) return null;
        
                    const _relation = mRelationsFinal[ri]
                    const {firstIndex, secondIndex, type, relation} = _relation
        
                    const typeCode = getTypeForRelation(type)
        
                    const comment = selectedGradientRelationsComments[ri]

                    return({
                        FirstPointId: firstIndex,
                        SecondPointId: secondIndex,
        
                        Value: relation,
        
                        Type: typeCode,

                        Comment:comment
                    })
            }).filter(a => a)]

            return({
                ...g,
                LineColor: ConnectingLineColor,
                LineWidth: ConnectingLineWidth,
                
                Points: Points.map((p, pi) => {
                    const isPositionConsidered = selectedPointPositionConditions[pi]
                    const positionComment = selectedPointPositionConditionsComments[pi]

                    const isShapeConsidered = selectedShapeConditions[pi]
                    const shapeComment = selectedShapeConditionsComments[pi]
                    
                    const pShape = pointsShape[pi]
                    let shape = pShape ? pShape.shape : null

                    return({
                        Id: pi,
    
                        X: Math.floor(p.x),
                        Y: Math.floor(p.y),
    
                        CX: Math.floor(p.cx),
                        CY: Math.floor(p.cy),
    
                        Name: p.Name,
    
                        MarginX: p.MarginX,
                        MarginY: p.MarginY,
    
                        InnerColor: p.Color,
                        OuterColor: p.BorderColor,
    
                        IsPoistionConsiderable: isPositionConsidered,
                        PositionComment: positionComment,
                        
                        IsShapeConsiderable: isShapeConsidered,
                        ShapeComment: shapeComment,

                        CurveShape: shape
                    })
                }),

                Relations: relations
            })
        })

        data.append('Groups', JSON.stringify(groups))

         /*const {pointsShape} = relationsList

        const points = newPoints.map((p, pi) => {
            const isPositionConsidered = selectedPointPositionConditions[pi]
            const isShapeConsidered = selectedShapeConditions[pi]
            
            const pShape = pointsShape[pi]
            let shape = pShape ? pShape.shape : null

            return({
                Id: pi,

                X: Math.floor(p.x),
                Y: Math.floor(p.y),

                CX: Math.floor(p.cx),
                CY: Math.floor(p.cy),

                Name: p.name,

                MarginX: p.MarginX,
                MarginY: p.MarginY,

                InnerColor: p.Color,
                OuterColor: p.BorderColor,

                IsPoistionConsiderable: isPositionConsidered,
                IsShapeConsiderable: isShapeConsidered,

                CurveShape: shape
            })
        })

        let relations = []

        const {xRelationsFinal, yRelationsFinal, mRelationsFinal} = relationsFinal

        relations = selectedXPositionRelations.map((r, ri) => {
            if(!r) return null;

            const _relation = xRelationsFinal[ri]
            const {firstIndex, secondIndex, type, relation} = _relation

            const typeCode = getTypeForRelation(type)

            return({
                FirstPointId: firstIndex,
                SecondPointId: secondIndex,

                Value: relation,

                Type: typeCode
            })
        }).filter(a => a)

        relations = [...relations, ...selectedYPositionRelations.map((r, ri) => {
            if(!r) return null;

            const _relation = yRelationsFinal[ri]
            const {firstIndex, secondIndex, type, relation} = _relation

            const typeCode = getTypeForRelation(type)

            return({
                FirstPointId: firstIndex,
                SecondPointId: secondIndex,

                Value: relation,

                Type: typeCode
            })
        }).filter(a => a)]

        relations = [...relations, ...selectedGradientRelations.map((r, ri) => {
            if(!r) return null;

            const _relation = mRelationsFinal[ri]
            const {firstIndex, secondIndex, type, relation} = _relation

            const typeCode = getTypeForRelation(type)

            return({
                FirstPointId: firstIndex,
                SecondPointId: secondIndex,

                Value: relation,

                Type: typeCode
            })
        }).filter(a => a)]

        data.append('Points', JSON.stringify(points))
        data.append('Relations', JSON.stringify(relations))*/

        addPVDiagramQuestion(data).then(r => handleResponse(r, api, 'Added successfully', 1))

    }

    const renderFinalPage = () => {
    
        return(
            <Space direction="vertical">
                {!canAdd && <p className="default-red">Please fill all required data</p>}
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
                    loading={isLoadingAddPVDiagramQuestion}
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

    console.log(newPointGroups)

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