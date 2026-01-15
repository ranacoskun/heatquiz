import { Button, Drawer, Form, Input, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useClickTrees } from "../../contexts/ClickTreesContext";
import { handleResponse } from "../../services/Auxillary";

export function EditNodeName({open, onClose, node, reloadData}){
    const {loadingEditNode, editNode} = useClickTrees()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

    useEffect(() => {
        setNewName((node || {}).Name)
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit Node Name"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
            >   
                <Form>
                    <Form.Item>
                        <small className="default-gray">Updated name</small>
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
                        }

                        let data = new FormData()
                        data.append('Name', newName)
                        data.append('AnswerId', node.Id)
                        data.append('Picture', null)
                        data.append('SameImage', true)

                       editNode(data).then((r) => 
                        handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                        })
                       )
                       
                    }}
                    loading = {loadingEditNode}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}