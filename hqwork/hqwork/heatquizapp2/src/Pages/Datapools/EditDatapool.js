import {Button, Drawer, Form, Input, Space, Switch, message} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { useDatapools } from "../../contexts/DatapoolsContext";
import { handleResponse } from "../../services/Auxillary";

export function EditDatapool({open, onClose, DP}){

    if(!open) return <div/>;

    const {isLoadingEditDataPool, EditDataPool, getAllDatapoolsAdmin} = useDatapools()
    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
      const {Name, NickName, IsHidden} = DP
      setName(Name)
      setNickName(NickName)
      setIsHidden(IsHidden)
    }, [open])


    const [name, setName] = useState('')
    const [nickName, setNickName] = useState('')
    const [isHidden, setIsHidden] = useState(false)

    return(
        <Drawer
        title="Edit datapool"
        width={'50%'}
        onClose={onClose}
        open={open}

        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
          {contextHolder}
          <Form>
            <Form.Item>
              <small className="default-gray">Name</small>
              <Input 
                placeholder="datapool's name"
                value={name}
                onChange={(v) => setName(v.target.value)}
              />
          
            </Form.Item>
            <Form.Item>
              <small className="default-gray">Nickname</small>
              <Input 
                placeholder="datapool's nickname"
                value={nickName}
                onChange={(v) => setNickName(v.target.value)}
              />
          
            </Form.Item>

            <Form.Item>
                <Space
                    direction='vertical'
                >
                    <small className="default-gray">Is hidden</small>
                    <Switch
                        checked={isHidden}
                        checkedChildren={'Datapool is hidden'}
                        unCheckedChildren={'Datapool is visible'}
                        onChange={() => {setIsHidden(!isHidden)}}
                    />
                </Space>
            </Form.Item>
           
          </Form>
          <Button 
            type="primary" 
            size="small"
            onClick={() => {
              if(!name.trim() || !nickName.trim()){
                api.destroy()
                api.warning('Please add name and nickname')

                return
              }

              const VM = ({
                ...DP,
                Name: name,
                NickName: nickName,
                IsHidden: isHidden

              })

              EditDataPool(VM).then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                getAllDatapoolsAdmin()
                onClose()
              }))
            }}
            loading = {isLoadingEditDataPool}
            >
              Update
          </Button>
        </Drawer>
    )
}