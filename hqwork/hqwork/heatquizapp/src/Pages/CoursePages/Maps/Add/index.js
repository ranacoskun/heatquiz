import React from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, Divider, Empty, Form, Input, List, Row, Select, Space, Spin, Steps, Tooltip, message } from "antd";
import { useCourses } from "../../../../contexts/CoursesContext";
import { useEffect } from "react";
import {ScheduleTwoTone, BuildTwoTone , SmileTwoTone, PictureTwoTone, CheckCircleFilled, CloseCircleTwoTone, PlusOutlined, CloseCircleFilled, TrophyFilled, AppstoreFilled} from '@ant-design/icons';
import { useState } from "react";
import { MAX_MAP_NAME } from "../EditView/Constants";

import './index.css'
import { UploadImage } from "../../../../Components/UploadImage";
import { SelectSeries } from "./SelectSeries";
import { SelectBackgroundImage } from "../../../../Components/SelectBackgroundImage";
import { useMaps } from "../../../../contexts/MapsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function AddMap(){

    const imageRef = React.createRef()

    const {loadingCourses, courses, getCourses} = useCourses()

    const {loadingAddMap, addMap} = useMaps()

    const [api, contextHolder] = message.useMessage()
    const [currentTab, setCurrentTab] = useState(0)

    const [name, setName] = useState('')
    const [selectedCourse, setSelectedCourse] = useState(null)

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const [newImageWidth, setNewImageWidth] = useState(0)
    const [newImageHeight, setNewImageHeight] = useState(0)

    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)

    const [newParts, setNewParts] = useState([])

    const [showSelectBackgroundImage, setShowSelectBackgroundImage] = useState(false)
    const [showSelectSeries, setShowSelectSeries] = useState(false)
    const [selectedElement, setSelectedElement] = useState(null)


    const [hoverElement, setHoverElement] = useState(null) 

    useEffect(() => {
        getCourses()
    }, [])

    const onChange = (value) => setCurrentTab(value);

    const validateMetadata = () => {
        if(!name.trim())
            return "Please add a name"

        if(!selectedCourse)
            return "Please select a course"
    }

    const validateAddImage = () => {
        if(!newImage)
            return "Please add an image"
    
        return null
    }

    const validateAddElements = () => {
        if(!newParts.length)
            return "Please add elements"

        if(newParts.filter(p => !p.title.trim()).length)
            return "Please add title to all elements"

        return null
    }

    const metadataValidation = validateMetadata()
    const selectImageValidation = validateAddImage()
    const addElementsValidation = validateAddElements()

    const canAdd = !metadataValidation && !selectImageValidation && !addElementsValidation

    const renderMetaData = () => {
        return(
            <Space>
                <Form>
                    <Form.Item>
                        <p>Name</p>
                        <Input 
                            className="map-meta-data-input"
                            placeholder="Unique map name"
                            value={name}
                            onChange={(v) => setName(v.target.value)}
                            maxLength={MAX_MAP_NAME}
                            showCount
                        />

                    </Form.Item>
                    <Form.Item>
                        <p>Course</p>
                        {loadingCourses ?
                        <Spin/>
                        :
                        <div className="map-meta-data-input">
                            <Select
                            
                                onChange={(v, option) => {
                                    const findCourse = courses.filter(c => c.Id === option.value)[0]

                                    setSelectedCourse(findCourse)
                                }}
                                defaultValue={'please select'}
                                value={(selectedCourse || {'Name': 'please select'}).Name}

                                options={(courses || []).map((d) => ({
                                    value: d.Id,
                                    label: d.Name
                                }))}
                            />
                            {selectedCourse && 
                            <img
                                className="map-meta-course-img"
                                alt={selectedCourse.Code}
                                src={selectedCourse.URL}
                            />}
                        </div>}
                        
                    </Form.Item>
                    
                </Form>
            </Space>
        )
    } 

    const renderAddImage = () => {
        return(
            <div>
                <UploadImage 
                    onSetImage={(url, img) => {
                        setNewImageURL(url)
                        setNewImage(img)

                    }}

                    imageURL={newImageURL}

                    className="map-add-image-container"
                    classNameImage="map-add-image-inside"
                />
            </div>
        )
    }

    const removeElement = (i) => {
        let parts = [...newParts]

        parts = parts.filter((p, pi) => i !== pi) 

        setNewParts(parts)
    }

    const renderAddElements = () => {
        if(!newImage) return (
            <Space>
                <p className="default-red">Please add an image</p>
            </Space>
        )

        const imageWidth = 0.5*window.innerWidth
        const imageHeight = ((newImageHeight*imageWidth)/newImageWidth)

        return(
            <Row gutter={24}>
                <Col>
                    <div>

                    <img 
                        alt="new-map"
                        style={{width:imageWidth, height:imageHeight, cursor:'crosshair'}}
                        src={newImageURL}

                        ref={imageRef}
s
                        onClick={(e) => {
                            if(!isAddingElement) return;

                            e.persist()

                            const {pageX, pageY} = e

                            const imgRef = imageRef.current
                            const parentNode = imgRef.parentNode.parentNode
                            const styles = window.getComputedStyle(parentNode)
                            const offset = Number(styles.getPropertyValue('padding-right').replace('px', ''))
                            
                            const {top, left} = imgRef.getBoundingClientRect()

                            
                            if(!isAddingElementSecond){

                                let newPart = ({
                                    title:'',
                                    x: pageX - left + offset,
                                    offsetX:offset,
                                    y: pageY - top,
                                    width: 1,
                                    height: 1
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
                                className="map-add-element"

                                onMouseEnter={() => setHoverElement(pi)}
                                onMouseLeave={() => setHoverElement(null)}
                            >
                                {backgroundImage && <img 
                                    alt="background"
                                    src={backgroundImage.URL}
                                    style={{width: width, height: height}}
                                />}
                            </div>
                        )
                    })}
                    
                    </div>
                </Col>
                <Col>
                    <Button
                        icon={<PlusOutlined style={{color:'green'}}/>}
                        size="small"
                        onClick={() => setIsAddingElement(true)}
                    >
                        Add element
                    </Button>

                    <br/>
                    {newParts.length ? 
                    <List
                        dataSource={newParts}
                        renderItem={(p, pi) => {
                        
                        const {title, externalLink, backgroundImage, series, width, height} = p

                        const hoveredOver = (pi === hoverElement)

                        return(
                            <div
                                key={pi}
                                className={"add-map-element-container " + (hoveredOver ? "map-add-image-container-hover" : "")}
                            >
                                <Space
                                    size={'small'}
                                    align="center"
                                >
                                    
                                    <p className="default-gray">{pi+1}</p>
                                    <Input 
                                        placeholder="Element title"
                                        className="add-map-element-title-input"
                                        value={title}
                                        onChange={(v) => {
                                                const value = v.target.value

                                                let parts = [...newParts]

                                                parts[pi].title = value

                                                setNewParts(parts)
                                            }}
                                    />
                                    <Tooltip
                                        color="white"
                                        placement="top"
                                        title={<p>Delete element</p>}
                                    >
                                        <CloseCircleFilled 
                                            onClick={() => removeElement(pi)}
                                            style={{color:'red', cursor:'pointer'}}
                                        />
                                    </Tooltip>
                                </Space>

                                <Space
                                    className="add-map-element-margin"
                                >
                                    
                                    <p className="default-white">{pi+1}</p>
                                    <Input 
                                        placeholder="External link"
                                        className="add-map-element-title-input"
                                        value={externalLink}
                                        onChange={(v) => {
                                                const value = v.target.value

                                                let parts = [...newParts]

                                                parts[pi].externalLink = value

                                                setNewParts(parts)
                                            }}
                                    />
                                </Space>

                                <Space
                                    className="add-map-element-margin"
                                >
                                    <p className="default-white">{pi+1}</p>
                                    <div 
                                        className="please-select-area" 
                                        onClick={() => {
                                            setSelectedElement(pi)
                                            setShowSelectSeries(true)
                                        }}
                                    >
                                        {!series ? 
                                        <Space>
                                            <TrophyFilled />
                                            <small>Click to select a series</small>
                                        </Space> : 
                                        <Space>
                                            <TrophyFilled />
                                            <p> {series.Code} </p>
                                        </Space>}
                                    </div>
                                </Space> 
                                
                                <Space
                                    className="add-map-element-margin"
                                >
                                    <p className="default-white">{pi+1}</p>
                                    <div 
                                        className="please-select-area" 
                                        onClick={() => {
                                            setSelectedElement(pi)
                                            setShowSelectBackgroundImage(true)
                                        }}
                                    >
                                        {!backgroundImage ? 
                                        <Space>
                                            <AppstoreFilled />
                                            <small>Click to select a background image</small>
                                        </Space> : 
                                        <Space size={'large'}>
                                            <img 
                                                alt="background"
                                                src={backgroundImage.URL}
                                                style={{width: 20*(width/height), height: 20}}
                                            />
                                            <p>-</p>
                                            <img 
                                                alt="background"
                                                src={backgroundImage.URL}
                                                className="add-map-element-background-img"
                                            />
                                        </Space>}
                                    </div> 
                                </Space>

                                <Divider/>
                            </div>)
                        }}
                    />
                    :
                    <Space>
                        <Empty 
                            description="No elements added"
                        />
                    </Space>}
                </Col>
            </Row>
        )

    }

    const addMapClick = () => {
        const data = new FormData()

        const imageWidth = 0.5*window.innerWidth
        const imageHeight = ((newImageHeight*imageWidth)/newImageWidth)

        data.append('Title', name)
        data.append('CourseId', selectedCourse.Id)
        data.append('Picture', newImage)
                                   
        data.append('LargeMapWidth', imageWidth)
        data.append('LargeMapLength', imageHeight)

        data.append('ElementsString', JSON.stringify(newParts.map(e => ({
            Title: e.title,
            ExternalVideoLink: e.externalLink,
            QuestionSeriesId: e.series ? e.series.Id : undefined ,
            X: Math.floor(e.x - e.offsetX),
            Y:  Math.floor(e.y),
            Width:  Math.floor(e.width),
            Length:  Math.floor(e.height),
            Background_ImageId:  e.backgroundImage ? e.backgroundImage.Id : undefined,
            BackgroundImage: e.backgroundImage ? "BackrgoundImage" : ""
        }))))
                                   
                                    
        for(const i of newParts.filter((a) => a.backgroundImage).map(a => a.backgroundImage)){
            data.append('BackgroundImages', i)
        }

        addMap(data)
        .then(r => handleResponse(r, api, 'Added successfully', 1))
        
    }

    const renderFinalPage = () => {
        return(
            <Space direction="vertical">
                {!canAdd && <p className="default-red">Please fill all required data</p>}
                <br/>
                {canAdd && 
                <Space size={'large'} align="start">
                    <Button
                        type="primary"
                        onClick={() => addMapClick()}
                        loading={loadingAddMap}
                    >
                        Add map
                    </Button>
                </Space>}
            </Space>
        )
    }

    const selectContent = () => {
        const map = {
            0: () => renderMetaData(),
            1: () => renderAddImage(),
            2: () => renderAddElements(),
            3: () => renderFinalPage(),
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
                            <Space className={metadataValidation ? "highlighted" : ""}>
                                <p>Meta data{' '}</p>

                                {(!metadataValidation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{metadataValidation}</p>}
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
                            <Space className={!metadataValidation && selectImageValidation ? "highlighted" : ""}>
                                <p>Add image</p>

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
                            icon:<PictureTwoTone   />
                        },
                        {
                            title:
                            <Space className={!metadataValidation && !selectImageValidation && addElementsValidation ? "highlighted" : ""} >
                                <p>Add elements</p>
                                {(!addElementsValidation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{addElementsValidation}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                            </Space>,
                            icon:<BuildTwoTone  />
                        },
                        {
                            title: 'Final',
                            icon:<SmileTwoTone />
                        },
                ]}
            />
            <br/>
            {selectContent()}

            <SelectSeries 
                open={showSelectSeries}
                onClose={() => setShowSelectSeries(false)}

                onSelect={(s) => {
                    let parts = [...newParts]
                    parts[selectedElement].series = s

                    setNewParts(parts)
                    setSelectedElement(null)
                    setShowSelectSeries(false)
                }}
            />

            <SelectBackgroundImage 
                open={showSelectBackgroundImage}
                onClose={() => setShowSelectBackgroundImage(false)}

                onSelect={(i) => {
                    let parts = [...newParts]
                    parts[selectedElement].backgroundImage = i

                    setNewParts(parts)
                    setSelectedElement(null)
                }}
            />
        </PagesWrapper>
    )
}