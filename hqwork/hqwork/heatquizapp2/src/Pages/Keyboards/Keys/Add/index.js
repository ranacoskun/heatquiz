import React from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, Divider, Form, Input, Row, Select, Space, Spin, Tooltip, message } from "antd";
import { useState } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useEffect } from "react";
import {CheckCircleFilled, CloseCircleTwoTone, PlusOutlined, CloseCircleFilled, WarningTwoTone} from '@ant-design/icons';

import './index.css'
import { getUniqueValues, handleResponse } from "../../../../services/Auxillary";
import { useKeyboard } from "../../../../contexts/KeyboardContext";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { useDatapools } from "../../../../contexts/DatapoolsContext";

export function AddNewKey(){

    const {
        isLoadingKeyLists, keyLists, errorGetKeyLists, getAllKeyLists,
        isLoadingAddKey, addKey
    } = useKeyboard()

    const [newCode, setNewCode] = useState('')
    const [newLatex, setNewLatex] = useState('\\alpha_{enter-text}')

    const [selectedList, setSelectedList] = useState(null)

    const [isVariableKey, setIsVariableKey] = useState(false)

    const [variableKeyVariants, setVariableKeyVariants] = useState([])

    const {selectedDatapool} = useDatapools()

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        getAllKeyLists()
    }, [selectedDatapool])

    const renderMetaData = () => {
        return(
            <Col xs={6}>
                <Space size={"large"} direction="vertical" className="hq-full-width">
                    <Form>
                        <Form.Item>
                            <small className="default-gray">Code</small>
                            <Input 
                                placeholder="Code"
                                type="text"
                                value={newCode}
                                onChange={(v) => setNewCode(v.target.value)}
                            />
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <small className="default-gray">LaTeX</small>
                            <Input 
                                placeholder="LaTeX"
                                type="text"
                                value={newLatex}
                                onChange={(v) => setNewLatex(v.target.value)}
                            />
                        </Form.Item>
                        <LatexRenderer 
                            latex={"$$" + newLatex + "$$"}
                            className="hq-element-container"
                        />
                    </Form>
                    

                    <Space direction="vertical">
                        <small className="default-gray">Type</small>
                        <Space>
                            <Button
                                size="small"
                                type={isVariableKey ? "default" : "primary"}
                                onClick={() => setIsVariableKey(false)}
                            >
                                Numeric key
                            </Button>

                            <Button
                                size="small"
                                type={!isVariableKey ? "default" : "primary"}
                                onClick={() => setIsVariableKey(true)}
                            >
                                Variable key
                            </Button>
                        </Space>
                    </Space>

                    <Space direction="vertical">

                        <Space className="hq-full-width hq-opposite-arrangement">
                            <small className="default-gray">Key list</small>
                        </Space>

                        {isLoadingKeyLists && <Spin />}
                        
                        {keyLists && !isLoadingKeyLists &&
                        <Select
                            className="add-key-select-list"
                                onChange={(v, option) => {
                                    const findL = keyLists.filter(l => l.Id === option.value)[0]

                                    setSelectedList(findL)
                                }}
                            defaultValue={'please select'}
                            value={(selectedList || {'Code': 'please select'}).Code}

                            options={(keyLists || []).map((d) => ({
                                value: d.Id,
                                label: d.Code
                            }))}
                        />}

                        {errorGetKeyLists && !isLoadingKeyLists && 
                            <ErrorComponent 
                                error={errorGetKeyLists}
                                onReload={() => getAllKeyLists()}
                            />
                        }

                        
                    </Space>
                </Space>
            </Col>
        )
    }

    const removeVariant = (vi) => {
        let _variants = [...variableKeyVariants]

        _variants = _variants.filter((v, vii) => vii !== vi)

        setVariableKeyVariants(_variants)
    }

    const renderVariants = () => {
        return(
            <Col xs={16}>
                <Space size={'large'}>
                    <small className="default-gray">Variants</small>

                    <Tooltip
                        color="white"
                        title={<p>Click to add variant</p>}
                    >
                        <Button
                            size="small"

                            onClick={() => {
                                let _variants = [...variableKeyVariants]

                                _variants.push({
                                    latex:_variants.length+1 + ""
                                })

                                setVariableKeyVariants(_variants)
                            }}
                        >
                            <PlusOutlined style={{color:'green'}}/>
                        </Button>
                    </Tooltip>

                    {(variableKeyVariants.length === 1) && 
                    <Space>
                        <WarningTwoTone size={'large'} twoToneColor={'orange'}/>
                        <p className="default-gray">Having a single variante is <strong> not </strong> advisable. Better use a <strong>numeric key</strong> type.</p>
                    </Space>
                    }
                </Space>

                <br/>
                <br/>
                {variableKeyVariants.map((v, vi) => {

                    return(
                        <div key={vi} className="hq-full-width">
                            <Space >

                                &nbsp;
                                <Tooltip
                                    color="white"
                                    placement="top"
                                    title={<p>Delete variant</p>}
                                >
                                    <CloseCircleFilled 
                                        onClick={() => removeVariant(vi)}
                                        style={{color:'red', cursor:'pointer'}}
                                    />
                                </Tooltip>
                                 &nbsp;

                                <p className="default-gray">{vi+1}</p>

                                <Input 
                                    placeholder="LaTeX"
                                    value={v.latex}
                                    onChange={(v) => {
                                        let _variants = [...variableKeyVariants]

                                        _variants[vi].latex = v.target.value

                                        setVariableKeyVariants(_variants)
                                    }}

                                    className="add-variable-key-variant-input-width"
                                />

                                <LatexRenderer 
                                    latex={"$$" + v.latex + "$$"}
                                    className="hq-element-container"
                                />
                            </Space>
                            <br/>
                        </div>  
                    )
                })}
            </Col>
        )
    }

    const validateKey = () => {
        if(!newCode.trim()){
            return <p>Please add code</p>
        }

        if(!newLatex.trim()){
            return <p>Please add LaTeX</p>
        }

        if(!selectedList){
            return <p>Please add code</p>
        }

        if(isVariableKey && !variableKeyVariants.length){
            return (
                <div>
                    <Space direction="vertical">
                        <p>Please add atleast one variant of the variable key</p>
                        <p>e.g.</p>

                        <small className="default-gray">LaTex</small>
                        <Space>
                            
                            <LatexRenderer latex={'$$\\phi_{xy}$$'} className="default-black"/>
                        </Space>

                        <small className="default-gray">Variants</small>
                        <Space>                            
                            <LatexRenderer latex={'$$\\phi_{11}$$'} className="default-black"/>
                            <LatexRenderer latex={'$$\\phi_{12}$$'} className="default-black"/>
                            <LatexRenderer latex={'$$\\phi_{22}$$'} className="default-black"/>
                            <LatexRenderer latex={'$$\\phi_{21}$$'} className="default-black"/>
                        </Space>
                    </Space>
                </div>
            )
        }

        if(isVariableKey && variableKeyVariants.length){
            const latexs = variableKeyVariants.map(v => v.latex.trim())

            if(latexs.includes("") || latexs.includes(null)){
                return <p>Some variants are empty</p>
            }

            if(getUniqueValues(latexs).length !== latexs.length){
                return <p>Some variants are repeated</p>
            }
        }

        return null
    }

    const keyValidation = validateKey()

    return(
        <PagesWrapper>
            {contextHolder}
            <Divider orientation="left">
                <Space size={'large'}>
                    <p>Add new key</p>

                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            if(keyValidation){
                                return
                            }

                            if(isVariableKey){
                                const VM = ({
                                    Code: newCode,
                                    TextPresentation: newLatex,
                                    VariablesChars: [],
                                    KeysListId: selectedList.Id,
                                    Images: variableKeyVariants.map(a => a.latex)
                                })

                                addKey(VM, true).then(r => handleResponse(r, api, 'Key added successfully', 1))
                            }
                            else{
                                const VM = ({
                                    Code: newCode,
                                    TextPresentation: newLatex,
                                    KeysListId: selectedList.Id
                                })

                                addKey(VM).then(r => handleResponse(r, api, 'Key added successfully', 1))
                            }
                        }}
                        loading={isLoadingAddKey}
                    >
                        Add key
                    </Button>

                    {(!keyValidation ? 
                        <CheckCircleFilled style={{color:'green'}}/> 
                        : 
                        <Tooltip 
                            color="white"
                            title={keyValidation}
                        >
                            <CloseCircleTwoTone twoToneColor={'red'}/>
                        </Tooltip>)}
                </Space>
            </Divider>

            <Row gutter={4}>
                {renderMetaData()}
                <Col xs={2} />
                {isVariableKey && renderVariants()}
            </Row>
        </PagesWrapper>
    )
}