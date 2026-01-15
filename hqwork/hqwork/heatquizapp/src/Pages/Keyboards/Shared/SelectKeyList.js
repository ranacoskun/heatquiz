import React, { useState } from "react";
import { useKeyboard } from "../../../contexts/KeyboardContext";
import { Col, Row, Skeleton, Space, Tooltip } from "antd";

import './SelectKeyboardList.css'
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { KeysSearchTool } from "./KeysSearchTool";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { useEffect } from "react";
import { NUMERIC_KEY } from "../../../Components/Keyboard/constants";

export function SelectKeyList({onSelect, existingKeys}){
    const {keys, errorGetKeys, isLoadingKeys} = useKeyboard()

    const [firstIndex, setFirstIndex] = useState(0)

    const [selectedKeys, setSelectedKeys] = useState([])

    useEffect(() => {
        setSelectedKeys([])
    }, [])

    useEffect(() => {
        onSelect(selectedKeys)
    }, [selectedKeys])

    const filterOutExistingKeys = (k) => {
        const exists = existingKeys.filter(a => a.Id === k.Id && a.Type === k.Type)

        return !exists
    }

    return(
        <div>
            <KeysSearchTool 
                onSetFirstIndex={(i) => setFirstIndex(i)}
            />

            <br/>
            {(isLoadingKeys) && <Skeleton />}
            {(!isLoadingKeys && keys) && 
            <Row
                gutter={24}
            >
                {keys.Keys
                //.filter(filterOutExistingKeys)
                .map((k, ki) => {
                    const {Id, Type, Code, TextPresentation, List, VarKeys} = k

                    const variants = VarKeys.map(a => a.TextPresentation)

                    const isSelected = (selectedKeys.filter(a => a.Id === Id && a.Type === Type).length)

                    return(
                        <Col 
                            xs={9}
                            key={Id}
                            className={"hoverable hq-full-width hq-element-container hq-clickable" + (isSelected ? " highlighted" : "")}
                            onClick={() => {
                                let _selectedKeys = [...selectedKeys]
                                
                                if(isSelected){
                                    _selectedKeys = _selectedKeys.filter(a => !(a.Id === Id && a.Type === NUMERIC_KEY))
                                }   
                                else{
                                    _selectedKeys.push(k)
                                }

                                setSelectedKeys(_selectedKeys)
                                
                            }}
                        >
                            <Space 
                                align="start"
                            >
                                <Space direction="vertical" align="start">
                                    <Space>
                                        <p className="default-gray">{ki + 1 + firstIndex}</p>
                                        <Space direction="vertical">
                                            <p className="default-title">{Code}</p>
                                            <p className="default-gray">{List}</p>
                                        </Space>
                                    </Space>
                                </Space>

                                &nbsp;
                                &nbsp;
                                &nbsp;

                                {Type === NUMERIC_KEY ?
                                <LatexRenderer
                                    latex={"$$" + TextPresentation + "$$"}
                                />
                                :
                                <Tooltip
                                    color="white"
                                    title={
                                        <div>
                                            <Row 
                                            gutter={[2,2]}
                                            className="hq-full-width" direction="vertical">
                                                {variants.map((v, vi) => 
                                                    <Col key={vi} className="hq-element-container">
                                                        <Space >
                                                            &nbsp;
                                                            &nbsp;
                                                            <LatexRenderer 
                                                                className={"default-black"}
                                                                latex={"$$" + v + "$$"}
                                                            />
                                                            &nbsp;
                                                            &nbsp;
                                                        </Space>
                                                    </Col>
                                                )}
                                            </Row>
                                        </div>
                                    }
                                >
                                    <Space>
                                        <LatexRenderer
                                            latex={"$$" + TextPresentation + "$$"}
                                        />
                                    </Space>
                                </Tooltip>
                                }
                            </Space>
                        </Col>
                    )
                })}
            </Row>}

            {errorGetKeys && !isLoadingKeys && 
                <ErrorComponent 
                    error={errorGetKeys}
                    onReload={() => window.location.reload()}
                />
            }
        </div>
    )
}