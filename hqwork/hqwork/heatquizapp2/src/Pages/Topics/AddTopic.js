import { Button, Drawer, Form, Input, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useTopics } from "../../contexts/TopicsContext";
import { handleResponse } from "../../services/Auxillary";

export function AddTopic({open, onClose, reloadData}){
    const [messageApi, contextHolder] = message.useMessage();

    const {loadingAddTopic, addTopic} = useTopics()

    const [newName, setNewName] = useState('')

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Add topic"}
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
                            Name: newName
                        })

                        addTopic(VM).then((r) => 
                            handleResponse(r, messageApi, 'Added successfully', 1, () => {
                                reloadData()
                                onClose()
                            }))

                        
                    }}
                    loading = {loadingAddTopic}
                >
                Add
                </Button>
            </Drawer>
        </div>
    )
}