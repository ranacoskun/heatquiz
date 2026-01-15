import { Button, Col, Divider, Dropdown, List, message, notification, Popconfirm, Row, Space, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { CONDITION_POSITION, CONDITION_SHAPE, RELATION_GRADIENT_NUM, RELATION_X_POSITION_NUM, RELATION_Y_POSITION_NUM } from "../Shared/Constants";
import { getNameForRelationNum } from "../Shared/Functions";
import { PlayPVDiagramQuestionInteractivePlot } from "../Shared/PlayPVDiagramQuestionInteractivePlot";
import { ControlOutlined, MessageOutlined, InsertRowAboveOutlined, PictureOutlined, PlusOutlined, EditOutlined  } from '@ant-design/icons';

import "./index.css"
import { UpdateGroupInfo } from "./UpdateGroupInfo";
import { UpdateConditionComment } from "./UpdateConditionComment";

export function PVDiagramQuestionEditView({reloadQuestion}){
    const {PVDiagramQuestionPlay: question} = useQuestions()

    const [api, contextHolder] = message.useMessage()
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const imageRef = React.createRef()

    const [highlightedPoint, setHighlightedPoint] = useState(null)
    const [highlightedRelation, setHighlightedRelation] = useState(null)

    const [showEditGroupInfo, setShowEditGroupInfo] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)

    const [showEditConditionComment, setShowEditConditionComment] = useState(false)
    const [selectedCondition, setSelectedCondition] = useState(null)

    const renderQuestionImage = () => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, Groups} = question

        return(
            <div>
                <PlayPVDiagramQuestionInteractivePlot 
                     style={{width:Base_ImageURL_Width, height:Base_ImageURL_Height}}

                     imageURL = {Base_ImageURL}

                     groups = {Groups.map(g => ({...g, points: g.Points.map(p => ({
                        ...p,
                        name: p.Name,
                        color: p.InnerColor,
                        borderColor: p.OuterColor,
        
                        x: p.X,
                        y: p.Y,
                        cx:p.CX,
                        cy: p.CY,
        
                        marginX: p.MarginX,
                        marginY: p.MarginY
                     }))}))}

                     selectedGroupIndex = {null}

                     onSelectedPointMove = {(pi) => {}}

                     onPointMove = {(p) => {}}

                     onSelectedCPPointMove = {(pi) => {}}

                     onCPPointMove = {(p) => {}}

                    selectedPointMoveIndex = {null}
                    selectedCPPointMoveIndex = {null}

                    highlightedPoint = {null}
                    highlightedRelation = {null}

                    showSolution = {true}
                />
            </div>
        )
    }

    const renderPlots = () => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, Groups} = question

        const smallWidth = 0.2 * window.innerWidth
        
        const resizeFactor = (smallWidth/Base_ImageURL_Width)
        const smallHeight = (Base_ImageURL_Height * resizeFactor)

        return(
            <div 
                className="hq-full-width"
            >
                <List
                    dataSource={Groups}
                    
                    renderItem = {(g, gi) => {
                        const {Code, LineColor, LineWidth, IsClosedLoop, IsPointsOnlyPlay, Points, Relations} = g

                        const pointsPositionsShapesConditions = Points.map((p, pi) => {
                            const {IsPoistionConsiderable, IsShapeConsiderable, CurveShape: correctShape, PositionComment, ShapeComment,} = p
                                        
                            let nextP = Points[pi + 1]
                            if(!nextP) nextP = Points[0]
                    
                            let result = ({
                                ...p,
                                checks: []
                            })
                    
                            //check position
                            if(IsPoistionConsiderable){                    
                                result.checks.push({
                                    type: CONDITION_POSITION,
                                    comment: PositionComment
                                })
                            }
                    
                            //check shape
                            if(IsShapeConsiderable){
                                const {Name: n1} = p
                                const {Name: n2} = nextP
                                                            
                                result.checks.push({
                                    type: CONDITION_SHAPE + " ( " + n1 + "-" + n2 + ": " + correctShape + " )",
                                    comment: ShapeComment
                                })
                            }
                    
                            return result
                        })

                        const xRelations = Relations.filter(r => r.Type === RELATION_X_POSITION_NUM)
                        const yRelations = Relations.filter(r => r.Type === RELATION_Y_POSITION_NUM)
                        const mRelations = Relations.filter(r => r.Type === RELATION_GRADIENT_NUM)

                        return(
                            <Space className="hq-full-width" direction="vertical">
                                <Space align="start" size="large">
                                    <p className="default-gray">{gi+1}</p>
                                    <p className="default-title">{Code}</p>

                                    <div>
                                        <PlayPVDiagramQuestionInteractivePlot 
                                            style={{width:smallWidth, height:smallHeight}}

                                            imageURL = {Base_ImageURL}

                                            groups = {[g].map(g => ({...g, points: g.Points.map(p => {
                                                return(
                                                    ({
                                                        ...p,
                                                        name: p.Name,
                                                        color: p.InnerColor,
                                                        borderColor: p.OuterColor,
                                        
                                                        x: p.X * (resizeFactor),
                                                        y: p.Y * (resizeFactor),
                                                        cx:p.CX * (resizeFactor),
                                                        cy: p.CY * (resizeFactor),

                                                        X: p.X * (resizeFactor),
                                                        Y: p.Y * (resizeFactor),
                                                        CX:p.CX * (resizeFactor),
                                                        CY: p.CY * (resizeFactor),
                                        
                                                        marginX: Math.ceil(p.MarginX * (resizeFactor)),
                                                        marginY: Math.ceil(p.MarginY * (resizeFactor)) 
                                                    })
                                                )
                                            })}))}

                                            selectedGroupIndex = {(selectedGroup && selectedGroup.Id === g.Id) ? 0 : null}

                                            onSelectedPointMove = {(pi) => {}}

                                            onPointMove = {(p) => {}}

                                            onSelectedCPPointMove = {(pi) => {}}

                                            onCPPointMove = {(p) => {}}

                                            selectedPointMoveIndex = {null}
                                            selectedCPPointMoveIndex = {null}

                                            highlightedPoint = {(selectedGroup && selectedGroup.Id === g.Id) ? highlightedPoint : null}
                                            highlightedRelation = {(selectedGroup && selectedGroup.Id === g.Id) ? highlightedRelation : null}

                                            showSolution = {true}
                                        />
                                        <br/>
                                        <Space
                                            align="start"
                                            size="large"
                                        >
                                            <div>
                                                <p className="default-gray">Line color</p>
                                                <div style={{height:2, width:'100%', backgroundColor: LineColor}}/>
                                            </div>
                                            <div>
                                                <p className="default-gray">Line width</p>
                                                <p className="default-title">{LineWidth}<span className="default-gray">{' '}px</span></p>
                                            </div>
                                            <div>
                                                <p className="default-gray">Points only</p>
                                                <p className="default-title">{IsPointsOnlyPlay ? "Yes" : "No"}</p>
                                            </div>
                                            <div>
                                                <p className="default-gray">Closed loop</p>
                                                <p className="default-title">{IsClosedLoop ? "Yes" : "No"}</p>
                                            </div>
                                        </Space>
                                        <br/>
                                        <br/>
                                        <p className="default-gray"><u>Conditions</u></p>
                                        {pointsPositionsShapesConditions.sort((a,b) => a.Id - b.Id).map((r, ri) => {
                                            const {Id, Name, checks} = r
                                            
                                            return(
                                                <div
                                                    key={Id}
                                                    className="edit-pv-d-q-condition-line"
                                                    onMouseEnter = {() => {
                                                        setHighlightedPoint(ri)
                                                        setSelectedGroup(g)
                                                    }}

                                                    onMouseLeave = {() => {
                                                        setHighlightedPoint(null)
                                                        setSelectedGroup(null)
                                                    }}
                                                >
                                                    <Space
                                                        align="start"
                                                        size="large"
                                                    >
                                                        <small
                                                            className="default-gray"
                                                        >
                                                            Point {' '}
                                                            <span
                                                                className="default-title"
                                                            >
                                                                {Name}
                                                            </span>
                                                        </small>
                                                        <Space direction="vertical" align="start" >
                                                        {checks.map((c, ci) => {
                                                                const {type, comment} = c  
                                                                                                    
                                                                return(
                                                                    <div 
                                                                    
                                                                    key={ci}>
                                                                        <Space size="large" align="center">
                                                                            <p className={"default-smallest default-gray"}>{type}</p>
                                                                            
                                                                            <Tooltip
                                                                                color="white"
                                                                                title={<p>Click to change comment</p>}
                                                                                
                                                                            >
                                                                                <Space 
                                                                                align="center" 
                                                                                className="hq-clickable"
                                                                                onClick={() => {
                                                                                    setShowEditConditionComment(true)
                                                                                    setSelectedCondition({
                                                                                        ...r,
                                                                                        Comment: (type === CONDITION_POSITION) ? r.PositionComment : r.ShapeComment,
                                                                                        IsPoint: true,
                                                                                        IsPositionComment: (type === CONDITION_POSITION)
                                                                                    })
                                                                                }}>
                                                                                    <MessageOutlined className="default-gray"/>
                                                                                    {comment && <small className="default-gray">{comment}</small>}
                                                                                </Space>
                                                                            </Tooltip>
                                                                        </Space>
                                                                    </div>
                                                                )
                                                            })}
                                                        </Space>
                                                    </Space>
                                                    
                                                </div>
                                            )
                                        })}
                                        <br/>
                                        {xRelations.map((r, ri) => {
                                            const {FirstPoint, SecondPoint, Value, Type, Comment: comment} = r

                                            const relationName = getNameForRelationNum(Type)


                                            const {Name: n1} = FirstPoint
                                            const {Name: n2} = SecondPoint

                                            return(
                                                <div
                                                    key={ri}
                                                    className="edit-pv-d-q-condition-line"

                                                    onMouseEnter = {() => {
                                                        setHighlightedRelation(r)
                                                        setSelectedGroup(g)
                                                    }}

                                                    onMouseLeave = {() => {
                                                        setHighlightedRelation(null)
                                                        setSelectedGroup(null)
                                                    }}
                                                >
                                                    <Space
                                                        align="center"
                                                        size="small"
                                                    >
                                                        <small className="default-gray default-smaller">{relationName}</small>

                                                        &nbsp;&nbsp;

                                                        <small className="default-gray">Point <span className="default-title">{n1}</span></small> 

                                                        <small className="default-title">{Value}</small>

                                                        <small className="default-gray">Point <span className="default-title">{n2}</span></small> 
                                                        &nbsp;&nbsp;
                                                        <Tooltip
                                                            color="white"
                                                            title={<p>Click to change comment</p>}
                                                        >
                                                            <Space 
                                                            align="center"
                                                            className="hq-clickable"
                                                            onClick={() => {
                                                                setShowEditConditionComment(true)
                                                                setSelectedCondition(r)
                                                            }}
                                                            >
                                                                <MessageOutlined className="default-gray"/>
                                                                {comment && <small className="default-gray">{comment}</small>}
                                                                </Space>
                                                        </Tooltip>
                                                    </Space>
                                                </div>
                                            )
                                        })}
                                        <br/>
                                        {yRelations.map((r, ri) => {
                                            const {FirstPoint, SecondPoint, Value, Type, Comment: comment} = r

                                            const relationName = getNameForRelationNum(Type)


                                            const {Name: n1} = FirstPoint
                                            const {Name: n2} = SecondPoint

                                            return(
                                                <div
                                                    key={ri}
                                                    className="edit-pv-d-q-condition-line"

                                                    onMouseEnter = {() => {
                                                        setHighlightedRelation(r)
                                                        setSelectedGroup(g)
                                                    }}

                                                    onMouseLeave = {() => {
                                                        setHighlightedRelation(null)
                                                        setSelectedGroup(null)
                                                    }}
                                                >
                                                    <Space
                                                        align="center"
                                                        size="small"
                                                    >
                                                        <small className="default-gray default-smaller">{relationName}</small>

                                                        &nbsp;&nbsp;

                                                        <small className="default-gray">Point <span className="default-title">{n1}</span></small> 

                                                        <small className="default-title">{Value}</small>

                                                        <small className="default-gray">Point <span className="default-title">{n2}</span></small> 
                                                        &nbsp;&nbsp;
                                                        <Tooltip
                                                            color="white"
                                                            title={<p>Click to change comment</p>}
                                                        >
                                                            <Space 
                                                            align="center"
                                                            className="hq-clickable"
                                                            onClick={() => {
                                                                setShowEditConditionComment(true)
                                                                setSelectedCondition(r)
                                                            }}
                                                            >
                                                                <MessageOutlined className="default-gray"/>
                                                                {comment && <small className="default-gray">{comment}</small>}
                                                                </Space>
                                                        </Tooltip>
                                                    </Space>
                                                </div>
                                            )
                                        })}
                                        <br/>
                                        {mRelations.map((r, ri) => {
                                            const {FirstPoint, SecondPoint, Value, Type, Comment: comment} = r

                                            const relationName = getNameForRelationNum(Type)


                                            const {Name: n1} = FirstPoint
                                            const {Name: n2} = SecondPoint

                                            return(
                                                <div
                                                    key={ri}
                                                    className="edit-pv-d-q-condition-line"

                                                    onMouseEnter = {() => {
                                                        setHighlightedRelation(r)
                                                        setSelectedGroup(g)
                                                    }}

                                                    onMouseLeave = {() => {
                                                        setHighlightedRelation(null)
                                                        setSelectedGroup(null)
                                                    }}
                                                >
                                                    <Space
                                                        align="center"
                                                        size="small"
                                                    >
                                                        <small className="default-gray default-smaller">{relationName}</small>

                                                        &nbsp;&nbsp;

                                                        <small className="default-gray">Point <span className="default-title">{n1}</span></small> 

                                                        <small className="default-title">{Value}</small>

                                                        <small className="default-gray">Point <span className="default-title">{n2}</span></small> 
                                                        &nbsp;&nbsp;
                                                        <Tooltip
                                                            color="white"
                                                            title={<p>Click to change comment</p>}
                                                        >
                                                            <Space 
                                                            align="center"
                                                            className="hq-clickable"
                                                            onClick={() => {
                                                                setShowEditConditionComment(true)
                                                                setSelectedCondition(r)
                                                            }}
                                                            >
                                                                <MessageOutlined className="default-gray"/>
                                                                {comment && <small className="default-gray">{comment}</small>}
                                                                </Space>
                                                        </Tooltip>
                                                    </Space>
                                                </div>
                                            )
                                        })}
                                    </div>
                                
                                    <Dropdown
                                        menu={{
                                            items:[ {
                                                key: 'update_group_info',
                                                label: 'Update group info',
                                                onClick: () => {   
                                                    setShowEditGroupInfo(true)
                                                    setSelectedGroup({...g, Base_ImageURL, Base_ImageURL_Width, Base_ImageURL_Height})                                                 
                                                }
                                            },
                                            {
                                                key: 'delete_group',
                                                label:
                                                <Popconfirm
                                                    title="Remove group"
                                                    description="Are you sure to delete this group?"
                                                            onConfirm={() => {
                                                              
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
                                
                                <Divider />
                            </Space>
                        )
                    }}
                />
            </div>
        )
    }

    return(
        <div>
            {contextHolder}
            {notificationContextHolder}
            <Row
                gutter={12}
            >
                <Col
                    ref = {imageRef}
                >
                    {renderQuestionImage()}
                </Col>

                <Col xs={1}/>  
                <Col xs={13}>
                {renderPlots()}
                </Col>
            </Row> 

            <UpdateGroupInfo 
                open = {showEditGroupInfo}
                onClose = {() => setShowEditGroupInfo(false)}

                reloadQuestion = {() => reloadQuestion()}

                group = {selectedGroup}
            />

            <UpdateConditionComment 
                open = {showEditConditionComment}
                onClose = {() => setShowEditConditionComment(false)}

                reloadQuestion = {() => reloadQuestion()}

                condition = {selectedCondition}
            />
        </div>
    )
}