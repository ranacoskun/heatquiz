import { Button, Drawer, Form, Input, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useInterpretedTrees } from "../../contexts/InterpretedTreesContext";
import { handleResponse } from "../../services/Auxillary";

export function AddTree({open, onClose, reloadData}){
    const {loadingAddTree, addTree} = useInterpretedTrees()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Add tree"}
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
                       }

                       const VM = ({
                        Name:newName
                       })
                      
                       addTree(VM).then((r) => handleResponse(r, messageApi, 'Added successfully', 1, () => {
                            reloadData()
                            onClose()
                       }))
                        
                    }}
                    loading = {loadingAddTree}
                >
                Add
                </Button>
            </Drawer>
        </div>
    )
}