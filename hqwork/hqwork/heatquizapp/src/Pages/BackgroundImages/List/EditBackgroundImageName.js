import { Button, Drawer, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { handleResponse } from "../../../services/Auxillary";
import { useDefaultValues } from "../../../contexts/DefaultValuesContext";

export function EditBackgroundImageName({open, onClose, backgroundImage, reloadData}){
    if(!open) return <div/>;
    
    const [messageApi, contextHolder] = message.useMessage();

    const {isLoadingEditBackgroundImageName, editBackgroundImageName} = useDefaultValues()

    const [newName, setNewName] = useState('')

    useEffect(() => {   
        if(open){
            setNewName(backgroundImage.Code)
        }
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit background image name"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
            >
                <Form>
                    <Form.Item>
                        <small className="default-gray">Name</small>
                        <Input 
                        placeholder="New name"
                        value={newName}
                        onChange={(v) => setNewName(v.target.value)}
                         
                        />
            
                    </Form.Item>
                </Form>
                <Button 
                    type="primary" 
                    size="small"
                    onClick={() => {
                        if(!newName.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add name')
                            return
                        }

                        const data = new FormData()
                        data.append('Code', newName.trim())
                        data.append('Id', backgroundImage.Id)

                        editBackgroundImageName(data).then((r) => 
                        handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                        }))

                        
                    }}
                    loading = {isLoadingEditBackgroundImageName}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}