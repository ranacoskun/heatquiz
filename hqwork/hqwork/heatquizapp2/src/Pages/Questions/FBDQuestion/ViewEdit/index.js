import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Button, Col, Divider, Dropdown, List, Popconfirm, Row, Space, Tabs, Tooltip, message } from "antd";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { FixURL, handleResponse } from "../../../../services/Auxillary";
import { ControlOutlined, InsertRowAboveOutlined, PictureOutlined, PlusOutlined, EditOutlined  } from '@ant-design/icons';
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";
import { UpdateVTCodeLatex } from "./UpdateVTCodeLatex";
import { UpdateVTLatexText } from "./UpdateVTLatexText";
import { UpdateVTAssociation } from "./UpdateVTAssociation";
import { UpdateVTAngle } from "./UpdateVTAngle";
import { UpdateVTColor } from "./UpdateVTColor";
import { UpdateOBColor } from "./UpdateOBColor";
import { calculateCPdimensions } from "./Functions";
import { EditQuestionLatex } from "./EditQuestionLatex";
import { EditQuestionArrowLength } from "./EditQuestionArrowLength";
import { AddVectorTerm } from "./AddVectorTerm";
import { UpdateQuestionImage } from "./UpdateQuestionImage";
import { AddBodyObject } from "./AddBodyObject";
import { MomentDirectionComponent } from "../Shared/MomentDirectionComponent";
import { UpdateOBComment } from "./UpdateOBComment";
import { UpdateVTComment } from "./UpdateVTComment";

