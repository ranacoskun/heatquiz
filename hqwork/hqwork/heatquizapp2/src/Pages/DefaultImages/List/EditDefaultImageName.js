import { Button, Drawer, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { handleResponse } from "../../../services/Auxillary";
import { useDefaultValues } from "../../../contexts/DefaultValuesContext";

export function EditDefaultImageName({open, onClose, defaultImage, reloadData}){
    if(!open) return <div/>;
    
    const [messageApi, contextHolder] = message.useMessage();

    const {isLoadingEditDefaultImageName, editDefaultImageName,} = useDefaultValues()

    const [newName, setNewName] = useState('')

    useEffect(() => {   
        if(open){
            setNewName(defaultImage.Code)
        }
    }, [open])

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
                        data.append('Id', defaultImage.Id)

                        editDefaultImageName(data).then((r) => 
                        handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                        }))

                        
                    }}
                    loading = {isLoadingEditDefaultImageName}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}