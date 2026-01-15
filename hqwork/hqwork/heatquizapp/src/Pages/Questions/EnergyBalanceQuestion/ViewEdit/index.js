import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Button, Col, Divider, Dropdown, List, Popconfirm, Row, Space, Tabs, Tooltip, message } from "antd";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { FixURL, handleResponse } from "../../../../services/Auxillary";
import { ControlOutlined, InsertRowAboveOutlined, PlusOutlined, CloseCircleFilled, EditOutlined, PictureOutlined} from '@ant-design/icons';
import './index.css'
import { UpdateControlVolumeImage } from "./UpdateControlVolumeImage";
import { UpdateEBTermCodeLatex } from "./UpdateEBTermCodeLatex";
import { UpdateEBTermLatexText } from "./UpdateEBTermLatexText";
import { UpdateEBTermDirections } from "./UpdateEBTermDirections";
import { UpdateEBTermQuestionLatex } from "./UpdateEBTermQuestionLatex";
import { AddEbTermQuestion } from "./AddEbTermQuestion";
import { AddEbTerm } from "./AddEbTerm";
import { SetKeyboardBCIC } from "./SetKeyboardBCIC";
import { AddBCICTerms } from "./AddBCICTerms";
import { UpdateQuestionLatex } from "./UpdateQuestionLatex";
import { UpdateQuestionImage } from "./UpdateQuestionImage";
import { AddControlVolume } from "./AddControlVolume";
import { UpdateControlVolumeComment } from "./UpdateControlVolumeComment";
import { UpdateEBTermComment } from "./UpdateEBTermComment";
import { UpdateBCICComment } from "./UpdateBCICComment";

