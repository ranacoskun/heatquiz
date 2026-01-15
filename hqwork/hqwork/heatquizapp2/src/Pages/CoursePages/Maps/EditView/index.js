import React, {  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PagesWrapper } from "../../../../PagesWrapper";
import { useMaps } from "../../../../contexts/MapsContext";
import { useEffect } from "react";
import { Alert, Button, Col, Collapse, Divider, Dropdown, Input, List, Modal, Popconfirm, Row, Skeleton, Space, Spin, Tabs, Tooltip, message } from "antd";
import { FixURL, beautifyDate, beautifyNumber, handleResponse } from "../../../../services/Auxillary";
import { FilePdfOutlined, LinkOutlined, PictureOutlined, PlusOutlined, AimOutlined, PrinterOutlined, SelectOutlined, TrophyOutlined, EyeOutlined, ClockCircleOutlined, DashboardOutlined, CaretRightOutlined, EditOutlined, BlockOutlined, NodeExpandOutlined , DeleteOutlined, NodeIndexOutlined} from '@ant-design/icons';

import './index.css'
import { useState } from "react";
import { SeriesPlayPocket } from "../../../Series/Play/SeriesPlayPocket";
import { SelectSeries } from "../Add/SelectSeries";
import { AssignPDFToElement } from "./AssignPDFToElement";
import { AssignRelationshipToElement } from "./AssignRelationToElement";
import { SelectBackgroundImage } from "../../../../Components/SelectBackgroundImage";
import { SelectClickImagesList } from "../../../../Components/SelectClickImagesList";
import { EditBadgeImage } from "./EditBadgeImage";
import { EditMapBasicInfo } from "./EditMapBasicInfo";
import { AddBadgeSystem } from "./AddBadgeSystem";
import { AddBadgeSystemEntity } from "./AddBadgeSystemEntity";
import { AssignBadgesToElement } from "./AssignBadgesToElement";
import { AttachMapToElement } from "./AttachMapToElement";
import { AssignClickImagesListGroup } from "./AssignClickImagesListGroup";
import { ReassignMap } from "./ReassignMap";

import { MapPDFModal } from "../../Shared/MapPDFModal";
import { EditMapImage } from "./EditMapImage";

