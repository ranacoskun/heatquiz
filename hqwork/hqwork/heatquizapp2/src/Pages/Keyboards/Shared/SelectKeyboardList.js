import React, { useState } from "react";
import { KeyboardsSearchTool } from "./KeyboardsSearchTool";
import { useKeyboard } from "../../../contexts/KeyboardContext";
import { Col, Row, Skeleton, Space } from "antd";

import './SelectKeyboardList.css'
import { beautifyDate } from "../../../services/Auxillary";
import { LatexRenderer } from "../../../Components/LatexRenderer";

export function SelectKeyboardList({onSelect}){
    const {
        isLoadingKeyboards, keyboards,
     } = useKeyboard()

    const [firstIndex, setFirstIndex] = useState(0)

    const isLoading = (isLoadingKeyboards)
    const data = (keyboards || {Keyboards:[]}).Keyboards

     const renderKeyboard = (k) => {
        const {NumericKeys, VariableKeys} = k

        const keys = [...NumericKeys, ...VariableKeys]
        .sort((a, b) => (a.Order >= b.Order) ? 1 : -1)

        return(
            <Row>
                {keys.map((k, ki) => {

                        const latexFormula = (k.NumericKey || k.VariableKey).TextPresentation

                        return(
                            <Col
                                key={ki}
                                className="keyboard-key-item"
                            >
                                <div
                                    className="keyboard-key-item-inner"
                                >
                                    <LatexRenderer 
                                        latex={"$$" + latexFormula + "$$"} 
                                    />
                                </div>
                            </Col>
                        )
                    })}                
            </Row>
        )
     }

    return(
        <div>
            <KeyboardsSearchTool 
                onSetFirstIndex={(i) => setFirstIndex(i)}
            />

            <br/>
            {(isLoading) && <Skeleton />}
            {(!isLoading && data) && 
            <Row
                gutter={24}
            >
                {data.map((k, ki) => {
                    const {Id, Name, AddedByName, DateCreated} = k
                    return(
                        <Col
                            key={Id}
                            xs={24}
                           
                        >
                            <Space  
                            align="center"
                            className="keyboard-search-list-container hoverable-plus"
                            size={'large'}

                            onClick={() => onSelect(k)}
                            >
                                <Space
                                    align="start"
                                >
                                    <p>{ki+firstIndex+1}</p>
                                    
                                    <Space
                                        direction="vertical"
                                        align="start"
                                    >
                                        <p>{Name}</p>
                                        <div className="keyboard-search-list-sub-info">
                                            <small className="default-gray">{AddedByName}</small>
                                            <small className="default-gray">{beautifyDate(DateCreated)}</small>
                                        </div>
                                    </Space>
                                </Space>
                                <Space>
                                    {renderKeyboard(k)}
                                </Space>
                            </Space>
                        </Col>
                    )
                })}
            </Row>}
        </div>
    )
}