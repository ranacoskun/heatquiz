import {Col, Drawer, Row, Skeleton, Space} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useDefaultValues } from "../../contexts/DefaultValuesContext";

import './index.css'
import { useEffect } from "react";

export function SelectClickImagesList({open, onClose, onSelect}){
    
    if(!open) return <div/>;

    const { ClickImagesLists, isLoadingClickImagesLists, getClickImagesLists} = useDefaultValues()

    useEffect(() => {
        getClickImagesLists()
    }, [])


    const renderImages = () => {

        return(
            <Space>
                <Row 
                    gutter={24}
                >
                    {ClickImagesLists.map((c, i) => {
                        const {Id, Code, Play, PDF, Link} = c
                        console.log(c)
                        return(
                            <Col 
                            key={Id}
                            xs ={6}>
                                <div
                                    className="hoverable-plus hq-element-container"
                                    onClick={() => {
                                        onSelect(c)
                                    }}
                                >
                                     <Space>
                                        <p>{(i+1) + ' ' + Code} </p>
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
        )
    }

    return(
        <div>
            <Drawer
            title="Select click images list for element"
            width={'100%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
                {isLoadingClickImagesLists && <Skeleton />}

                {(!isLoadingClickImagesLists && ClickImagesLists && renderImages())}
            </Drawer>
        </div>
    )
}