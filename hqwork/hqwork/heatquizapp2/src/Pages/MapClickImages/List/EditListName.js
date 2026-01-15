import { Button, Drawer, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useAssistanceObjects } from "../../../contexts/AssistanceObjectsContext";
import { handleResponse } from "../../../services/Auxillary";

export function EditListName({open, onClose, list, reloadData}){
    
    const [messageApi, contextHolder] = message.useMessage();

    const {isLoadingEditMapClickImageListName, editMapClickImageListName} = useAssistanceObjects()

    const [newName, setNewName] = useState('')

    useEffect(() => {   
        if(open){
            setNewName(list.Code)
        }
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit list name"}
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
                        data.append('Id', list.Id)

                        editMapClickImageListName(data).then((r) => 
                        handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                        }))

                        
                    }}
                    loading = {isLoadingEditMapClickImageListName}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}