export function FBDQuestionEditView({reloadQuestion}){

    const {FBDQuestionPlay: question,
        removeFBDQuestionOB,
        removeFBDQuestionVT
    } = useQuestions()


    const imageRef = React.createRef()
    const imageRef2 = React.createRef()

    const [showEditQuestionImage, setShowEditQuestionImage] = useState(false)
    const [showEditGeneralLatex, setShowEditGeneralLatex] = useState(false)

    const [showEditArrowLength, setShowEditArrowLength] = useState(false)

    const [showAddOB, setShowAddOB] = useState(false)

    const [offset, setOffset] = useState(0)
    const [leftOffset, setLeftOffset] = useState(0)

    const [api, contextHolder] = message.useMessage()
    const [currentTab, setCurrentTab] = useState(1)

    const [showEditTermCodeLatex, setShowEditTermCodeLatex] = useState(false)
    const [showEditTermLatexText, setShowEditTermLatexText] = useState(false)
    const [showEditTermComment, setShowEditTermComment] = useState(false)
    const [showEditTermAssociation, setShowEditTermAssociation] = useState(false)
    const [showEditTermColor, setShowEditTermColor] = useState(false)
    const [showEditTermAngle, setShowEditTermAngle] = useState(false)

    const [selectedVTTerm, setSelectedVTTerm] = useState(null)


    const [showEditOBColor, setShowEditOBColor] = useState(false)
    const [showEditOBComment, setShowEditOBComment] = useState(false)
    const [selectedOB, setSelectedOB] = useState(null)

    const [showAddVT, setShowAddVT] = useState(false)

    useEffect(() => {
        let _offset = 0

        if(imageRef){
            const div = imageRef.current
            
            _offset = parseInt(window.getComputedStyle(div).paddingRight.replace('px',''))

            setOffset(_offset)

        }
    }, [imageRef])

    const renderQuestionImage = () => {
        const {Code, Base_ImageURL, Base_ImageURL_Width, Base_ImageURL_Height, ObjectBodies, ArrowLength} = question
        
        const backgroundImageStyle = ({
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'contain',
            border:'1px solid rgb(245, 245, 245)',
            cursor:'crosshair'
        })


        return(
            <div>
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

             
                />
               {ObjectBodies.map((o, oi) => {
                const dimesions = calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL_Width, Base_ImageURL_Height, o )
                const {Id, Color} = o
                return(
                    <div
                    key={Id}
                    style={{...dimesions, position:'absolute', border:'1px solid #28a745' }}>
                        <div style={{width:'100%', height:'100%', backgroundColor:Color}}></div>
                    </div>    
                )
               })}
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
                <br/>
                <br/>
                <Space
                    align="center"
                >
                    <p className="default-gray">Arrow length</p>
                    <p className="default-title highlighted-silent">{ArrowLength} {' px'}</p>
                    <Tooltip
                            color="white"
                            title={<p>Edit arrow length</p>}
                        >
                            <EditOutlined 
                                onClick={() => {
                                    setShowEditArrowLength(true)
                                }}
                            />
                    </Tooltip>
                </Space>
               
                
            </div>
        )
    }

    const renderOBs = () => {
        const {ObjectBodies, Base_ImageURL_Height, Base_ImageURL_Width, Base_ImageURL} = question

        const smallImageWidth = window.innerWidth * 0.2
        const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth

        return(
            <div>
                <Tooltip
                    color="white"
                    title={<p>Add new object body</p>}
                >
                    <Button
                        size="small"
                        onClick={() => {
                            setShowAddOB(true)
                        }}

                        icon={<PlusOutlined style={{color:'green'}}/>}
                    >
                        Add
                    </Button>
                </Tooltip>

                <br/>
                <br/>
                <List 
                    dataSource={ObjectBodies}
                    renderItem={(o, oi) => {
                        const {Id, Color, Comment} = o

                        const dimesions =  calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, o)

                        return(
                            <div
                                className="hq-full-width"
                                key={Id}
                            >
                                <Space
                                    align="start"
                                >
                                    <p className="default-gray">{oi+1}</p>

                                    <div 
                                        style = {{
                                            height:smallImageHeight,
                                            width: smallImageWidth,
                                            backgroundImage: `url(${FixURL(Base_ImageURL)})`,
                                            backgroundPosition:'center',
                                            backgroundRepeat:'no-repeat',
                                            backgroundSize:'contain',
                                            border:'1px solid gainsboro'
                                        }}
                                    >
                                        <div style={{...dimesions, position:'relative', border:'1px solid #28a745' }}>
                                            <div style={{width:'100%', height:'100%', backgroundColor:Color,}}></div>
                                        </div>    
                                    </div>

                                    <Dropdown
                                        menu={{
                                            items:[
                                            {
                                                key: 'edit_color',
                                                label: 'Update color',
                                                onClick: () => {
                                                    setShowEditOBColor(true)
                                                    setSelectedOB(o)
                                                }
                                            },
                                            {
                                                key: 'edit_comment',
                                                label: 'Update comment',
                                                onClick: () => {
                                                    setShowEditOBComment(true)
                                                    setSelectedOB({...o, dimesions, smallImageWidth, smallImageHeight, Base_ImageURL})
                                                }
                                            },
                                            {
                                                key: 'delete_ob',
                                                label: 
                                                <Popconfirm
                                                title="Remove Object Body"
                                                description="Are you sure to delete this object?"
                                                        onConfirm={() => {
                                                            let data = new FormData()
                                                            data.append('Id', o.Id)
                                                            removeFBDQuestionOB(data)
                                                            .then(r => handleResponse(r, api, 'Removed', 1, () => reloadQuestion()))
                                                        }}
                                                onCancel={() => {}}
                                                okText="Yes"
                                                cancelText="No"
                                                placement="right"
                                            >
                                            
                                                Delete
                                            </Popconfirm>,
                                            }],
                                            title:'Actions'
                                        }}
                                    >
                                        <ControlOutlined className="default-gray hoverable"/>
                                    </Dropdown>
                                </Space>
                                {Comment &&
                                <div>
                                    <small className="default-gray">Comment  &nbsp; <i>in summary screen</i></small>   
                                    <p>{Comment}</p>
                                </div>}
                                <Divider/>
                            </div>
                        )
                    }}
                />
            </div>
        )
    }

    const renderVTs = () => {
        const {ObjectBodies, Base_ImageURL_Height, Base_ImageURL_Width, Base_ImageURL} = question

        const VTs = ObjectBodies.map(a => a.VectorTerms).flat()

        const smallImageWidth = window.innerWidth * 0.10
        const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth
        return(
            <div>
                <Tooltip
                    color="white"
                    title={<p>Add new vector term</p>}
                >
                    <Button
                        size="small"
                        onClick={() => {
                            setShowAddVT(true)
                        }}

                        icon={<PlusOutlined style={{color:'green'}}/>}
                    >
                        Add
                    </Button>
                </Tooltip>
                <br/>
                <br/>
                <List 
                    dataSource={VTs}

                    renderItem={(vt, vti) => {

                        const {Id, Code, ArrowColor, Latex, LatexText, Keyboard, Answers, Linear, Angle, Clockwise, BodyObjectId, Comment} = vt

                        const OB = ObjectBodies.filter(a => a.Id === BodyObjectId)[0]

                        const dimesions =  calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, OB)

                        return(
                            <div
                                key={Id}
                                className="hq-full-width hq-element-container"    
                            >
                                <Space
                                    className="hq-full-width hq-opposite-arrangement"
                                    align="start"
                                >
                                    <Space size={"large"} align="start">
                                        <p>{vti+1}</p>
                                        <div>
                                            <p className="default-title">{Code}</p>
                                            <LatexRenderer latex={"$$" + Latex + "$$"} />
                                        </div>
                                        &nbsp;
                                        &nbsp;
                                        {Linear ? 
                                        <VectorDirectionComponent 
                                            angleStep={5}
                                            currentAngle={Angle}
                                            widthHeight={0.03*window.innerWidth}
                                            onUpdateAngle={(a) => {}}
                                            noUpdate={true}
                                        /> :
                                        <MomentDirectionComponent
                                            clockwise={Clockwise}
                                            onFlip={() => {}}
                                        />}
                                        &nbsp;
                                        &nbsp;
                                        <div 
                                            style = {{
                                                height:smallImageHeight,
                                                width: smallImageWidth,
                                                backgroundImage: `url(${FixURL(Base_ImageURL)})`,
                                                backgroundPosition:'center',
                                                backgroundRepeat:'no-repeat',
                                                backgroundSize:'contain',
                                                border:'1px solid gainsboro'
                                            }}
                                        >
                                            <div style={{...dimesions, position:'relative', border:'1px solid #28a745' }}>
                                                <div style={{width:'100%', height:'100%', backgroundColor:OB.Color,}}></div>
                                            </div>    
                                        </div>
                                        &nbsp;
                                        &nbsp; 
                                        &nbsp;
                                        &nbsp;
                                    <div>
                                        <p className="default-gray">Arrow color</p>
                                        <div style={{width: '100%', height: 4, backgroundColor: ArrowColor}}/>
                                    </div>

                                    </Space>
                                    <Dropdown
                                        menu={{
                                            items:[{
                                                key: 'edit_latex',
                                                label: 'Update Code/LaTeX',
                                                onClick: () => {
                                                    setShowEditTermCodeLatex(true)
                                                    setSelectedVTTerm(vt)
                                                }
                                            },
                                            {
                                                key: 'edit_latex_text',
                                                label: 'Update LaTeX text',
                                                onClick: () => {
                                                    setShowEditTermLatexText(true)
                                                    setSelectedVTTerm(vt)
                                                }
                                            },
                                            {
                                                key: 'edit_comment',
                                                label: 'Update comment',
                                                onClick: () => {
                                                    setShowEditTermComment(true)
                                                    setSelectedVTTerm(vt)
                                                }
                                            },
                                            {
                                                key: 'edit_association',
                                                label: 'Update association',
                                                onClick: () => {
                                                    setShowEditTermAssociation(true)
                                                    setSelectedVTTerm(vt)
                                                }
                                            },{
                                                key: 'edit_color',
                                                label: 'Update arrow color',
                                                onClick: () => {
                                                    setShowEditTermColor(true)
                                                    setSelectedVTTerm(vt)
                                                }
                                            },{
                                                key: 'edit_angle',
                                                label: Linear ? 'Update angle' : 'Flip direction',
                                                onClick: () => {
                                                    if(Linear){
                                                        setShowEditTermAngle(true)
                                                        setSelectedVTTerm(vt)
                                                        
                                                        return
                                                    }

                                                }
                                            },
                                            {
                                                key: 'delete',
                                                label: 
                                                <Popconfirm
                                                title="Remove Vector Term"
                                                description="Are you sure to delete this term?"
                                                        onConfirm={() => {
                                                            let data = new FormData()
                                                            data.append('Id', vt.Id)
                                                            removeFBDQuestionVT(data)
                                                            .then(r => handleResponse(r, api, 'Removed', 1, () => reloadQuestion()))
                                                        }}
                                                onCancel={() => {}}
                                                okText="Yes"
                                                cancelText="No"
                                                placement="right"
                                            >
                                            
                                                Delete
                                            </Popconfirm>
                                            }],
                                                        title:'Actions'
                                        }}
                                        >
                                            <ControlOutlined className="default-gray hoverable"/>
                                        </Dropdown>
                                </Space>
                                
                                <Divider/>

                                <small className="default-gray">
                                    Comment &nbsp; <i>in summary screen</i>
                                </small>
                                <p>{Comment}</p>

                                <Divider />

                                <small className="default-gray">
                                    Optional text
                                </small>                                
                                <LatexRenderer latex={LatexText || ""} />

                                {Keyboard &&
                                <div>
                                    <Divider />
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
                                </div>}
                            </div>
                        )
                    }}
                />
            </div>
        )
    }

    const renderContent = () => {
        const {QuestionText} = question

        const tabs = [
            {
                key:1,
                label:"Object bodies",
                children: <div>{renderOBs()}</div>
            },{
                key:2,
                label:"Vector terms",
                children: <div>{renderVTs()}</div>
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
                className="hq-full-width"
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

            <UpdateVTCodeLatex 
                open={showEditTermCodeLatex}
                onClose={() => setShowEditTermCodeLatex(false)}
                vtTerm={selectedVTTerm}

                reloadQuestion={() => reloadQuestion()}
            />

            <UpdateVTLatexText 
                open={showEditTermLatexText}
                onClose={() => setShowEditTermLatexText(false)}
                vtTerm={selectedVTTerm}

                reloadQuestion={() => reloadQuestion()}
            />

            <UpdateVTAssociation 
                open={showEditTermAssociation}
                onClose={() => setShowEditTermAssociation(false)}
                vtTerm={selectedVTTerm}
                question={question}
                
                reloadQuestion={() => reloadQuestion()}
            />

            <UpdateVTColor
                open={showEditTermColor}
                onClose={() => setShowEditTermColor(false)}
                vtTerm={selectedVTTerm}

                reloadQuestion={() => reloadQuestion()}
            />

            
            <UpdateVTAngle
                open={showEditTermAngle}
                onClose={() => setShowEditTermAngle(false)}
                vtTerm={selectedVTTerm}

                reloadQuestion={() => reloadQuestion()}
            />

            <UpdateOBColor 
                open={showEditOBColor}
                onClose={() => setShowEditOBColor(false)}
                OB={selectedOB}
                question={question}

                reloadQuestion={() => reloadQuestion()}
            />

            <EditQuestionLatex 
                open={showEditGeneralLatex}
                onClose={() => setShowEditGeneralLatex(false)}
                question={question}
                reloadQuestion = {() => reloadQuestion()}
            />

            <EditQuestionArrowLength 
                open={showEditArrowLength}
                onClose={() => setShowEditArrowLength(false)}
                question={question}
                reloadQuestion = {() => reloadQuestion()}
            />

            <AddVectorTerm 
                open={showAddVT}
                onClose={() => setShowAddVT(false)}

                question={question}
                reloadQuestion = {() => reloadQuestion()}
            />

            <UpdateQuestionImage 
                open={showEditQuestionImage}
                onClose={() => setShowEditQuestionImage(false)}

                question={question}
                reloadQuestion = {() => reloadQuestion()}
            />

            <AddBodyObject 
                open={showAddOB}
                onClose={() => setShowAddOB(false)}

                question={question}
                reloadQuestion = {() => reloadQuestion()}
            />

            <UpdateOBComment 
                open={showEditOBComment}
                onClose={() => setShowEditOBComment(false)}

                OB={selectedOB}
                reloadQuestion = {() => reloadQuestion()}
            />

            <UpdateVTComment 
                open={showEditTermComment}
                onClose={() => setShowEditTermComment(false)}

                VT={selectedVTTerm}

                reloadQuestion = {() => reloadQuestion()}
            />
        </div>
    )
}