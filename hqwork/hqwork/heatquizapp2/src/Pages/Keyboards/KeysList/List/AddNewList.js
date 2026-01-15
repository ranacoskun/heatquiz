import { Button, Drawer, Form, Input, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useKeyboard } from "../../../../contexts/KeyboardContext";
import { handleResponse } from "../../../../services/Auxillary";

export function AddNewList({open, onClose, reloadData}){
    
    if(!open) return <div/>;

    const [messageApi, contextHolder] = message.useMessage();

    const {isLoadingAddKeyList, addKeyList,} = useKeyboard()

    const [newName, setNewName] = useState('')

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Add list"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
            >
                <Form>
                    <Form.Item>
                        <small className="default-gray">Code</small>
                        <Input 
                        placeholder="New code"
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
                            messageApi.warning('Please add code')
                            return
                        }

                        const VM = ({
                            Code: newName
                        })

                        addKeyList(VM).then((r) => 
                        handleResponse(r, messageApi, 'Added successfully', 1, () => {
                            reloadData()
                            onClose()
                        }))

                        
                    }}
                    loading = {isLoadingAddKeyList}
                >
                Add
                </Button>
            </Drawer>
        </div>
    )
}