export function EnergyBalanceQuestionEditView({reloadQuestion}){

    const {energyBalanceQuestionPlay: question,
        editEnergyBalanceControlVolumeStatus,
        removeEnergyBalanceControlVolume,

        removeEnergyBalanceEBT,

        editEnergyBalanceEBT_Direction,
        removeEnergyBalanceEBT_Question,
        flipEnergyBalanceEBT_Question_Direction,

        removeEnergyBalanceBC,
        removeEnergyBalanceIC,
    } = useQuestions()

    const imageRef = React.createRef()
    const imageRef2 = React.createRef()
    const [offset, setOffset] = useState(0)

    const [api, contextHolder] = message.useMessage()

    const [currentTab, setCurrentTab] = useState(1)

    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)

    const [isMovingElement, setIsMovingElement] = useState(false)
    const [movedElement, setMovedElement] = useState(false)

    const [leftOffset, setLeftOffset] = useState(0)

    const [newParts, setNewParts] = useState([])

    const [showEditQuestionImage, setShowEditQuestionImage] = useState(false)
    const [showEditGeneralLatex, setShowEditGeneralLatex] = useState(false)

    const [showAddControlVolume, setShowAddControlVolume] = useState(false)

    const [showEditCVImage, setShowEditCVImage] = useState(false)
    const [showEditCVComment, setShowEditCVComment] = useState(false)
    const [selectedCV, setSelectedCV] = useState(null)

    const [showEditTermCodeLatex, setShowEditTermCodeLatex] = useState(false)
    const [showEditTermLatexText, setShowEditTermLatexText] = useState(false)
    const [showEditTermComment, setShowEditTermComment] = useState(false)
    const [showEditTermDirections, setShowEditTermDirections] = useState(false)

    const [selectedEBTerm, setSelectedEBTerm] = useState(null)

    const [showEditTermQuestionLatex, setShowEditTermQuestionLatex] = useState(false)
    const [selectedEBTermQuestion, setSelectedEBTermQuestion] = useState(null)

    const [showAddTermQuestion, setShowAddTermQuestion] = useState(false)
    const [showAddTerm, setShowAddTerm] = useState(false)

    const [showSetKeyboardBCIC, setShowKeyboardBCIC] = useState(false)
    const [showSetKeyboardBCIC_IsBC, setShowKeyboardBCIC_IsBC] = useState(false)

    const [showAddConditions, setShowAddConditions] = useState(false)
    const [showAddConditions_IsBC, setShowAddConditions_IsBC] = useState(false)
    const [showAddConditions_SelectedKeyboard, setShowAddConditions_SelectedKeyboard] = useState(null)

    const [showEditBCICComment, setShowEditBCICComment] = useState(false)
    const [selectedBCIC, setSelectedBCIC] = useState(null)
    const [IsBoundaryCondition, setIsBoundaryCondition] = useState(false)

    useEffect(() => {
        let _offset = 0

        if(imageRef){
            const div = imageRef.current
            
            _offset = parseInt(window.getComputedStyle(div).paddingRight.replace('px',''))

            setOffset(_offset)

        }
    }, [imageRef])

  
    const renderQuestionImage = () => {
        const {Code, Base_ImageURL, Base_ImageURL_Width, Base_ImageURL_Height,} = question
        
        const backgroundImageStyle = ({
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'contain',
            border:'1px solid rgb(245, 245, 245)',
            cursor:'crosshair'
        })

        return(
            <Space align="start">
                <img
                style = {{
                    ...backgroundImageStyle,
                    height:Base_ImageURL_Height,
                    width:Base_ImageURL_Width,
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
               
                <Tooltip
                    color="white"
                    title={<p>Edit image</p>}
                >
                    <PictureOutlined 
                        className="hq-clickable"
                        onClick={() => {
                            setShowEditQuestionImage(true)
                        }}
                    />
                </Tooltip>
            </Space>
        )
    }

    const calculateCPdimensions = (imageWidth, imageHeight,specificedWidth, specificedHeight, element, Offset=0) => {
        return({            
            width: (element.Width * specificedWidth) / (imageWidth),
            height: (element.Height * specificedHeight) /( imageHeight),
            left: (element.X * specificedWidth) / (imageWidth),
            top: (element.Y * specificedHeight) / (imageHeight),
        })
    }

    const renderControlVolumeList = () => {
        const {ControlVolumes, Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL} = question
     
        const smallImageWidth = window.innerWidth * 0.20
        const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth

        return(
            <div>
                <Tooltip
                    color="white"
                    title={<p>Add new control volume</p>}
                >
                    <Button
                        size="small"
                        onClick={() => {
                            setShowAddControlVolume(true)
                        }}

                        icon={<PlusOutlined style={{color:'green'}}/>}
                    >
                        Add
                    </Button>
                </Tooltip>

                <br/>
                <br/>
                <List 
                    dataSource={ControlVolumes.sort((a, b) => a.Id - b.Id)}

                    renderItem={(cv, cvi) => {
                        const {Id, Correct, ImageURL, Comment} = cv
                        const cvDimesions =  calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, cv)

                        return(
                            <div
                                key={Id}
                            >
                                <Space align="start">
                                    <p className={Correct ? "default-green" : "default-gray"}>{cvi+1}</p>

                                    &nbsp;
                                    &nbsp;
                                    <p className={Correct ? "default-green" : "default-white"}>Correct</p>
                                    &nbsp;
                                    &nbsp;

                                    <div>
                                        <div 
                                            style = {{
                                                height:smallImageHeight,
                                                width: smallImageWidth,
                                                backgroundImage: `url(${FixURL(ImageURL || Base_ImageURL)})`,
                                                backgroundPosition:'center',
                                                backgroundRepeat:'no-repeat',
                                                backgroundSize:'contain',
                                                border:'1px solid gainsboro'
                                            }}
                                        >
                                            <div style={{...cvDimesions, position:'relative', border:Correct ? '1px dashed #28a745' : '1px dashed gray' }}>
                                                <div style={{width:'100%', height:'100%', backgroundColor:'#f1f4f8', opacity:'40%'}}></div>
                                            </div>    
                                        </div>
                                        {Comment &&
                                        <div>
                                          <small className="default-gray">Comment  &nbsp; <i>in summary screen</i></small>   
                                          <p>{Comment}</p>
                                        </div>}
                                    </div>

                                    <Dropdown
                                        menu={{
                                            items:[
                                            {
                                                key: 'set_as_correct',
                                                label: 'Set as correct',
                                                onClick: () => {
                                                    let data = new FormData()
                                                    data.append('Id', cv.Id)

                                                    editEnergyBalanceControlVolumeStatus(data).then((r) => handleResponse(r, api, 'Updated', 1, () => {
                                                        reloadQuestion()
                                                    }))
                                                }
                                            },
                                            {
                                                key: 'set_update_image',
                                                label: 'Set/Update image',
                                                onClick: () => {
                                                    setShowEditCVImage(true)
                                                    setSelectedCV({...cv, smallImageWidth, smallImageHeight, dimensions:cvDimesions, Base_ImageURL})
                                                }
                                            },
                                            {
                                                key: 'set_update_comment',
                                                label: 'Set/Update comment',
                                                onClick: () => {
                                                    setShowEditCVComment(true)
                                                    setSelectedCV({...cv, smallImageWidth, smallImageHeight, dimensions:cvDimesions, Base_ImageURL})
                                                }
                                            },
                                            {
                                                key: 'delete_cv',
                                                label:
                                                <Popconfirm
                                                    title="Remove control volume"
                                                    description="Are you sure to delete this control volume?"
                                                            onConfirm={() => {
                                                                let data = new FormData()
                                                                data.append('Id', cv.Id)
                                                                removeEnergyBalanceControlVolume(data)
                                                                .then(r => handleResponse(r, api, 'Removed', 1, () => reloadQuestion()))
                                                            }}
                                                    onCancel={() => {}}
                                                    okText="Yes"
                                                    cancelText="No"
                                                    placement="right"
                                                >
                                                
                                                    Delete
                                                </Popconfirm>,
                                                
                                                onClick: () => {}
                                            }],
                                            title:'Actions'
                                        }}
                                    >
                                        <ControlOutlined className="default-gray hoverable"/>
                                    </Dropdown>
                                </Space>
                                <Divider/>
                                <br/>
                            </div>
                        )
                    }}

                />
            </div>
        )
    }

    const renderItemBox = (t) => {
        const {Id, North: isNorthSelected, East: isEastSelected, West: isWestSelected, South: isSouthSelected, Center: isCenterSelected} = t

        const totalWidthHeight = 0.03*window.innerWidth
        const shapesGap = 0.1*totalWidthHeight
        const width1 = 0.125 * totalWidthHeight
        const width2 = totalWidthHeight - 2 * shapesGap - 2 * width1

        let selectedColor = 'rgba(2, 117, 216, 0.5)'

        const notSelectedStyle = {backgroundColor:'#f1f4f8', border:'1px solid #e6e6e6',}
        const selectedStyle = {backgroundColor:selectedColor, border:'1px solid #0275d8',} 

        return(
            <Space 
            key={Id}
            direction="vertical">
                <div style={{flexDirection:'row', display:'flex', width: totalWidthHeight, height:totalWidthHeight}}>
                
                    <div 
                        style={{width:width1, height: width2, marginRight:shapesGap, marginTop: (shapesGap + width1), ...(isEastSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* East */}
                    </div>

                    <div style={{width:width2, height: totalWidthHeight, marginRight:shapesGap}}>
                        <div 
                            style={{width:width2, height: width1, marginBottom:shapesGap, ...(isNorthSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* North */}
                        </div>

                        <div
                            style={{width:width2, height: width2, marginBottom:shapesGap, ...(isCenterSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* Center */}
                        </div>

                        <div 
                            style={{width:width2, height: width1, ...(isSouthSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* South */}
                        </div>
                    </div>

                    <div 
                        style={{width:width1, height: width2, marginTop: (shapesGap + width1), ...(isWestSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* West */}
                    </div>
                </div>
            </Space>
        )

    }

    const renderEnergyBalanceTerms = () => {
        const {EnergyBalanceTerms} = question

        return(
            <div>
                <Tooltip
                    color="white"
                    title={<p>Add new energy balance term</p>}
                >
                    <Button
                        size="small"
                        onClick={() => {
                            setShowAddTerm(true)
                        }}

                        icon={<PlusOutlined style={{color:'green'}}/>}
                    >
                        Add
                    </Button>
                </Tooltip>

                <br/>
                <br/>
                <List 
                    dataSource={EnergyBalanceTerms}

                    renderItem={(t, ti) => {
                        const {Id, IsDummy, Code, Latex, LatexText, Questions, Comment} = t

                        return(
                            <div
                                key={Id}
                                className="hq-element-container"
                            >
                                    <p className="edit-eb-question-term-heading1">Balance term <span className="default-title">{ti+1}</span></p>
                                    <Space
                                        className="hq-full-width hq-opposite-arrangement"
                                    >
                                        <Space>
                                            <div
                                                className="hq-clickable" 
                                                onClick = {() => {
                                                    setShowEditTermDirections(true)
                                                    setSelectedEBTerm(t)
                                                }}
                                            >
                                                {IsDummy ? <Space><p className="default-gray">Dummy term</p>&nbsp;&nbsp;&nbsp;</Space>
                                                 : renderItemBox(t)}
                                            </div>
                                            <Space 
                                            className="hq-clickable" 
                                            onClick = {() => {
                                                setShowEditTermCodeLatex(true)
                                                setSelectedEBTerm(t)
                                            }}>
                                                <LatexRenderer latex={"$$" + Latex + "$$"}/>
                                                <p className="default-title">{Code}</p>
                                            </Space>
                                        </Space>

                                        <Dropdown
                                        menu={{
                                            items:[
                                            {
                                                key: 'edit_code',
                                                label: 'Update code/LaTeX',
                                                onClick: () => {
                                                    setShowEditTermCodeLatex(true)
                                                    setSelectedEBTerm(t)
                                                }
                                            },
                                            {
                                                key: 'edit_text',
                                                label: 'Update instruction for definition',
                                                onClick: () => {
                                                    setShowEditTermLatexText(true)
                                                    setSelectedEBTerm(t)
                                                }
                                            },
                                            {
                                                key: 'edit_comment',
                                                label: 'Update comment',
                                                onClick: () => {
                                                    setShowEditTermComment(true)
                                                    setSelectedEBTerm(t)
                                                }
                                            },
                                            {
                                                key: 'edit_directions',
                                                label: 'Update directions',
                                                onClick: () => {
                                                    setShowEditTermDirections(true)
                                                    setSelectedEBTerm(t)
                                                }
                                            },
                                            {
                                                key: 'set_dummy',
                                                label: 'Set as dummy',
                                                onClick: () => {

                                                    let data = new FormData()
                                                    data.append("TermId", t.Id)

                                                    data.append("West", false)
                                                    data.append("East", false)
                                                    data.append("North", false)
                                                    data.append("South", false)
                                                    data.append("Center", false)
                                                    data.append("IsDummy", true)

                                                    editEnergyBalanceEBT_Direction(data).then(r => handleResponse(r, api, 'Updated', 1, () => {
                                                        reloadQuestion()
                                                    }))
                                                }
                                            },
                                            {
                                                key: 'add_question',
                                                label: 'Add question',
                                                onClick: () => {
                                                    setShowAddTermQuestion(true)
                                                    setSelectedEBTerm(t)
                                                }
                                            },
                                            {
                                                key: 'delete_eb_term',
                                                label: <Popconfirm
                                                title="Remove energy balance term"
                                                description="Are you sure to delete this energy balance term?"
                                                        onConfirm={() => {
                                                            let data = new FormData()
                                                            data.append('Id', t.Id)
                                                            removeEnergyBalanceEBT(data)
                                                            .then(r => handleResponse(r, api, 'Removed', 1, () => reloadQuestion()))
                                                        }}
                                                onCancel={() => {}}
                                                okText="Yes"
                                                cancelText="No"
                                                placement="right"
                                            >
                                            
                                                Delete
                                            </Popconfirm>,
                                                onClick: () => {}
                                            }],
                                            title:'Actions'
                                        }}
                                    >
                                        <ControlOutlined className="default-gray hoverable"/>
                                    </Dropdown>
                                </Space>
                                <Divider/>

                                <div 
                                    className="hq-clickable" 
                                    onClick = {() => {
                                        setShowEditTermLatexText(true)
                                        setSelectedEBTerm(t)
                                    }}
                                >
                                    <small className="default-gray">
                                        Instruction for definition
                                    </small>
                                    <LatexRenderer latex={LatexText || ""} />
                                </div>

                                <Divider/>
                                <div 
                                    className="hq-clickable" 
                                    onClick = {() => {
                                        setShowEditTermComment(true)
                                        setSelectedEBTerm(t)
                                    }}
                                >
                                    <small className="default-gray">
                                        Comment &nbsp; <i>in summary screen</i>
                                    </small>
                                    <p>{Comment}</p>
                                </div>
                                

                                <Divider/>
                                {Questions.map((q, qi) => {
                                    const {Id, LatexCode, Inflow, Keyboard, Answers} = q

                                    return(
                                        <Space
                                            key={Id}
                                            direction="vertical hq-full-width "
                                        >   
                                            <p className="edit-eb-question-term-heading2">Question <span className="default-gray">{qi+1}</span></p>

                                            <Space
                                                className="hq-full-width hq-opposite-arrangement"
                                            >
                                                <Space>
                                                    <div
                                                        className="hq-clickable" 
                                                        onClick = {() => {
                                                            let VM = ({...q})
                                                            VM.Inflow = !q.Inflow

                                                            flipEnergyBalanceEBT_Question_Direction(VM).then(r => handleResponse(r, api, 'Flipped', 1, () => {
                                                                reloadQuestion()
                                                            }))
                                                        }}
                                                    >
                                                        <Tooltip
                                                            color="white"
                                                            title={<p>Click to flip direction</p>}
                                                        >
                                                        {Inflow ? 
                                                            <div
                                                            className={"eb-question-view-edit-term-direction-green"}>
                                                                <span className="eb-question-view-edit-term-word">Inflow</span>
                                                            </div>
                                                            :
                                                            <div 
                                                            className={"eb-question-view-edit-term-direction-red"}>
                                                                <span className="eb-question-view-edit-term-word">Outflow</span>
                                                            </div>}
                                                        </Tooltip>
                                                    </div>
                                                    
                                                    <div
                                                        className="hq-clickable" 
                                                        onClick = {() => {
                                                            setShowEditTermQuestionLatex(true)
                                                            setSelectedEBTermQuestion(q)
                                                        }}
                                                    >
                                                        <LatexRenderer latex={"$$" + LatexCode  + "$$"} />
                                                    </div>
                                                </Space>
                                                <Dropdown
                                                    menu={{
                                                        items:[{
                                                            key: 'edit_latex',
                                                            label: 'Update LaTeX',
                                                            onClick: () => {
                                                                setShowEditTermQuestionLatex(true)
                                                                setSelectedEBTermQuestion(q)
                                                            }
                                                        },
                                                        {
                                                            key: 'flip_flow',
                                                            label: 'Flip flow direction',
                                                            onClick: () => {
                                                                let VM = ({...q})
                                                                VM.Inflow = !q.Inflow

                                                                flipEnergyBalanceEBT_Question_Direction(VM).then(r => handleResponse(r, api, 'Flipped', 1, () => {
                                                                    reloadQuestion()
                                                                }))
                                                            }
                                                        },
                                                        {
                                                            key: 'delete',
                                                            label:
                                                            <Popconfirm
                                                            title="Remove question"
                                                            description="Are you sure to delete this question?"
                                                                    onConfirm={() => {
                                                                        let data = new FormData()
                                                                        data.append('Id', q.Id)
                                                                        removeEnergyBalanceEBT_Question(data).then(r => handleResponse(r, api, 'Removed', 1, () => {
                                                                            reloadQuestion()
                                                                        }))
                                                                    }}
                                                            onCancel={() => {}}
                                                            okText="Yes"
                                                            cancelText="No"
                                                            placement="right"
                                                        >
                                                        
                                                            Delete
                                                        </Popconfirm>,
                                                        onClick: () => {}
                                                        }],
                                                        title:'Actions'
                                                    }}
                                                >
                                                    <ControlOutlined className="default-gray hoverable"/>
                                                </Dropdown>
                                            </Space>
                                            <Space>
                                                <InsertRowAboveOutlined />
                                                <p> {Keyboard.Name} </p>
                                            </Space>
                                            {Answers.map((a, ai) => {

                                                const answerReduced = a.AnswerElements
                                                .sort((c,d) => c.Id > d.Id ? 1 : -1)
                                                .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

                                                return(
                                                    <div
                                                        key={ai}
                                                        style={{width:'fit-content'}}
                                                    >
                                                        <LatexRenderer latex={"$$" + answerReduced + "$$"}/>
                                                    </div>
                                                )
                                            })}
                                            <br/>
                                        </Space>
                                    )
                                })}
                            </div>
                        )
                    }}
                />
            </div>
        )
    }

    const renderBoundaryConditions = () => {
        const {BoundryConditionKeyboard, BoundaryConditionLines} = question
        return(
            <div>
                <Space size={'large'}>
                    {BoundryConditionKeyboard && 
                    <Space>
                        <InsertRowAboveOutlined className="default-title"/>
                        <p> {BoundryConditionKeyboard.Name} </p>
                    </Space>}
                    {BoundryConditionKeyboard && 
                        <div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                        </div>
                    }
                    <Button
                        size="small"
                        onClick={() => {
                            setShowKeyboardBCIC(true)
                            setShowKeyboardBCIC_IsBC(true)
                        }}
                    >
                        {!BoundryConditionKeyboard && <InsertRowAboveOutlined className="default-title"/>}
                        Update keyboard
                    </Button>

                    {BoundryConditionKeyboard &&
                    <Button
                        size="small"
                        onClick={() => {
                            setShowAddConditions(true)
                            setShowAddConditions_IsBC(true)
                            setShowAddConditions_SelectedKeyboard(BoundryConditionKeyboard)
                        }}
                    >
                        <PlusOutlined className="default-green"/>
                        Add answers
                    </Button>
                    }
                </Space>
                <br/>
                {BoundaryConditionLines.map((a, ai) => {
                    const {Id, Comment} = a

                    const answerReduced = a.AnswerElements
                    .sort((c,d) => c.Id > d.Id ? 1 : -1)
                    .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

                    
                    return(
                        <Space
                            key={Id}
                            direction="vertical"
                            align="start"
                        >
                            <Space>
                                <p className="default-gray">{ai+1}</p>

                                &nbsp;
                                <Tooltip 
                                    title={<p>Click to remove boundary condition</p>}
                                    color="white"
                                >
                                    <Popconfirm
                                        title="Remove boundary condition"
                                        description="Are you sure to delete this boundary condition?"
                                        onConfirm={() => {
                                            const data = new FormData()

                                            data.append('Id', Id)

                                            removeEnergyBalanceBC(data).then(r => handleResponse(r, api, 'Removed', 1, () => {
                                                reloadQuestion()
                                            }))
                                        }}
                                        onCancel={() => {}}
                                        okText="Yes"
                                        cancelText="No"
                                        placement="right"
                                    >
                                                
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}
                                        />
                                    </Popconfirm>
                                  
                                </Tooltip>
                                &nbsp;

                                <LatexRenderer latex={"$$" + answerReduced + "$$"} />
                            </Space>
                            {Comment && 
                            <Space size="large" align="center">
                                <div>
                                    <small className="default-gray">
                                        Comment &nbsp; <i>in summary screen</i>
                                    </small>
                                    <p>{Comment}</p>
                                </div>
                                <Tooltip
                                    color="white"
                                    title={<p>Edit comment</p>}
                                >
                                    <EditOutlined 
                                        onClick={() => {
                                            setShowEditBCICComment(true)
                                            setSelectedBCIC(a)
                                            setIsBoundaryCondition(true)
                                        }}
                                    />
                                </Tooltip>
                            </Space>}
                            
                            <Divider/>
                        </Space>
                    )
                })}
            </div>
        )
    }

    const renderInitialConditions = () => {
        const {InitialConditionKeyboard, InitialConditionLines} = question

        return(
            <div>
                <Space size={'large'}>
                    {InitialConditionKeyboard && 
                    <Space>
                        <InsertRowAboveOutlined className="default-title"/>
                        <p> {InitialConditionKeyboard.Name} </p>
                    </Space>}
                    {InitialConditionKeyboard && 
                        <div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                        </div>
                    }
                    <Button
                        size="small"
                        onClick={() => {
                            setShowKeyboardBCIC(true)
                            setShowKeyboardBCIC_IsBC(false)
                        }}
                    >
                        {!InitialConditionKeyboard && <InsertRowAboveOutlined className="default-title"/>}
                        Update keyboard
                    </Button>

                    {InitialConditionKeyboard &&
                    <Button
                        size="small"
                        onClick={() => {
                            setShowAddConditions(true)
                            setShowAddConditions_IsBC(false)
                            setShowAddConditions_SelectedKeyboard(InitialConditionKeyboard)
                        }}
                    >
                        <PlusOutlined className="default-green"/>
                        Add answers
                    </Button>
                    }
                </Space>
                <br/>
                {InitialConditionLines.map((a, ai) => {
                    const {Id, Comment} = a

                    const answerReduced = a.AnswerElements
                    .sort((c,d) => c.Id > d.Id ? 1 : -1)
                    .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

                    
                    return(
                        <Space
                            key={Id}
                            direction="vertical"
                            align="start"
                        >
                            <Space>
                                <p className="default-gray">{ai+1}</p>

                                &nbsp;
                                <Tooltip 
                                    title={<p>Click to remove initial condition</p>}
                                    color="white"
                                >
                                    <Popconfirm
                                        title="Remove initial condition"
                                        description="Are you sure to delete this initial condition?"
                                        onConfirm={() => {
                                            const data = new FormData()

                                            data.append('Id', Id)

                                            removeEnergyBalanceIC(data).then(r => handleResponse(r, api, 'Removed', 1, () => {
                                                reloadQuestion()
                                            }))
                                        }}
                                        onCancel={() => {}}
                                        okText="Yes"
                                        cancelText="No"
                                        placement="right"
                                    >
                                                
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}
                                        />
                                    </Popconfirm>
                                </Tooltip>
                                &nbsp;

                                <LatexRenderer latex={"$$" + answerReduced + "$$"} />
                            </Space>
                            {Comment && 
                            <Space size="large" align="center">
                                <div>
                                    <small className="default-gray">
                                        Comment &nbsp; <i>in summary screen</i>
                                    </small>
                                    <p>{Comment}</p>
                                </div>
                                <Tooltip
                                    color="white"
                                    title={<p>Edit comment</p>}
                                >
                                    <EditOutlined 
                                        onClick={() => {
                                            setShowEditBCICComment(true)
                                            setSelectedBCIC(a)
                                            setIsBoundaryCondition(false)
                                        }}
                                    />
                                </Tooltip>
                            </Space>}
                            <Divider/>
                        </Space>
                    )
                })}
            </div>
        )
    }

    const renderContent = () => {
        const {QuestionText} = question
        const tabs = [
            {
                key:1,
                label:"Control volumes",
                children: <div>{renderControlVolumeList()}</div>
            },{
                key:2,
                label:"Energy balance terms",
                children: <div>{renderEnergyBalanceTerms()}</div>
            },{
                key:3,
                label:"Boundary conditions",
                children: <div>{renderBoundaryConditions()}</div>
            },{
                key:4,
                label:"Initial conditions",
                children: <div>{renderInitialConditions()}</div>
            }]

        return(
            <div>
                <Space
                direction="vertical"
                align="start" size={'large'}>
                    <Space>
                        <p className="default-gray">Question body</p>

                        <Tooltip
                            color="white"
                            title={<p>Edit question body</p>}
                        >
                            <EditOutlined 
                                onClick={() => {
                                    setShowEditGeneralLatex(true)
                                }}
                            />
                        </Tooltip>
                        </Space>
                        <LatexRenderer 
                            latex={QuestionText || ""}
                        />
                    </Space>    

                <br/>
                <br/>
                <br/>
                <Tabs
                    defaultActiveKey={1}
                    items={tabs}
                    onChange={(t) => setCurrentTab(t)}
                    activeKey={currentTab}
                />
            </div>
        )
    }

    return(
        <div>
            {contextHolder}
            <Row
                gutter={12}
            >
                <Col
                    ref = {imageRef}
                >
                    {renderQuestionImage()}
                </Col>

                <Col xs={1}/>
                <Col
                    xs ={12}
                >
                    {renderContent()}
                </Col>
            </Row>

            <UpdateControlVolumeImage
                open={showEditCVImage}
                onClose={() => setShowEditCVImage(false)}
                controlVolume={selectedCV}
                reloadQuestion = {() => reloadQuestion()}
            />

            <UpdateEBTermCodeLatex 
                open={showEditTermCodeLatex}
                onClose={() => setShowEditTermCodeLatex(false)}
                ebTerm={selectedEBTerm}
                reloadQuestion = {() => reloadQuestion()}
            />

            <UpdateEBTermLatexText 
                open={showEditTermLatexText}
                onClose={() => setShowEditTermLatexText(false)}
                ebTerm={selectedEBTerm}
                reloadQuestion = {() => reloadQuestion()}
            />

            <UpdateEBTermComment
                open={showEditTermComment}
                onClose={() => setShowEditTermComment(false)}
                ebTerm={selectedEBTerm}
                reloadQuestion = {() => reloadQuestion()}
            />

            <UpdateEBTermDirections 
                open={showEditTermDirections}
                onClose={() => setShowEditTermDirections(false)}
                ebTerm={selectedEBTerm}

                reloadQuestion = {() => reloadQuestion()}
            />

            <UpdateEBTermQuestionLatex 
                open={showEditTermQuestionLatex}
                onClose={() => setShowEditTermQuestionLatex(false)}
                ebTermQuestion={selectedEBTermQuestion}

                reloadQuestion = {() => reloadQuestion()}
            />

            <AddEbTermQuestion 
                open={showAddTermQuestion}
                onClose={() => setShowAddTermQuestion(false)}
                ebTerm={selectedEBTerm}

                reloadQuestion={() => reloadQuestion()}
            />

            <AddEbTerm 
                open={showAddTerm}
                onClose={() => setShowAddTerm(false)}

                question={question}
                reloadQuestion={() => reloadQuestion()}
            />

            <SetKeyboardBCIC 
                open={showSetKeyboardBCIC}
                onClose={() => setShowKeyboardBCIC(false)}
                IsBC={showSetKeyboardBCIC_IsBC}
                question={question}
                reloadQuestion={() => reloadQuestion()}
            />

            <AddBCICTerms 
                open={showAddConditions}
                onClose={() => setShowAddConditions(false)}
                IsBC={showAddConditions_IsBC}
                usedKeyboard={showAddConditions_SelectedKeyboard}

                question={question}
                reloadQuestion={() => reloadQuestion()}
            />

            <UpdateQuestionLatex 
                open={showEditGeneralLatex}
                onClose={() => setShowEditGeneralLatex(false)}

                question={question}
                reloadQuestion={() => reloadQuestion()}
            />

            <UpdateQuestionImage 
                open={showEditQuestionImage}
                onClose={() => setShowEditQuestionImage(false)}

                question={question}
                reloadQuestion={() => reloadQuestion()}
            />

            <AddControlVolume 
                open={showAddControlVolume}
                onClose={() => setShowAddControlVolume(false)} 

                question={question}
                reloadQuestion={() => reloadQuestion()}
            />

            <UpdateControlVolumeComment 
                open={showEditCVComment}
                onClose={() => setShowEditCVComment(false)}
                controlVolume={selectedCV}

                reloadQuestion = {() => reloadQuestion()}
            />

            <UpdateBCICComment 
                open={showEditBCICComment}
                onClose={() => setShowEditBCICComment(false)}
                condition={selectedBCIC}
                isBoundaryCondition={IsBoundaryCondition}

                reloadQuestion = {() => reloadQuestion()}
            />
        </div>
    )
}