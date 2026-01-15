import { Button, Drawer, Space, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { SelectKeyList } from "../Shared/SelectKeyList";
import { useEffect } from "react";

export function AddKeyboardAddKey({open, onClose, onSelect, existingKeys}){

    if(!open) return <div />;

    const [messageApi, contextHolder] = message.useMessage();
    
    const [selectedKeys, setSelectedKeys] = useState([])

    useEffect(() => {
        setSelectedKeys([])
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={
                    <Space>
                        <p>Add keys</p>

                        <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                                if(!selectedKeys.length){
                                    messageApi.destroy()
                                    messageApi.warning("Please select atleast one key")
                                    return
                                }

                                onSelect(selectedKeys)
                                onClose()
                            }}
                        >
                            Add
                        </Button>
                    </Space>
                }
                width={'100%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
            >
               <SelectKeyList 
                    onSelect={(l) => setSelectedKeys(l)}
                    existingKeys={existingKeys}
               />
            </Drawer>
        </div>
    )
}