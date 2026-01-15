import { Button, Drawer, Form, Input, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useInterpretedTrees } from "../../contexts/InterpretedTreesContext";
import { handleResponse } from "../../services/Auxillary";

export function EditTreeName({open, onClose, tree, reloadData}){
    const {loadingEditTree, editTree} = useInterpretedTrees()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

    useEffect(() => {
        setNewName((tree || {}).Name)
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit Tree Name"}
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

                       const VM = ({
                        ...tree,
                        Name:newName
                       })

                       editTree(VM).then((r) => handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                        reloadData()
                        onClose()
                   }))

                    }}
                    loading = {loadingEditTree}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}