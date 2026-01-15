import {Button, ColorPicker, Drawer, Form, Input, Space} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";

export function EditLevelOfDifficulty({open, onClose, LOD, reloadData}){

    if(!open) return <div/>;

    useEffect(() => {
        const {Name,HexColor} = LOD
        setName(Name)
        setColor(HexColor)
    }, [open])

    const [name, setName] = useState('')
    const [color, setColor] = useState('')

    return(
        <Drawer
        title="Edit level of difficulty"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
          <Form>
            <Form.Item>
              <small className="default-gray">Name</small>
              <Input 
                placeholder="New name for level of difficulty"
                value={name}
                onChange={(v) => setName(v.target.value)}
              />
          
            </Form.Item>
            <Form.Item>
              <Space
                direction="vertical"
                size={'small'}
              >
                <small className="default-gray">Color</small>
                <Space
                  size={'small'}
                >
                  <ColorPicker 
                  value={color}
                  onChange={(v,h) => {
                    console.log(v)
                    console.log(h)

                    setColor(h)
                  }}
                  size="large" 
                  showText = {true} />

                  <p>{color}</p>
                </Space>
              </Space>
            </Form.Item>
          </Form>
          <Button 
            type="primary" 
            size="small"
            onClick={() => {
             
            }}
            loading = {false}
            >
              Update
          </Button>
        </Drawer>
    )
}