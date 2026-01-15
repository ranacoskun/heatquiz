import { Button, Col, Divider, Drawer, Form, Input, Row, Space, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { UploadImage } from "../../../Components/UploadImage";
import './index.css'
import { handleResponse } from "../../../services/Auxillary";
import { useDefaultValues } from "../../../contexts/DefaultValuesContext";

export function AddDefaultImage({open, onClose, reloadData}){
    

    if(!open) return <div/>;

    const {isLoadingAddDefaultImage, addDefaultImage} = useDefaultValues()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    
    return( 
        <div>
            {contextHolder}
            <Drawer
                title={
                    <Space size={"large"}>
                        <p>Add default image</p>

                        <Button 
                            type="primary"
                            size="small"
                            onClick={() => {
                                if(!newName.trim()){
                                    messageApi.destroy()
                                    messageApi.warning("Please add name")

                                    return
                                }

                                if(!newImage){
                                    messageApi.destroy()
                                    messageApi.warning("Please add all images")

                                    return
                                }

                                const data = new FormData()
                                data.append('Code', newName.trim())
                                data.append('Picture', newImage)                                

                                addDefaultImage(data) 
                                .then(r => handleResponse(r, messageApi, 'Added successfully', 1, () => {
                                    reloadData()
                                    onClose()
                                }))
                            }}
                            loading = {isLoadingAddDefaultImage}
                        >
                        Add
                        </Button>     
                    </Space>
                }
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
                maskClosable={false}
            >   
                <Divider orientation="left">
                    Name
                </Divider>
                <Form>
                    <Form.Item>
                        <Input 
                        placeholder="New name"
                        value={newName}
                        onChange={(v) => setNewName(v.target.value)}
                         
                        />
            
                    </Form.Item>
                </Form>       
                <Divider orientation="left">
                    Image
                </Divider> 

                <Row className="hq-full-width">
                    <Col xs={12}>
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
            </Drawer>
        </div>
    )
}