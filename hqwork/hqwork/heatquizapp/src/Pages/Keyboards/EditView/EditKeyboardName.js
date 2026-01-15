import { Button, Drawer, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useKeyboard } from "../../../contexts/KeyboardContext";
import { handleResponse } from "../../../services/Auxillary";

export function EditKeyboardName({open, onClose, keyboard, reloadData}){
    
    const [messageApi, contextHolder] = message.useMessage();

    const {isLoadingEditKeyboardName, editKeyboardName} = useKeyboard()

    const [newName, setNewName] = useState('')

    useEffect(() => {   
        if(open){
            setNewName(keyboard.Name)
        }
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit keyboard name"}
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
                    onClick={() => {
                        if(!newName.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add name')
                            return
                        }

                        const VM = ({
                            ...keyboard,
                            Name: newName
                        })

                        editKeyboardName(VM).then((r) => 
                        handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                        }))

                        
                    }}
                    loading = {isLoadingEditKeyboardName}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}