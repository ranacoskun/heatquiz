import { Button, Col, Divider, Drawer, Form, Input, Row, Space, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { UploadImage } from "../../../Components/UploadImage";
import './index.css'
import { handleResponse } from "../../../services/Auxillary";
import { useDefaultValues } from "../../../contexts/DefaultValuesContext";

export function AddBackgroundImage({open, onClose, reloadData}){
    

    if(!open) return <div/>;

    const {isLoadingAddBackgroundImage, addBackgroundImage} = useDefaultValues()

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
                        <p>Add background image</p>

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

                                addBackgroundImage(data) 
                                .then(r => handleResponse(r, messageApi, 'Added successfully', 1, () => {
                                    reloadData()
                                    onClose()
                                }))
                            }}
                            loading = {isLoadingAddBackgroundImage}
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

                        className="add-background-image-img-box"
                        classNameImage="add-background-image-inside-img"
                    />
                    </Col>
                    
                </Row>                  
            </Drawer>
        </div>
    )
}