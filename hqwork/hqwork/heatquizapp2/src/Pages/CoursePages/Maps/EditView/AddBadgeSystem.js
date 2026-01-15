import {Button, Drawer, message, Form, Input, Space, Col, Row, Tooltip} from "antd";
import React, {useState } from "react";
import {ArrowLeftOutlined, PlusOutlined, CloseCircleFilled} from '@ant-design/icons';
import { useMaps } from "../../../../contexts/MapsContext";
import { UploadImage } from "../../../../Components/UploadImage";
import { handleResponse } from "../../../../services/Auxillary";

export function AddBadgeSystem({open, onClose, map, reloadMap}){
    
    if(!open) return <div/>;

    const {loadingAddMapBadgeSystem, addMapBadgeSystem} = useMaps()

    const [newTitle, setNewTitle] = useState('')
    const [badges, setBadges] = useState([])
    
    const [api, contextHolder] = message.useMessage()

    const removeBadge = (ci) => {
        let _cs = [...badges]
        _cs = _cs.filter((c, i) => i !== ci)
        setBadges(_cs)
    }

    return(
        <div>
            {contextHolder}
            <Drawer
            title="Add badge system"
            width={'70%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
            <Form>
                <Form.Item>
                    <small className="default-gray">System name</small>
                    <Input 
                        placeholder="Name"
                        value={newTitle}
                        type="text"
                        onChange={(v) => setNewTitle(v.target.value)}
                    />
                </Form.Item>
            </Form>

            <br/>
            <Space>
                <small className="default-gray">Badges </small>

                <div className="hoverable">
                <Tooltip
                    color="white"
                    placement="top"
                    title={<p>Add badge</p>}
                >
                    <PlusOutlined 
                    onClick={() => {
                        let newBadges = [...badges]                

                        newBadges.push({
                            Progress:1,
                            Image:null,
                            ImageURL: null
                        })

                        setBadges(newBadges)
                    }}
                    style={{color:'green', cursor:'pointer'}} />
                </Tooltip>
                </div>
            </Space>
            <br/>
            <br/>
            <Row
                gutter={12}
            >
            {badges.map((b, bi) => {

                return(
                    <Col className="hq-element-container" xs ={8}>
                        <Space align="start">
                            &nbsp;
                            <Tooltip
                                color="white"
                                placement="top"
                                title={<p>Delete badge</p>}
                            >
                                <CloseCircleFilled 
                                    onClick={() => removeBadge(bi)}
                                    style={{color:'red', cursor:'pointer'}}
                                />
                            </Tooltip>
                            &nbsp;

                            <Space align="start" direction="vertical">
                                <small className="default-gray">Progress</small>
                                <Input 
                                    type="number"
                                    value={b.Progress}
                                    placeholder="Progress"

                                    onChange={(v) => {
                                        const value = Number(v.target.value)

                                        if(value < 1) return;
                                        if(value > 100) return;

                                        let bs = [...badges]

                                        bs[bi].Progress = value

                                        setBadges(bs)
                                    }}
                                    
                                />
                            </Space>
                            <Space align="start" direction="vertical">
                                <small className="default-gray">Image</small>
                                <UploadImage 
                                    onSetImage={(url, img) => {
                                        let bs = [...badges]

                                        bs[bi].ImageURL = url
                                        bs[bi].Image = img

                                        setBadges(bs)
                                    }}

                                    imageURL={b.ImageURL}

                                    className={"add-badge-system-badge-img-box"}
                                    classNameImage={"add-badge-system-badge-img-box-inside-img"}
                                />
                            </Space>
                        </Space>
                        
                    </Col>
                )

            })}
            </Row>
            <br/>
            <br/>

            <Button 
                size="small"
                type="primary"
                onClick={() => {
                    if(!newTitle.trim()){
                        api.destroy()
                        api.warning('Please add name')

                        return
                    }

                    if(!badges.length){
                        api.destroy()
                        api.warning('Please add atleast one badge')

                        return
                    }

                    const data = new FormData()
                    data.append("MapId", map.Id)
                    data.append("Title", newTitle) 

                    for (let file of badges.map((e) => e.Image)) {
                        data.append('Pictures', file, file.name);
                    }

                    for (let P of badges.map((e) => e.Progress)) {
                        data.append('ProgressList', P);
                    }

                    addMapBadgeSystem(data)
                    .then(r => handleResponse(
                        r,
                        api,
                        'Added successfuly',
                        1,
                        () => {
                            reloadMap()
                            onClose()
                        }))

                    

                }}

                loading={loadingAddMapBadgeSystem}
            >
                Add
            </Button>
            </Drawer>
        </div>
    )
}