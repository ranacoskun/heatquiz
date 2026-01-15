import { Button, Drawer, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useTopics } from "../../contexts/TopicsContext";
import { handleResponse } from "../../services/Auxillary";

export function EditTopicName({open, onClose, topic, reloadData}){
    
    const [messageApi, contextHolder] = message.useMessage();

    const {loadingEditName, updateTopicName} = useTopics()

    const [newName, setNewName] = useState('')

    useEffect(() => {   
        if(open){
            setNewName(topic.Name)
        }
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit topic name"}
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

                        const VM = ({
                            Id: topic.Id, 
                            Name: newName
                        })

                        updateTopicName(VM).then((r) => 
                        handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                        }))

                        
                    }}
                    loading = {loadingEditName}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}