export function MapEditView(){

    const {id} = useParams()

    const navigate = useNavigate()

    const {
        loadingMapExtended, mapExtended, getMapExtended,
        
        mapElementStatistics, getMapElementStatistics,

        loadingAssignSeriesToMapElement, assignSeriesToMapElement,

        loadingRemoveSeriesFromMapElement, removeSeriesFromMapElement,

        loadingRemovePDFToMapElement, removePDFToMapElement,

        loadingRemoveRelationToMapElement, removeRelationToMapElement,

        loadingClearRelationsOfMapElement, clearRelationsOfMapElement,

        loadingAssignClickListToMapElement, assignClickListToMapElement,

        loadingDeassignClickListToMapElement, deassignClickListToMapElement,

        loadingEditMapElementBasicInfo, editMapElementBasicInfo,

        loadingRemoveMapElementBadge, removeMapElementBadge,

        loadingEditMapElementBadgeProgress, editMapElementBadgeProgress,

        loadingEditBadgeSystemEntity, editBadgeSystemEntity,

        loadingRemoveMapBadgeEntity, removeMapBadgeEntity,

        loadingEditMapBadgeSystem,  editMapBadgeSystem,

        removeBadgeSystem,

        deleteMapElement,

        loadingDeattachMapToElement, deattachMapToElement
    } = useMaps()

    const [showEditMapModal, setShowEditMapModal] = useState(false)
    const [showAddBadgeSystemModal, setShowAddBadgeSystemModal] = useState(false)
    const [showReassignMapModal, setShowReassignMapModal] = useState(false)
    const [showEditMapImage, setShowEditMapImage] = useState(false)

    const [showPlaySeriesModal, setShowPlaySeriesModal] = useState(false)
    const [selectedSeries, setSelectedSeries] = useState({Code:''})

    const [elementRefs, setElementRefs] = useState([])
    const [hoveredElement, setHoveredElement] = useState(null)

    const [showSelectSeries, setShowSelectSeries] = useState(false)
    const [showAssignPDF, setShowAssignPDF] = useState(false)
    const [showAssignRelationship, setShowAssignRelationship] = useState(false)
    const [showAssignBackgroundImage, setShowAssignBackgroundImage] = useState(false)
    const [showAssignClickImagesList, setShowAssignClickImagesList] = useState(false)
    const [showAssignMapAttachment, setShowAssignMapAttachment] = useState(false)

    const [showAssignClickImagesListGroup, setShowAssignClickImagesListGroup] = useState(false)

    const [selectedElement, setSelectedElement] = useState(null)

    const [selectedBadge, setSelectedBadge] = useState(null)
    const [showEditElementBadgePercentage, setShowEditElementBadgePercentage] = useState(false)
    const [newPercentage, setNewPercentage] = useState(1)
    const [showEditBadgeImage, setShowEditBadgeImage] = useState(false)
    const [nonElementBadge, setNonElementBadge] = useState(false)

    const [newLink, setNewLink] = useState(null)
    const [showEditLink, setShowEditLink] = useState(false)

    const [newTitle, setNewTitle] = useState(null)
    const [showEditTitle, setShowEditTitle] = useState(false)
    const [editBadgeSystem, setEditBadgeSystem] = useState(false)

    const [selectedBadgeSystem, setSelectedBadgeSystem] = useState(null)
    const [showAddBadgeEntity, setShowAddBadgeEntity] = useState(false)
    const [showAssignBadgesElement, setShowAssignBadgesElement] = useState(false)

    const [showExportMap, setShowExportMap] = useState(false)

    const [api, contextHolder] = message.useMessage()

    const loadData = () => {
        getMapExtended(id)
        getMapElementStatistics(id)
    }

    useEffect(() => {
        loadData()
    }, [id])

    useEffect(() => {
        if(mapExtended){
            const refs = mapExtended.Elements.map((e) => React.createRef())
            setElementRefs(refs)
        }
    }, [mapExtended])


    const renderMapHeader = () => {
        const {Id, Title, Course, DateCreated, ShowSolutions, Disabled, ShowBorder} = mapExtended

        const {Name} = Course
        return(
            <div>
                <Space
                    align="start"
                    className="hq-opposite-arrangement"
                >
                    <div>
                        <Dropdown
                            menu={{
                                items:[{
                                    key:'edit_map',
                                    label:'Edit basic info',
                                    icon: <EditOutlined/> ,
                                    onClick: () => {
                                        setShowEditMapModal(true)
                                    }
                                },
                                {
                                    key:'edit_map_image',
                                    label:'Update map image',
                                    icon: <PictureOutlined style={{color:'green'}}/> ,
                                    onClick: () => setShowEditMapImage(true)
                                },
                                {
                                    key:'copy_map',
                                    label:'Copy map',
                                    icon: <BlockOutlined  /> ,
                                    onClick: () => {}
                                },
                                {
                                    key:'reassign_map',
                                    label:'Assign map to another course',
                                    icon: <NodeExpandOutlined /> ,
                                    onClick: () => {
                                        setShowReassignMapModal(true)
                                    }
                                },
                                {
                                    key:'play_map',
                                    label:'Play map',
                                    icon: <TrophyOutlined style={{color:'green'}}/> ,
                                    onClick: () => navigate('/playcoursemap/'+Id)
                                },
                                {
                                    key:'add_badge_system',
                                    label:'Add badge system',
                                    icon: <PlusOutlined style={{color:'green'}}/> ,
                                    onClick: () => setShowAddBadgeSystemModal(true)
                                },
                                {
                                    key:'add_element',
                                    label:'Add new element',
                                    icon: <PlusOutlined style={{color:'green'}}/> ,
                                    onClick: () => {}
                                },
                                {
                                    key:'assign_click_list_elements',
                                    label:'Assign map pop-up icons to elements',
                                    icon: <AimOutlined/> ,
                                    onClick: () => setShowAssignClickImagesListGroup(true)
                                },
                                {
                                    key:'export_map_as_pdf',
                                    label:'Export map as pdf',
                                    icon: <PrinterOutlined /> ,
                                    onClick: () => setShowExportMap(true)
                                }],
                                title:"Actions"
                            }}
                        >
                            <p className="default-title default-large hoverable">{Title}</p>
                        </Dropdown>
                        <p className="default-gray">{Name}</p>
                        <p className="default-gray">{beautifyDate(DateCreated)}</p>
                    </div>
 
                    <div className="hq-info-card hq-vertical-arrangement" direction="vertical">
                        <small className={ShowSolutions ? "default-green" : "default-red"}>
                            {ShowSolutions ? "Solutions shown" : "Solutions hidden"}
                        </small>

                        {Disabled && 
                        <small className="default-red">
                            Map is disabled
                        </small>}
                       
                        <small className="default-gray">
                            {ShowBorder ? "Borders shown" : "Borders hidden"}
                        </small>
                    </div>
                </Space>

                <Divider />
                <br/>
            </div>
        )
    }

    const getElementPositionStyle = (imageWidth, BackgroundImageWidth, p) => ({
        width: ((imageWidth)/BackgroundImageWidth)* p.Width,
        height: ((imageWidth)/BackgroundImageWidth)*p.Length ,
        left: ((imageWidth)/BackgroundImageWidth)*p.X,
        top:  ((imageWidth)/BackgroundImageWidth)*p.Y,
    })

    const editLinkModal = () => {
        
        return(
            <Modal 
                open={showEditLink}
                footer={null}
                onCancel={() => setShowEditLink(false)}
            >
                <small className="default-gray">Link</small>
                <Input 
                    placeholder="External link"
                    type="text"
                    onChange={(v) => setNewLink(v.target.value.trim())}
                    value={newLink}
                />
                <br/>
                <br/>

                <Button 
                    size="small"
                    type="primary"
                    onClick={() => {
                        const VM = ({
                            Id: selectedElement.Id,
                            Title: selectedElement.Title,
                            ExternalVideoLink: newLink
                        })

                        editMapElementBasicInfo(VM)
                        .then((r) => 
                        handleResponse(
                            r,
                            api,
                            'Update successful',
                            1,
                            () => {
                                loadData()
                                setShowEditLink(false)
                            }))

                            
                    }}
                    loading={loadingEditMapElementBasicInfo}
                >   
                    Update
                </Button>
                <br/>
                <br/>

                <small className="default-gray"><i>Link can be removed by updating with an empty text</i></small>
            </Modal>
        )
    }

    const editTitleModal = () => {
        
        return(
            <Modal 
                open={showEditTitle}
                footer={null}
                onCancel={() => setShowEditTitle(false)}
            >
                <small className="default-gray">Title</small>
                <Input 
                    placeholder="Element title"
                    type="text"
                    onChange={(v) => setNewTitle(v.target.value)}
                    value={newTitle}
                />
                <br/>
                <br/>

                <Button 
                    size="small"
                    type="primary"
                    onClick={() => {
                        if(!newTitle.trim()){
                            api.destroy()
                            api.warning("Title cannot be empty")

                            return
                        }

                        if(editBadgeSystem){
                            const data = new FormData()

                            data.append("Id", selectedElement.Id)
                            data.append("Title", newTitle) 

                            editMapBadgeSystem(data)
                            .then((r) => 
                            handleResponse(
                                r,
                                api,
                                'Update successful',
                                1,
                                () => {
                                    loadData()
                                    setShowEditTitle(false)
                                }))

                                
                        }
                        else{
                            const VM = ({
                                Id: selectedElement.Id,
                                Title: newTitle,
                                ExternalVideoLink: selectedElement.ExternalVideoLink
                            })
    
                            editMapElementBasicInfo(VM)
                            .then((r) => 
                            handleResponse(
                                r,
                                api,
                                'Update successful',
                                1,
                                () => {
                                    loadData()
                                    setShowEditTitle(false)
                                }))

                                
                        }

                        
                    }}
                    loading={(loadingEditMapElementBasicInfo || loadingEditMapBadgeSystem)}
                >   
                    Update
                </Button>
              
            </Modal>
        )
    }

    const editElementBadgePercentage = () => {
        if(!selectedBadge) return <div/>;

        const {Progress, URL} = selectedBadge
        return(
            <Modal 
                open={showEditElementBadgePercentage}
                footer={null}
                onCancel={() => setShowEditElementBadgePercentage(false)}
            >
                <small className="default-gray">Progress (%)</small>
                <Input 
                    placeholder="Badge progress"
                    type="number"
                    min={1}
                    max={100}
                    onChange={(v) => {
                        const value = Number(v.target.value)

                        if(value < 1) return;
                        if(value > 100) return;

                        setNewPercentage(value)
                    }}
                    value={newPercentage}
                />
                <br/>
                <br/>

                <Space
                    size={'large'}
                    align="start"
                    className="hq-opposite-arrangement"
                >
                    <Button 
                        size="small"
                        type="primary"
                        onClick={() => {

                            if(nonElementBadge){

                                const data = new FormData()
                                data.append('BadgeEntityId', selectedBadge.Id)
                                data.append('Progress', newPercentage)

                                editBadgeSystemEntity(data)
                                .then(r => handleResponse(
                                    r,
                                    api,
                                    'Update successful',
                                    1,
                                    () => {
                                        loadData()
                                        setShowEditElementBadgePercentage(false)
                                    }))

                                
                            }
                            else{

                                const VM = ({
                                    ...selectedBadge,
                                    Progress: newPercentage
                                })
    
                                editMapElementBadgeProgress(VM)
                                .then(r => handleResponse(
                                    r,
                                    api,
                                    'Update successful',
                                    1,
                                    () => {
                                        loadData()
                                        setShowEditElementBadgePercentage(false)
                                    }))

                                
                            }

                            
                        }}
                        loading={(loadingEditMapElementBadgeProgress || loadingEditBadgeSystemEntity)}
                    >   
                        Update
                    </Button>

                    <Space direction="vertical" align="center"> 
                        <img 
                            src={URL}
                            alt={"Badge " + Progress}
                            className="map-badge-small-img"
                        />
                        <small className="default-gray">{Progress}%</small>
                    </Space>
                </Space>
              
            </Modal>
        )
    }

    const renderElements = (Elements) => {
        return(
            <div
                className="map-edit-view-basic-list"
            >
                <List 
                dataSource={Elements}
                renderItem={(e, ei) => {
                    const {Title, PDFURL, ExternalVideoLink, QuestionSeries, MapAttachment, Badges, CourseMapElementImages, RequiredElement, Relations, Threshold, Background_Image} = e
                    
                    const isHovered = hoveredElement === e.Id

                    let pdfStats = null
                    let seriesStats = null

                    if(mapElementStatistics){
                        const {Elements: elementStats} = mapElementStatistics

                        const elementStat = elementStats.filter(a => a.Id === e.Id)[0]

                        const {PDFStatisticsCount, PDFStatisticsCountOnMobile} = elementStat

                        pdfStats = ({
                            total: PDFStatisticsCount,
                            totalMobile: PDFStatisticsCountOnMobile,
                            mobilePerc: PDFStatisticsCount ? (100*(PDFStatisticsCountOnMobile/PDFStatisticsCount)).toFixed(0)+'%' : '-'
                        })

                        const {SeriesPlayCount, SeriesPlayCountOnMobile, SeriesPlayMedianTime} = elementStat

                        seriesStats = ({
                            total: SeriesPlayCount,
                            totalMobile: SeriesPlayCountOnMobile,
                            medianPlayTime: SeriesPlayMedianTime,
                            mobilePerc: SeriesPlayCount ? (100*(SeriesPlayCountOnMobile/SeriesPlayCount)).toFixed(0)+'%' : '-'

                        })
                    }

                    const isSeriesChanged = selectedElement && (loadingRemoveSeriesFromMapElement || loadingAssignSeriesToMapElement) && selectedElement.Id === e.Id
                    const isPDFChanged = selectedElement && (loadingRemovePDFToMapElement) && selectedElement.Id === e.Id
                    const isClickListChanged = selectedElement && (loadingAssignClickListToMapElement || loadingDeassignClickListToMapElement) && selectedElement.Id === e.Id
                    const isAttachmentChanged = selectedElement && (loadingDeattachMapToElement) && selectedElement.Id === e.Id
                    

                    return(
                        <div 
                        ref={elementRefs[ei]}
                        className={"hq-element-container" + (isHovered ? " hq-element-higlighted" : "")}>
                            <Space>
                                <p>{ei+1}</p>
                                <Dropdown
                                    menu={{
                                        items:[{
                                            key:'update_title',
                                            label:'Update title',
                                            icon:<EditOutlined />,
                                            onClick: () => {
                                                setSelectedElement(e)
                                                setNewTitle(Title)
                                                setShowEditTitle(true)
                                                setEditBadgeSystem(false)
                                            }
                                        },
                                        {
                                            key:'redraw_element',
                                            label:'Redraw Element',
                                            icon:<EditOutlined />,
                                            onClick: () => {
                                                
                                            }
                                        },
                                        {
                                            key:'remove_element',
                                            label:
                                            <Popconfirm
                                                title="Remove element"
                                                description="Are you sure to delete this element?"
                                                    onConfirm={() => {

                                                        deleteMapElement(e)
                                                            .then((r) => 
                                                            handleResponse(
                                                                r,
                                                                api,
                                                                'Removed',
                                                                1,
                                                                () => loadData()))

                                                            
                                                            
                                                        }}
                                                        onCancel={() => {}}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        placement="right"
                                                    >
                                                        Remove element  
                                                </Popconfirm>,
                                            icon:<DeleteOutlined />,
                                            onClick: () => {
                                                
                                            }
                                        }
                                        ],
                                        title:'Actions'
                                    }}
                                >
                                    <p className="hoverable">{Title}</p>
                                </Dropdown>

                            </Space>
                            <br/>
                            <br/>

                            <Row gutter={[6, 6]}>
                                <Col>
                                {PDFURL ? 
                                (isPDFChanged ? 
                                <Spin/> :
                                <Dropdown
                                    menu={{
                                        items:[{
                                            key:'remove_pdf',
                                            label:'Remove PDF',
                                            icon: <DeleteOutlined />,
                                            onClick: () => {
                                                const data = new FormData()
                                                data.append("ElementId", e.Id)

                                                removePDFToMapElement(data)
                                                .then(
                                                    (r) => handleResponse(
                                                        r,
                                                        api,
                                                        'Removed',
                                                        1,
                                                        () =>  loadData()))
                                            }
                                        },
                                        {
                                            key:'add_pdf',
                                            label:'Assign new PDF',
                                            icon: <PlusOutlined />,
                                            onClick: () => {
                                                setSelectedElement(e)
                                                setShowAssignPDF(true)
                                            }
                                        }],
                                        title:'Actions'
                                    }}
                                >
                                <Space
                                title={PDFURL}
                                onClick={() => window.open(PDFURL)}
                                className="please-select-area">
                                    <FilePdfOutlined 
                                    title={PDFURL}
                                    alt={ExternalVideoLink}
                                    className="default-red default-large"/>

                                    <Tooltip
                                        placement="top"
                                        color="white"
                                        title={
                                        pdfStats ?
                                        <div>
                                            <Space>
                                                <p>Total views</p>
                                                <p>{beautifyNumber(pdfStats.total)}</p>
                                            </Space>

                                            <Space>
                                                <p>Total views on mobile</p>
                                                <p>{beautifyNumber(pdfStats.totalMobile)}</p>
                                                <p>({pdfStats.mobilePerc})</p>
                                            </Space>
                                        </div> : <p>No views</p>}
                                    >
                                        <Space>
                                            <EyeOutlined className="default-gray default-smaller"/>
                                            {pdfStats && <small className="default-gray">{beautifyNumber(pdfStats.total)}</small>}

                                        </Space>
                                    </Tooltip>
                                </Space>
                                </Dropdown>)
                                :
                                <div 
                                title="Add pdf file"
                                onClick={() => {
                                    setSelectedElement(e)
                                    setShowAssignPDF(true)
                                }}
                                className="please-select-area please-select-area-special">
                                    <PlusOutlined className="default-gray default-smaller"/>
                                    <FilePdfOutlined style={{color:'gray', fontSize:'large'}}/>
                                </div>}
                                </Col>

                                <Col>
                                {ExternalVideoLink ?
                                    <Dropdown
                                        menu={{
                                            items:[{
                                                key:'update_remove_link',
                                                label:'Update/Remove link',
                                                icon:<EditOutlined />,
                                                onClick: () => {
                                                    setSelectedElement(e)
                                                    setNewLink(ExternalVideoLink)
                                                    setShowEditLink(true)
                                                }
                                            }],
                                            title:'Actions'
                                        }}
                                    >
                                        <div 
                                        title={ExternalVideoLink}
                                        onClick={() => window.open(ExternalVideoLink)}
                                        className="please-select-area">
                                            <LinkOutlined 
                                            title={ExternalVideoLink}
                                            alt={ExternalVideoLink}
                                            className="default-blue default-large" />
                                        </div>
                                    </Dropdown>    
                                    : 
                                    <div 
                                    title="Add link"
                                    onClick={() => {
                                        setSelectedElement(e)
                                        setNewLink("")
                                        setShowEditLink(true)
                                    }}
                                    className="please-select-area please-select-area-special">
                                        <PlusOutlined className="default-gray default-smaller"/>
                                        <LinkOutlined style={{color:'gray', fontSize:'large'}}/>
                                    </div>}
                                    </Col>

                                <Col>
                                {QuestionSeries ? 
                                (isSeriesChanged ?
                                <Spin />
                                :<Dropdown
                                    menu={{
                                        items:[{
                                            key:'play',
                                            label:'Play',
                                            icon: <TrophyOutlined style={{color:'green'}}/> ,
                                            onClick: () => {
                                                setShowPlaySeriesModal(true)
                                                setSelectedSeries(QuestionSeries)
                                            }
                                        },{
                                            key:'assign_new_series',
                                            label:'Assign new series',
                                            icon: <EditOutlined/>,
                                            onClick: () => {
                                                setShowSelectSeries(true)
                                                setSelectedElement(e)
                                            }
                                        },{
                                            key:'remove_series',
                                            label:'Remove series',
                                            icon: <DeleteOutlined />,
                                            onClick: () => {
                                                setSelectedElement(e)

                                                const VM = ({
                                                    Id: e.Id
                                                })

                                                removeSeriesFromMapElement(VM)
                                                .then(
                                                    (r) => handleResponse(
                                                        r,
                                                        api,
                                                        'Series removed successfuly',
                                                        1,
                                                        () => loadData()))

                                                
                                            }
                                        },
                                        {
                                            key:'edit_view',
                                            label:'Edit / view series',
                                            icon: <EditOutlined/>,
                                            onClick: () => navigate('/series_edit_view/'+QuestionSeries.Code)
                                        }],
                                        title:'Actions'
                                    }}
                                >
                                    <Space className="please-select-area hq-opposite-arrangement"
                                    onClick={() => {
                                        setShowPlaySeriesModal(true)
                                        setSelectedSeries(QuestionSeries)
                                    }}
                                >
                                    <p className="default-gray">{QuestionSeries.Code}</p>

                                    {seriesStats && 
                                    <Space size={'middle'}>
                                    
                                    <Tooltip
                                        title={
                                            <div>
                                                <p>Median play time (seconds)</p>
                                                <br/>
                                                <Alert
                                                    message={<small>These are general statistics and <u>not</u> specific to this map element</small>}
                                                />
                                            </div>
                                        }
                                        color="white"
                                        placement="top"
                                    >
                                        <Space>
                                            <ClockCircleOutlined className="default-gray default-small"/>
                                            <p className="default-gray default-smaller">{seriesStats.medianPlayTime}s</p>
                                        </Space>
                                    </Tooltip>

                                    <Tooltip
                                        title={
                                            <div>
                                                <Space>
                                                    <p>Total play</p>
                                                    <p>{beautifyNumber(seriesStats.total)}</p>
                                                </Space>
                                                <Space>
                                                    <p>Total play on mobile</p>
                                                    <p>{beautifyNumber(seriesStats.totalMobile)}</p>
                                                    <p>({seriesStats.mobilePerc})</p>
                                                </Space>
                                                <br/>
                                                <br/>
                                                <Alert
                                                    message={<small>These are general statistics and <u>not</u> specific to this map element</small>}
                                                />
                                            </div>}
                                        color="white"
                                        placement="top"
                                    >
                                        <Space>
                                            <DashboardOutlined className="default-gray default-small"/>
                                            <p className="default-gray default-smaller">{beautifyNumber(seriesStats.total)}</p>
                                        </Space>
                                    </Tooltip>
                                    </Space>}
                                </Space>
                                </Dropdown>)
                                :
                                (isSeriesChanged ?
                                <Spin />
                                :
                                <div 
                                title="Add series"
                                onClick = {() => {
                                    setShowSelectSeries(true)
                                    setSelectedElement(e)
                                }}
                                
                                className="please-select-area please-select-area-special">
                                    <PlusOutlined className="default-gray default-smaller"/>
                                    <TrophyOutlined  style={{color:'gray', fontSize:'large'}}/>
                                </div>)}
                                </Col>
                                <Col>
                                {MapAttachment ?
                                (isAttachmentChanged ?
                                <Spin/>:
                                <Dropdown
                                    menu={{
                                        title:'Actions',
                                        items:[{
                                            key:'update_link',
                                            label:'Update map attachment',
                                            icon: <EditOutlined />,
                                            onClick: () => {
                                                setShowAssignMapAttachment(true)
                                                setSelectedElement(e)
                                            }
                                        },
                                        {
                                            key:'delete_link',
                                            label:'Remove attachment',
                                            icon: <DeleteOutlined />,
                                            onClick: () => {
                                                setSelectedElement(e)

                                                const data = new FormData()

                                                data.append('ElementId', e.Id)

                                                deattachMapToElement(data)
                                                .then(
                                                    r => 
                                                    handleResponse(
                                                        r,
                                                        api,
                                                        'Removed',
                                                        1,
                                                        () => loadData())
                                                )
                                            }
                                        },
                                        {
                                            key:'edit_view_map',
                                            label:'Edit / view map',
                                            icon: <EditOutlined/>,
                                            onClick: () => navigate('/edit_view_map/'+MapAttachment.Map.Id)
                                        }]
                                    }}
                                >
                                    <Space 
                                        title="Map link"
                                        className="please-select-area"
                                        
                                    >
                                    <SelectOutlined className="default-gray"/>
                                    <p className="default-gray">{MapAttachment.Map.Title}</p>
                                </Space>
                                </Dropdown>)
                                :
                                <div 

                                onClick={() => {
                                    setShowAssignMapAttachment(true)
                                    setSelectedElement(e)
                                }}

                                title="Attach map link"
                                className="please-select-area please-select-area-special">
                                    <PlusOutlined className="default-gray default-smaller"/>
                                    <SelectOutlined style={{color:'gray', fontSize:'large'}}/>
                                </div>}
                                </Col>
                            </Row>
                            
                            
                            <br/>
                            <br/>
                            <div>
                                <Collapse 
                                bordered={false}
                                ghost 
                                expandIcon={({ isActive }) => <CaretRightOutlined style={{color:'gray'}} rotate={isActive ? 90 : 0} />}
                                defaultActiveKey={[]} onChange={(v) => {}}>
                                    <Collapse.Panel header={<small className="default-gray">Relations ({Relations.length})</small>} key="0">
                                        <Space>
                                            <div 
                                                onClick={() => {
                                                    setShowAssignRelationship(true)
                                                    setSelectedElement(e)
                                                }}

                                                title="(Re)Assign required element relationship(s)"
                                                className="please-select-area please-select-area-special"
                                            >
                                                <PlusOutlined className="default-gray default-smaller"/>
                                                <NodeIndexOutlined style={{color:'gray', fontSize:'large'}}/>
                                            </div>
                                            {Relations.length && 
                                            <div>
                                                {loadingClearRelationsOfMapElement && selectedElement && selectedElement.Id === e.Id ? 
                                                <Spin/>
                                                :
                                                <div 
                                                    onClick={() => {
                                                        setSelectedElement(e)
                                                        
                                                        const data = new FormData()

                                                        data.append("BaseElementId", e.Id)

                                                        clearRelationsOfMapElement(data).then(r => handleResponse(r, api, 'Removed', () => {
                                                            loadData()
                                                        }))
                                                    }}

                                                    title="Delete all relationships"
                                                    className="please-select-area please-select-area-special-delete"
                                                >
                                                    <DeleteOutlined className="default-gray default-large"/>
                                                </div>}
                                            </div>}
                                        </Space>
                                        <br/>
                                        <br/>
                                        {Relations.map((r, ri) => {
                                            const {Id, Threshold, RequiredElementId} = r
                                            const RequiredElement = Elements.filter(a => a.Id === RequiredElementId)[0]
                                            
                                            const {Title} = RequiredElement
                        
                                            return(
                                            <div 
                                                key={Id}
                                                className="hq-full-width"
                                            >
                                                
                                                <Space
                                                    className="hoverable"
                                                >
                                                        <p className="default-gray">{ri+1}</p>
                                                        <p className="default-title">{Title}</p>
                                                        <p className="default-gray">@{Threshold}%</p>
                                                </Space>
                                                <br/>
                                                <br/>
                                            </div>
                                            )
                                        })}
                                    </Collapse.Panel>
                                    <Collapse.Panel header={<small className="default-gray">Badges</small>} key="1">
                                        {Badges.length ? 
                                        
                                        <Row
                                            gutter={12}
                                        >
                                            {Badges.sort((a,b) => a.Progress > b.Progress ? +1 : -1).map((b) => {
                                                const {Id, URL, Progress} = b
                                                return(
                                                   <Tooltip
                                                    key={Id}
                                                    color="white"
                                                    placement="top"
                                                    title={
                                                        <Space direction="vertical">
                                                        <Popconfirm
                                                        title="Remove badge"
                                                        description="Are you sure to delete this badge?"
                                                        onConfirm={() => {
                                                            removeMapElementBadge(b).then((r) => 
                                                            handleResponse(
                                                                r,
                                                                api,
                                                                'Removed',
                                                                1,
                                                                () => loadData()))

                                                            
                                                            
                                                        }}
                                                        onCancel={() => {}}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        placement="right"
                                                    >
                                                        <Button
                                                            size="small"
                                                            className="map-element-btn"
                                                            loading = {loadingRemoveMapElementBadge}
                                                        >
                                                                Remove
                                                        </Button>
                                                    </Popconfirm>
                                                            
                                                           
                                                            <Button
                                                                size="small"
                                                                className="map-element-btn"
                                                                onClick={() => {
                                                                    setSelectedBadge(b)
                                                                    setNewPercentage(Progress)
                                                                    setShowEditElementBadgePercentage(true)
                                                                    setNonElementBadge(false)

                                                                }}
                                                            >
                                                                Change percentage
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                className="map-element-btn"
                                                                onClick={() => {
                                                                    setShowEditBadgeImage(true)
                                                                    setSelectedBadge(b)
                                                                    setNonElementBadge(false)
                                                                }}
                                                            >
                                                                Change image
                                                            </Button>
                                                        </Space>
                                                    }
                                                   >
                                                     <Col 
                                                        
                                                        xs={2}>
                                                            <div
                                                                className="map-element-inside-img hoverable"
                                                                
                                                            >
                                                                <img 
                                                                    alt="badge"
                                                                    src={URL}
                                                                />
                                                                <small className="default-gray default-smaller">{Progress}%</small>
                                                            </div>
                                                        </Col>
                                                   </Tooltip>
                                                )
                                            })}
                                        </Row>
                                    
                                        : <small className="default-gray"> no badges added </small>}
                                    </Collapse.Panel>
                                    <Collapse.Panel header={<small className="default-gray">Pop-up icons list</small>} key="2">
                                        {CourseMapElementImages ? 
                                        (isClickListChanged ? 
                                        <Spin/>:
                                        <Dropdown
                                            menu={{
                                                items:[{
                                                    key:'assign_new_list',
                                                    label:'Assign new list',
                                                    icon: <EditOutlined/>,
                                                    onClick: () => {
                                                        setShowAssignClickImagesList(true)
                                                        setSelectedElement(e)
                                                    }
                                                },{
                                                    key:'remove_list',
                                                    label:'Remove list',
                                                    icon: <DeleteOutlined />,
                                                    onClick: () => {
                                                        setSelectedElement(e)
                                                        
                                                        const data = new FormData()
                                                        data.append('ElementId', e.Id)

                                                        deassignClickListToMapElement(data)
                                                        .then((r) => handleResponse(
                                                            r,
                                                            api,
                                                            'Removed',
                                                            1,
                                                            () => loadData()))
                                                    }
                                                }]
                                            }}
                                        >
                                            <Space className="hoverable" direction="vertical">
                                            <p className="default-gray">{CourseMapElementImages.Code} </p>
                                            <Row
                                                gutter={12}
                                            >
                                            
                                                {CourseMapElementImages.Play &&
                                                <Col
                                                className="map-element-inside-img"
                                                xs={2}>
                                                    <img 
                                                        alt="Play"
                                                        src={CourseMapElementImages.Play}
                                                    />
                                                </Col>}
                                                {CourseMapElementImages.PDF &&
                                                <Col 
                                                className="map-element-inside-img"
                                                xs={2}>
                                                    <img 
                                                        alt="PDF"
                                                        src={CourseMapElementImages.PDF}
                                                    />
                                                </Col>}
                                                {CourseMapElementImages.Link &&
                                                <Col
                                                className="map-element-inside-img"
                                                xs={2}>
                                                    <img 
                                                        alt="Link"
                                                        src={CourseMapElementImages.Link}
                                                    />
                                                </Col>}
                                                
                                            </Row>
                                        </Space>
                                        </Dropdown>)
                                        : 
                                        (isClickListChanged ? 
                                        <Spin/>
                                        :
                                        <div 

                                            onClick={() => {
                                                setShowAssignClickImagesList(true)
                                                setSelectedElement(e)
                                            }}

                                            title="Assign click images list"
                                            className="please-select-area">
                                                <small> select a list </small>
                                        </div>)}
                                    </Collapse.Panel>
                                    <Collapse.Panel header={<small className="default-gray">Background image</small>} key="3">
                                        {Background_Image ? <small className="default-gray"> no image selected </small> : <p></p>}
                                    </Collapse.Panel>
                                </Collapse>
                            </div>                                                        
                        </div>
                    )
                }}
            />
            </div>
        )
    }

    const renderBadgeSystems = () => {
        const {BadgeSystems} = mapExtended

        return(
            <List 
                dataSource={BadgeSystems}
                renderItem={(s, si) => {
                    
                    const {Id, Title, Entities} = s

                    return(
                        <div
                        key={Id}
                        className="hq-element-container">
                            <Space>
                                <p>{si+1}</p>
                                <Dropdown
                                    menu={{
                                        items:[{
                                            key:'update_title',
                                            label:'Update title',
                                            icon:<EditOutlined />,
                                            onClick: () => {
                                                setSelectedElement(s)
                                                setNewTitle(Title)
                                                setShowEditTitle(true)
                                                setEditBadgeSystem(true)
                                            }
                                        },{
                                            key:'add_badge',
                                            label:'Add badge',
                                            icon:<PlusOutlined style={{color:'green'}} />,
                                            onClick: () => {
                                                setSelectedBadgeSystem(s)
                                                setShowAddBadgeEntity(true)
                                            }
                                        },{
                                            key:'assign_badge',
                                            label:'Assign badges to element',
                                            icon:<AimOutlined  style={{color:'green'}} />,
                                            onClick: () => {
                                                setSelectedBadgeSystem(s)
                                                setShowAssignBadgesElement(true)
                                                
                                            }
                                        },{
                                            key:'remove_system',
                                            label:
                                            <Popconfirm
                                                title="Remove badge system"
                                                description="Are you sure to delete this system?"
                                                        onConfirm={() => {
                                                            const data = new FormData()
                                                            data.append('Id', s.Id)

                                                            removeBadgeSystem(data)
                                                            .then(r => handleResponse(
                                                                r,
                                                                api,
                                                                'Removed',
                                                                1,
                                                                () => loadData()))
                                                        }}
                                                onCancel={() => {}}
                                                okText="Yes"
                                                cancelText="No"
                                                placement="right"
                                            >
                                                Remove badge system
                                            </Popconfirm>
                                            ,
                                            icon:<DeleteOutlined />,
                                            onClick: () => {}
                                        },],
                                        title:'Actions'
                                    }}
                                >
                                    <p className="hoverable">{Title}</p>
                                </Dropdown>

                            </Space>
                            <br/>
                            <br/>
                            
                            <Row gutter={12}>
                            {Entities.sort((a, b) => a.Progress - b.Progress).map((e) => {
                                const {Id, Progress, URL} = e
                                return(
                                    <Tooltip
                                        key={Id}
                                        color="white"
                                        placement="top"
                                        title={
                                            <Space direction="vertical">
                                                <Popconfirm
                                                    title="Remove badge"
                                                    description="Are you sure to delete this badge?"
                                                        onConfirm={() => {
                                                            const data = new FormData()
                                                            data.append('Id', e.Id)

                                                            removeMapBadgeEntity(data).then((r) => 
                                                            handleResponse(
                                                                r,
                                                                api,
                                                                'Removed',
                                                                1,
                                                                () => loadData()))
                                                            
                                                        }}
                                                        onCancel={() => {}}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        placement="right"
                                                    >
                                                        <Button
                                                            size="small"
                                                            className="map-element-btn"
                                                            loading = {loadingRemoveMapBadgeEntity}
                                                        >
                                                                Remove
                                                        </Button>
                                                    </Popconfirm>
                                                        
                                                    <Button
                                                        size="small"
                                                        className="map-element-btn"
                                                        onClick={() => {
                                                                    setSelectedBadge(e)
                                                                    setNewPercentage(Progress)
                                                                    setShowEditElementBadgePercentage(true)
                                                                    setNonElementBadge(true)
                                                                }}
                                                    >
                                                        Change percentage
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        className="map-element-btn"
                                                        onClick={() => {
                                                            setShowEditBadgeImage(true)
                                                            setSelectedBadge(e)
                                                            setNonElementBadge(false)
                                                            setNonElementBadge(true)

                                                        }}
                                                    >
                                                                Change image
                                                    </Button>
                                                </Space>
                                                    }
                                                   >
                                    <Col
                                       
                                        className="hoverable"
                                    >
                                        <Space direction="vertical" align="center">
                                            <img 
                                                src={URL}
                                                alt={"Badge " + Progress}
                                                className="map-badge-small-img"
                                            />
                                            <p className="default-gray">{Progress}%</p>
                                        </Space>
                                    </Col>
                                </Tooltip>)
                            })}
                            </Row>
                            

                        </div>
                    )

                }}

            />
        )
    }

    const renderMapBody = () => {
        const {LargeMapURL, LargeMapWidth, LargeMapLength, Title, Elements} = mapExtended

          const items = [
            {
              key: '1',
              label: 'Elements',
              children:renderElements(Elements),
            },
            {
              key: '2',
              label: 'Badge systems',
              children: renderBadgeSystems() ,
            },
            {
              key: '3',
              label: '',
              children: '',
            },
          ];

        const elementStyle = (e) => ({
            alignItems:'center',
            justifyContent:'center',
            display:'flex',
            flexDirection:'column',
            cursor:'pointer',
            position: 'absolute',

            [e.BackgroundImage ? "backgroundImage" : ""]:  "url(" + FixURL(e.BackgroundImage) + ")",

            border:1, 
            borderColor: 'red',
            borderStyle: 'solid',
            backgroundColor:'rgba(245, 245, 245, 0.60)'
        })

        return(
            <Row>
                <Col>
                    <img 
                        alt={Title}
                        style={{width:LargeMapWidth, height:LargeMapLength, cursor:'crosshair'}}
                        src={LargeMapURL}
                    />
                    {Elements.map((e, ei) => {
                        const positionStyle = getElementPositionStyle(LargeMapWidth, LargeMapWidth, e)
                        return(
                            <span
                                key={e.Id}
                                style={{
                                    ...positionStyle,
                                    ...elementStyle(e)
                                }}

                                onClick={() => {
                                    const ref = elementRefs[ei]

                                    ref.current.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start',
                                    })
                                }}

                                onMouseEnter={() => setHoveredElement(e.Id)}
                                onMouseLeave={() => setHoveredElement(null)}

                            >
                                
                            </span>)

                    })}
                </Col>
                <Col xs={1}/>
                <Col xs={10}>
                    <Tabs defaultActiveKey="1" items={items} />
                </Col>
            </Row>
        )
    }

    return(
        <PagesWrapper>
            {contextHolder}

            {loadingMapExtended && <Skeleton />}

            {(!loadingMapExtended && mapExtended) && 
            <div>
                {renderMapHeader()}
                {renderMapBody()}
            </div>}

            <EditMapBasicInfo 
                open={showEditMapModal}
                onClose={() => setShowEditMapModal(false)}
                map={mapExtended}
                reloadMap = {() => loadData()}
            />

            <EditMapImage 
                open={showEditMapImage}
                onClose={() => setShowEditMapImage(false)}
                map={mapExtended}
                reloadMap = {() => loadData()}
            />

            <AddBadgeSystem 
                open={showAddBadgeSystemModal}
                onClose={() => setShowAddBadgeSystemModal(false)}
                map={mapExtended}
                reloadMap = {() => loadData()}
            />

            <SeriesPlayPocket 
                open={showPlaySeriesModal}
                onClose={() => setShowPlaySeriesModal(false)}
                Code={selectedSeries.Code}
            />

            <SelectSeries 
                open={showSelectSeries}
                onClose={() => setShowSelectSeries(false)}

                onSelect={(s) => {
                    setShowSelectSeries(false)

                    const VM = ({
                        Id: selectedElement.Id,
                        QuestionSeriesId: s.Id
                    })

                    assignSeriesToMapElement(VM)
                    .then(
                        (r) => handleResponse(
                            r,
                            api,
                            'Series assigned successfuly',
                            1,
                            () => loadData()))

                    

                }}
            />

            <AssignPDFToElement 
                open={showAssignPDF}
                onClose={() => setShowAssignPDF(false)}
                element={selectedElement}
                reloadMap={() => loadData()}
            />


            <AssignRelationshipToElement 
                open={showAssignRelationship}
                onClose={() => setShowAssignRelationship(false)}
                element={selectedElement}
                reloadMap={() => loadData()}
                elements={mapExtended && mapExtended.Elements}
            />

            <SelectBackgroundImage 
                open={showAssignBackgroundImage}
                onClose={() => setShowAssignBackgroundImage(false)}

                onSelect={(i) => {
                    
                }}
            />

            <SelectClickImagesList 
                open={showAssignClickImagesList}
                onClose={() => setShowAssignClickImagesList(false)}

                onSelect={(l) => {
                    setShowAssignClickImagesList(false)

                    const data = new FormData()
                    data.append("ElementIds", selectedElement.Id)
                    data.append("ListId", l.Id)

                    assignClickListToMapElement(data)
                    .then(
                        (r) => handleResponse(
                            r,
                            api,
                            'List assigned successfuly',
                            1,
                            () => loadData()))

                    
                }}
            />

            <AssignClickImagesListGroup 
                open={showAssignClickImagesListGroup}
                onClose={() => setShowAssignClickImagesListGroup(false)}
                map = {mapExtended}
                reloadMap={() => loadData()}
            />

            <EditBadgeImage 
                open={showEditBadgeImage}
                onClose={() => setShowEditBadgeImage(false)}
                reloadMap={() => loadData()}
                badge={selectedBadge}
                nonElementBadge={nonElementBadge}
                
            />

            <AddBadgeSystemEntity 
                open={showAddBadgeEntity}
                onClose={() => setShowAddBadgeEntity(false)}
                reloadMap={() => loadData()}
                system={selectedBadgeSystem}

            />

            <AssignBadgesToElement 
                open={showAssignBadgesElement}
                onClose={() => setShowAssignBadgesElement(false)}
                map={mapExtended}
                reloadMap={() => loadData()}
                system={selectedBadgeSystem}

            />

            <AttachMapToElement 
                open={showAssignMapAttachment}
                onClose={() => setShowAssignMapAttachment(false)}
                element={selectedElement}
                reloadMap={() => loadData()}
                
            />

            <ReassignMap 
                open={showReassignMapModal}
                onClose={() => setShowReassignMapModal(false)}

                map={mapExtended}
                reloadMap={() => loadData()}
            />

            <MapPDFModal
                open={showExportMap}
                onClose={() => setShowExportMap(false)}

                map={mapExtended}
            />

            {editTitleModal()}
            {editLinkModal()}
            {editElementBadgePercentage()}
        </PagesWrapper>
    )

}