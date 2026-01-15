import { Button, Drawer, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useKeyboard } from "../../../../contexts/KeyboardContext";
import { handleResponse } from "../../../../services/Auxillary";

export function EditListName({open, onClose, list, reloadData}){
    
    if(!open) return <div/>;

    const [messageApi, contextHolder] = message.useMessage();

    const {isLoadingEditKeyListCode, editKeyListCode,} = useKeyboard()

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
                title={"Edit list code"}
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

                        const data = new FormData()
                        data.append('ListId', list.Id)
                        data.append('Code', newName)

                        editKeyListCode(data).then((r) => 
                        handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                        }))

                        
                    }}
                    loading = {isLoadingEditKeyListCode}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}