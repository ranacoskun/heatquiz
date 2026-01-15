import {Button, Col, Divider, Drawer, Row, Skeleton, Space, message} from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, ForwardOutlined} from '@ant-design/icons';
import { useDefaultValues } from "../../../../contexts/DefaultValuesContext";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { useMaps } from "../../../../contexts/MapsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function AssignClickImagesListGroup({open, onClose, map, reloadMap}){
    
    if(!open) return <div/>;

    const [selectedList, setSelectedList] = useState(null);
    const [selectedElements, setSelectedElements] = useState([]);
    const [selectingElements, setSelectingElements] = useState(false)

    const { ClickImagesLists, isLoadingClickImagesLists, errorGetClickImagesLists, getClickImagesLists} = useDefaultValues()
    const {loadingAssignClickListToMapElement, assignClickListToMapElement,} = useMaps()

    useEffect(() => {
        if(open){
            getClickImagesLists()
        }
    }, [open])

    const [api, contextHolder] = message.useMessage()

    const renderLists = () => {

        return(
            <div>
                {isLoadingClickImagesLists && <Skeleton />}

                {errorGetClickImagesLists && !isLoadingClickImagesLists && 
                <ErrorComponent
                    error={errorGetClickImagesLists}
                    onReload={() => getClickImagesLists()}
                />}

                {(!isLoadingClickImagesLists && !errorGetClickImagesLists && ClickImagesLists) &&
                <Space>
                <Row 
                    gutter={24}
                >
                    {ClickImagesLists.map((c, i) => {
                        const {Id, Code, Play, PDF, Link} = c

                        const isSelected = selectedList && (Id === selectedList.Id)

                        return(
                            <Col
                            key={Id}
                            xs ={6}>
                                <div
                                    className={"hoverable-plus hq-element-container" + (isSelected ? " highlighted" : "")}
                                    onClick={() => setSelectedList(c)}
                                >
                                     <Space>
                                        <p className={isSelected ? "default-title" : ""}>{(i+1) + ' ' + Code} </p>
                                    </Space>

                                    <br/>
                                    <br/>
                                    <Row
                                        gutter={24}
                                    >
                                    {Play &&
                                    <Col
                                        xs={4}
                                    >
                                        <img 
                                            className="hq-img"
                                            alt="Play"
                                            src={Play}
                                        />
                                   </Col>}

                                    {PDF &&
                                    
                                    <Col
                                        xs={4}
                                    >
                                        <img 
                                            className="hq-img"
                                            alt="PDF"
                                            src={PDF}
                                        />
                                   </Col>
                                   }

                                    {Link &&
                                    <Col
                                        xs={4}
                                    >
                                        <img 
                                            className="hq-img"
                                            alt="Link"
                                            src={Link}
                                        />
                                   </Col>}
                                    </Row>
                                   
                                </div>
                            </Col>
                        )
                    })}
                </Row>
            </Space>
                }
            </div>
        )
    }

    const renderSelectElements = () => {
        const {Elements} = map

        return(
            <div className="hq-full-width">
                <Button 
                    size="small"
                    type={selectedElements.length ? "primary" : "default"}
                    loading={loadingAssignClickListToMapElement}
                    onClick={() => {
                        if(!selectedElements.length){
                            api.destroy()
                            api.warning("Please select atleast one element")

                            return
                        }

                        if(!selectedList){
                            api.destroy()
                            api.warning("Please select a list")

                            return
                        }

                        const data = new FormData()

                        for(let e of selectedElements){
                            data.append("ElementIds", e.Id)
                        }

                        data.append("ListId", selectedList.Id)

                        assignClickListToMapElement(data)
                        .then(
                            (r) => handleResponse(
                                r,
                                api,
                                'List assigned successfuly',
                                1,
                                () => {
                                    onClose()
                                    reloadMap()
                                }))
                    }}
                >
                    Assign list {selectedList.Code} to selected elements
                </Button>
                <Divider/>
                <Row gutter={[4,4]}>
                    {Elements.map((e, ei) => {
                        const {Id, Title} = e
                        const isSelected = (selectedElements.some(a => a.Id === Id))
                        return(
                            <Col
                                key={Id}
                                className={"hq-element-container hoverable" + (isSelected ? " highlighted" : "")}
                                xs={4}
                                onClick={() => {
                                    let _elements = [...selectedElements]
                                    
                                    if(isSelected){
                                        _elements = _elements.filter(a => a.Id !== Id)
                                    }
                                    else{
                                        _elements.push(e)
                                    }

                                    setSelectedElements(_elements)
                                }}
                            >
                            <p className={isSelected ? "default-title" : ""}>{ei+1}{' '}{Title}</p>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        )
    }

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
            <Space
                align="start"
                className="hq-opposite-arrangement"
            >
                <Space size={'large'}>
                    <p>Assign list for group of elements</p>
                    &nbsp; 
                    &nbsp; 
                    &nbsp; 
                    &nbsp; 
                    <Button
                        size="small"
                        type={!selectingElements ? 'primary' : 'default'}
                        onClick={() => setSelectingElements(false)}
                    >
                        Select list
                    </Button>
                   
                    <Button
                        size="small"
                        type={selectingElements ? 'primary' : 'default'}
                        onClick={() => setSelectingElements(true)}
                    >
                        {'Select elements ('}{selectedElements.length}{') '} <ForwardOutlined /> {' Add'}
                    </Button>
                </Space>
            </Space>}
            width={'100%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >   
               {!selectingElements ? renderLists() : renderSelectElements()}
            </Drawer>
        </div>
    )
}