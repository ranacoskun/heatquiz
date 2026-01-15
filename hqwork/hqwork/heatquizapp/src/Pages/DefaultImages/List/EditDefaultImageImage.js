import { Button, Col, Drawer, Row, Space, message } from "antd";
import React, { useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { handleResponse } from "../../../services/Auxillary";
import { useDefaultValues } from "../../../contexts/DefaultValuesContext";
import { UploadImage } from "../../../Components/UploadImage";

export function EditDefaultImageImage({open, onClose, defaultImage, reloadData}){

    if(!open) return <div/>;

    const [messageApi, contextHolder] = message.useMessage();

    const {isLoadingEditDefaultImageImage, editDefaultImageImage,} = useDefaultValues()

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit default image name"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}

                footer={
                    <Space>
                        <small className="default-gray">Image</small>
                        <small className="default-title">{defaultImage.Code}</small>
                    </Space>
                }
            >
                
                <Row className="hq-full-width">
                    <Col xs={12}>
                        <small className="default-gray">Image</small>
                        <UploadImage 
                            onSetImage={(url, img) => {
                            setNewImageURL(url)
                            setNewImage(img)
                        }}

                        imageURL={newImageURL}

                        className="add-default-image-img-box"
                        classNameImage="add-default-image-inside-img"
                    />
                    </Col>
                    
                </Row> 
                <br/>
                <br/>
                <Button 
                    type="primary" 
                    size="small"
                    onClick={() => {
                        if(!newImage){
                            messageApi.destroy()
                            messageApi.warning('Please add name')
                            return
                        }

                        const data = new FormData()
                        data.append('Picture', newImage)
                        data.append('Id', defaultImage.Id)

                        editDefaultImageImage(data).then((r) => 
                        handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                        }))

                        
                    }}
                    loading = {isLoadingEditDefaultImageImage}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}