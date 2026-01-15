import { Button, Col, Divider, Drawer, Row, Select, Space, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useAssistanceObjects } from "../../../contexts/AssistanceObjectsContext";
import { UploadImage } from "../../../Components/UploadImage";
import './index.css'
import { handleResponse } from "../../../services/Auxillary";

export function EditImageMapClickImagesList({open, onClose, list, reloadData}){
    

    if(!open) return <div/>;

    const { isLoadingEditMapClickImageListImage, editMapClickImageListImage} = useAssistanceObjects()

    const [messageApi, contextHolder] = message.useMessage();

    const [newImage, setPlayImage] = useState({})

    const [selectedType, setSelectedType] = useState('Play')

    const mapNameTypeValue = (t) => {
        const map = {
            Play: 0,
            PDF: 2,
            Video: 4,
            Link: 8
        }      
        
        return map[t]
    }


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
                                if(!newImage.Image){
                                    messageApi.destroy()
                                    messageApi.warning("Please add an images")

                                    return
                                }

                                const Type = mapNameTypeValue()
                             
                                const data = new FormData()
                                data.append('Id', list.Id)
                                data.append('Picture', newImage.Image)
                                data.append('EditType', Type)
                                

                                editMapClickImageListImage(data) 
                                .then(r => handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                                    reloadData()
                                    onClose()
                                }))
                            }}
                            loading = {isLoadingEditMapClickImageListImage}
                        >
                        Update
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
                    Image
                </Divider> 

                <Row className="hq-full-width" gutter={[48,48]}>
                    <Col xs={12}>
                        

                        <div>
                            <small className="default-gray"> Image</small>
                            <UploadImage 
                                onSetImage={(url, img) => {
                                setPlayImage({
                                    ImageURL: url,
                                    Image: img 
                                })
                            }}

                            imageURL={newImage.ImageURL}

                            className="add-map-click-list-img-box"
                            classNameImage="add-map-click-list-inside-img"
                            />
                        </div>

                        <Select
                            className="edit-map-click-list-seleect-type"
                            onChange={(v, option) => {
                                setSelectedType(v)
                            }}
                                defaultValue={'please select'}
                                value={"Update " + selectedType}

                                options={(['Play', 'PDF', 'Video', 'Link']).map((d) => ({
                                    value: d,
                                    label: d
                                }))}
                        />
                    </Col>
                    
                </Row>                  
            </Drawer>
        </div>
    )
}