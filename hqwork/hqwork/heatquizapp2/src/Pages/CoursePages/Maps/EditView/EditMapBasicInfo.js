import {Button, Drawer, Space, message, Form, Input, Switch} from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useMaps } from "../../../../contexts/MapsContext";
import { MAX_MAP_NAME } from "./Constants";
import { handleResponse } from "../../../../services/Auxillary";

export function EditMapBasicInfo({open, onClose, map, reloadMap}){
    
    if(!open) return <div/>;

    const {loadingEditMapBasicInfo, editMapBasicInfo} = useMaps()

    const [newTitle, setNewTitle] = useState('')
    const [showSolution, setShowSolution] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [showBorder, setShowBorder] = useState(false)

    const [api, contextHolder] = message.useMessage()

    useEffect(()=> {
        if(open){
            const {Title, ShowSolutions, Disabled, ShowBorder} = map
            
            setNewTitle(Title)
            setShowSolution(ShowSolutions)
            setDisabled(Disabled)
            setShowBorder(ShowBorder)
        }
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
            title="Edit map basic info"
            width={'50%'}
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
                    <small className="default-gray">Map title</small>
                    <Input 
                        placeholder="Title"
                        value={newTitle}
                        type="text"
                        onChange={(v) => setNewTitle(v.target.value)}
                        maxLength={MAX_MAP_NAME}
                    />
                </Form.Item>

                <Space size={'large'}>
                    <Form.Item>
                        <Space direction="vertical">
                            <small className="default-gray">Disabled</small>
                            <Switch 
                                checked={disabled}
                                onChange={(v) => setDisabled(v)}
                                checkedChildren="Yes" 
                                unCheckedChildren="No" />
                        </Space>
                    </Form.Item>

                    <Form.Item>
                        <Space direction="vertical">
                            <small className="default-gray">Show border</small>
                            <Switch 
                                checked={showBorder}
                                onChange={(v) => setShowBorder(v)}
                                checkedChildren="Yes" 
                                unCheckedChildren="No" />
                        </Space>
                    </Form.Item>
                    
                    <Form.Item>
                        <Space direction="vertical">
                            <small className="default-gray">Show solutions</small>
                            <Switch 
                                checked={showSolution}
                                onChange={(v) => setShowSolution(v)}
                                checkedChildren="Yes" 
                                unCheckedChildren="No" />
                        </Space>
                    </Form.Item>
                </Space>
                
            </Form>

            <br/>

            <Button 
                size="small"
                type="primary"
                onClick={() => {
                    if(!newTitle.trim()){
                        api.destroy()
                        api.warning('Please add title')

                        return
                    }

                    const VM = ({
                        ...map,
                        Title: newTitle,
                        ShowBorder: showBorder,
                        ShowSolutions: showSolution,
                        Disabled: disabled
                    })

                    editMapBasicInfo(VM)
                    .then(r => 
                        handleResponse(
                            r,
                            api,
                            'Updated successfuly',
                            1,
                            () => {
                                reloadMap()
                                onClose()
                            })) 
                }}

                loading={loadingEditMapBasicInfo}
            >
                Update
            </Button>
            </Drawer>
        </div>
    )
}