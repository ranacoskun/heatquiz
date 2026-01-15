import { Button, Drawer, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useTopics } from "../../contexts/TopicsContext";
import { handleResponse } from "../../services/Auxillary";

export function EditSubtopicName({open, onClose, subtopic, reloadData}){
    const [messageApi, contextHolder] = message.useMessage();

    const {loadingEditSubtopicName, updateSubtopicName} = useTopics()

    const [newName, setNewName] = useState('')

    useEffect(() => {   
        setNewName(subtopic.Name)
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit subtopic name"}
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
                            Id: subtopic.Id, 
                            Name: newName
                        })

                        updateSubtopicName(VM)
                        .then((r) =>
                            handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                                reloadData()
                                onClose()
                            }))

                        
                    }}
                    loading = {loadingEditSubtopicName}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}