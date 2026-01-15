import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, SwitcherTwoTone} from '@ant-design/icons';
import './index.css'
import { Col, Drawer, Row, Skeleton, Space, Tooltip} from "antd";
import { useDefaultValues } from "../../contexts/DefaultValuesContext";

export function SelectDefaultImage({className, classNameImage, imageURL, onSetImage}){
    const {DefaultImages, errorGetDefaultImages, isLoadingDefaultImages, getDefaultImages} = useDefaultValues()

    const [showSelectionModal, setShowSelectionModal] = useState(false)


    useEffect(() => {
        getDefaultImages()
    }, [])

    const renderModal = () => {

        return(
            <Drawer
                open={showSelectionModal}
                onClose={() => {
                    setShowSelectionModal(false)
                }}
                title={"Select an image"}
                width={'70%'}
                bodyStyle={{
                  paddingBottom: 80,
                }}
                closeIcon={<ArrowLeftOutlined />}
            >
                {isLoadingDefaultImages && <Skeleton />}

                {(!isLoadingDefaultImages && DefaultImages) && 
                <Row 
                    gutter={12}
                >
                    {DefaultImages.map((di, i) => {
                        const {Id, Code, ImageURL} = di
                        return(
                            <Col 
                            key={Id}
                            xs ={6}>
                                <div
                                    className="select-default-img-container hoverable-plus"
                                    onClick={() => {
                                        onSetImage(di)
                                        setShowSelectionModal(false)
                                    }}
                                >
                                     <Space>
                                        <p>{(i+1) + ' ' + Code} </p>
                                    </Space>

                                    <img
                                        className="select-default-img-img"
                                        src={ImageURL}
                                        alt={Code}
                                    />
                                </div>
                            </Col>
                        )
                    })}
                </Row>}

            </Drawer>
        )
    }

    return(
        <div>
            <Tooltip
                placement="top"
                color="white"
                title={ <p>Select a pre-defined image</p>}
            >
                <div 
                    onClick={() => setShowSelectionModal(true)}
                    className={className + " select-default-img-base"}>
                    {!imageURL &&
                        <Space
                            align="center"
                            direction="vertical"
                        >
                            
                                <SwitcherTwoTone className="select-default-img-icon"/>
                        </Space>}

                    {imageURL && 
                        <img 
                            src={imageURL}
                            className={classNameImage}
                            alt="generic"
                        />}
                </div>
            </Tooltip>
        {renderModal()}
        </div>

    )
}