import React from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { Button, Col, Divider, Form, Input, Row, Space, Tooltip, message } from "antd";
import { useState } from "react";
import { AddKeyboardAddKey } from "./AddKeyboardAddKey";
import { LatexRenderer } from "../../../Components/LatexRenderer";

import {PlusOutlined, CloseCircleFilled, CaretLeftOutlined, CaretRightOutlined, CheckCircleFilled, CloseCircleTwoTone} from '@ant-design/icons';
import { NUMERIC_KEY, VARIABLE_KEY } from "../../../Components/Keyboard/constants";
import { useKeyboard } from "../../../contexts/KeyboardContext";
import { handleResponse } from "../../../services/Auxillary";

export function AddKeyboard(){

    const {isLoadingAddKeyboard, addKeyboard} = useKeyboard()

    const [newName, setNewName] = useState('')

    const [showAddKeys, setShowAddKeys] = useState(false)

    const [selectedKeys, setSelectedKeys] = useState([])

    const [api, contextHolder] = message.useMessage()

    const removeKey = (ki) => {
        let _keys = [...selectedKeys]
        _keys = _keys.filter((k, kii) => kii !== ki)

        setSelectedKeys(_keys)
    }

    const moveLeft = (ki) => {
        if(ki === 0){
            return
        }

        let _keys = [...selectedKeys]
        const original = _keys[ki-1]
        const current = _keys[ki]

        _keys[ki] = original
        _keys[ki - 1] = current

        setSelectedKeys(_keys)
    }

    const moveRight = (ki) => {
        if((ki + 1) === selectedKeys.length){
            return
        }

        let _keys = [...selectedKeys]
        const original = _keys[ki+1]
        const current = _keys[ki]

        _keys[ki] = original
        _keys[ki + 1] = current

        setSelectedKeys(_keys)
    }

    const renderSelectedKeys = () => {

        return(
            <Row gutter={[2,2]}>
                {selectedKeys.map((k, ki) => {
                    const {TextPresentation} = k

                    return(
                        <Col
                            key={ki}
                            className="keyboard-key-item"
                        >
                            <div
                                className="keyboard-key-item-inner"
                            >
                                <LatexRenderer 
                                    latex={"$$" + TextPresentation + "$$"} 
                                />
                            </div>
                            <br/>
                            <Space direction="vertical">
                                <Tooltip
                                    color="white"
                                    title={<p>Remove key</p>}
                                >
                                    <CloseCircleFilled 
                                        onClick={() => removeKey(ki)}
                                        style={{color:'red', cursor:'pointer'}}
                                    />
                                </Tooltip>

                                <Tooltip
                                    color="white"
                                    title={<p>Move right</p>}
                                >
                                    <CaretRightOutlined 
                                        onClick={() => moveRight(ki)}
                                        style={{color:'#0275d8', cursor:'pointer'}}
                                    />
                                </Tooltip>
                                
                                <Tooltip
                                    color="white"
                                    title={<p>Move left</p>}
                                >
                                    <CaretLeftOutlined 
                                        onClick={() => moveLeft(ki)}
                                        style={{color:'#0275d8', cursor:'pointer'}}
                                    />
                                </Tooltip>
                                
                            </Space>
                        </Col>
                    )
                })}
            </Row>
        )

    }

    const validateKeyboard = () => {
        if(!newName.trim()){
            return <p>Please add name</p>
        }

        if(!selectedKeys.length){
            return <p>Please add keys</p>
        }

        return null
    }

    const keyboardValidation = validateKeyboard()

    return(
        <PagesWrapper>
            {contextHolder}
            <Divider orientation="left">
                <Space size={'large'}>
                    <p>Add keyboard</p>

                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            if(keyboardValidation){
                                return
                            }

                            const VM =({
                                Name:newName,

                                NumericKeys: selectedKeys
                                .map((k, i) => ({...k, Order:i}))
                                .filter((k) => (k.Type === NUMERIC_KEY)),
                                
                                VariableKeys: selectedKeys
                                .map((k, i) => ({...k, Order:i}))
                                .filter((k) => (k.Type === VARIABLE_KEY)),

                                KeysPerRow: 1
                            })

                            addKeyboard(VM).then(r => handleResponse(r, api, 'Added successfully', 1))
                        }}

                        loading={isLoadingAddKeyboard}
                    >
                        Add
                    </Button>

                    {(!keyboardValidation ? 
                        <CheckCircleFilled style={{color:'green'}}/> 
                        : 
                        <Tooltip 
                            color="white"
                            title={keyboardValidation}
                        >
                            <CloseCircleTwoTone twoToneColor={'red'}/>
                        </Tooltip>)}
                </Space>
            </Divider>
            <Row gutter={4}>
                <Col xs={6}>
                    <Form>
                        <Form.Item>
                            <small className="default-gray">Name</small>
                            <Input
                                placeholder="New keyboard's name"
                                value={newName}
                                type="text"
                                onChange={(v) => setNewName(v.target.value)}
                            />
                            
                        </Form.Item>
                    </Form>
                </Col>
                <Col>
                    <Space direction="vertical">
                    <small className="default-white">.</small>
                    <Tooltip
                        color="white"
                        title={
                            <div>
                                <p>Choose keys from keys list to be included in the new keyboard</p>
                            </div>
                        }
                    >
                        <Button
                            size="small"
                            icon={<PlusOutlined style={{color:'green'}} />}
                            onClick={() => setShowAddKeys(true)}
                        >
                            Add key
                        </Button>

                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <Space size={"large"}>
                            <p className="default-gray">
                                <span className="default-title">
                                    ({selectedKeys.filter(a => a.Type === NUMERIC_KEY).length}){' '}
                                </span> 
                                numeric keys
                            </p>

                            <p className="default-gray">
                                <span className="default-title">
                                    ({selectedKeys.filter(a => a.Type === VARIABLE_KEY).length}){' '}
                                </span> 
                                variable keys
                            </p>
                        </Space>
                    </Tooltip>
                    </Space>
                </Col>
            </Row>

            <br/>
            
            {renderSelectedKeys()}
        
            <AddKeyboardAddKey 
                open={showAddKeys}
                onClose={() => setShowAddKeys(false)}
                onSelect = {(l) => {
                    
                    let _keys = [...selectedKeys, ...l]

                    setSelectedKeys(_keys)
                }}

                existingKeys = {selectedKeys}
            />
        </PagesWrapper>
    )
}