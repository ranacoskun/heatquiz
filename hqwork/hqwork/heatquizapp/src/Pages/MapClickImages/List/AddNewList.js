import { Button, Col, Divider, Drawer, Form, Input, Row, Space, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useAssistanceObjects } from "../../../contexts/AssistanceObjectsContext";
import { UploadImage } from "../../../Components/UploadImage";
import './index.css'
import { handleResponse } from "../../../services/Auxillary";

export function AddNewList({open, onClose, reloadData}){
    

    if(!open) return <div/>;

    const {isLoadingAddMapClickImageList, addMapClickImageList} = useAssistanceObjects()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

    const [playImage, setPlayImage] = useState({})
    const [pdfImage, setPDFImage] = useState({})
    const [linkImage, setLinkImage] = useState({})
    const [videoImage, setVideoImage] = useState({})
    
    return( 
        <div>
            {contextHolder}
            <Drawer
                title={
                    <Space size={"large"}>
                        <p>Add list</p>

                        <Button 
                            type="primary"
                            size="small"
                            onClick={() => {
                                if(!newName.trim()){
                                    messageApi.destroy()
                                    messageApi.warning("Please add name")

                                    return
                                }

                                if(!(playImage.Image && pdfImage.Image && linkImage.Image && videoImage.Image )){
                                    messageApi.destroy()
                                    messageApi.warning("Please add all images")

                                    return
                                }

                                const data = new FormData()
                                data.append('Code', newName.trim())
                                data.append('Play', playImage.Image)
                                data.append('PDF', pdfImage.Image)
                                data.append('Video', videoImage.Image)
                                data.append('Link', linkImage.Image)
                                

                                addMapClickImageList(data) 
                                .then(r => handleResponse(r, messageApi, 'Added successfully', 1, () => {
                                    reloadData()
                                    onClose()
                                }))
                            }}
                            loading = {isLoadingAddMapClickImageList}
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
                    Images
                </Divider> 

                <Row className="hq-full-width" gutter={[48,48]}>
                    <Col xs={12}>
                        <p className="default-gray">Play</p>
                        <UploadImage 
                            onSetImage={(url, img) => {
                            setPlayImage({
                                ImageURL: url,
                                Image: img 
                            })
                        }}

                        imageURL={playImage.ImageURL}

                        className="add-map-click-list-img-box"
                        classNameImage="add-map-click-list-inside-img"
                    />
                    </Col>
                    <Col xs={12}>
                        <p className="default-gray">PDF</p>

                        <UploadImage 
                            onSetImage={(url, img) => {
                                setPDFImage({
                                    ImageURL: url,
                                    Image: img 
                                })
                        }}

                        imageURL={pdfImage.ImageURL}

                        className="add-map-click-list-img-box"
                        classNameImage="add-map-click-list-inside-img"
                    />
                    </Col>
                    <Col xs={12}>
                        <p className="default-gray">Link</p>
                        <UploadImage 
                            onSetImage={(url, img) => {
                                setLinkImage({
                                    ImageURL: url,
                                    Image: img 
                                })
                        }}

                        imageURL={linkImage.ImageURL}

                        className="add-map-click-list-img-box"
                        classNameImage="add-map-click-list-inside-img"
                    />
                    </Col>
                    <Col xs={12}>
                        <p className="default-gray">Video</p>
                        <UploadImage                            
                            onSetImage={(url, img) => {
                                setVideoImage({
                                    ImageURL: url,
                                    Image: img 
                                })
                        }}

                        imageURL={videoImage.ImageURL}

                        className="add-map-click-list-img-box"
                        classNameImage="add-map-click-list-inside-img"
                    />
                    </Col>
                </Row>                  
            </Drawer>
        </div>
    )
}