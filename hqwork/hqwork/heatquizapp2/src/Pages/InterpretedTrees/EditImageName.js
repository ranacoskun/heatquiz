import { Button, Drawer, Form, Input, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useInterpretedTrees } from "../../contexts/InterpretedTreesContext";
import { handleResponse } from "../../services/Auxillary";

export function EditImageName({open, onClose, node, reloadData}){

    const {loadingEditImageName, editImageName} = useInterpretedTrees()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

    useEffect(() => {
        setNewName((node || {}).Code)
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
                        let data = new FormData()
                        data.append('Code',  newName)
                        data.append('ImageId', node.Id)

                        editImageName(data)
                        .then((r) => handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                       }))
                       
                    }}
                    loading = {loadingEditImageName}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}