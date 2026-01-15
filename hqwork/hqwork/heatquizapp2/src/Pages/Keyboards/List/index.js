import React from "react"
import { PagesWrapper } from "../../../PagesWrapper"
import {Col, Divider, Dropdown, List, Row, Skeleton, Space} from "antd"
import { useState } from "react"

import { KeyboardsSearchTool } from "../Shared/KeyboardsSearchTool"
import { useKeyboard } from "../../../contexts/KeyboardContext"
import { ErrorComponent } from "../../../Components/ErrorComponent"
import { beautifyDate } from "../../../services/Auxillary"
import { LatexRenderer } from "../../../Components/LatexRenderer"
import { EditOutlined, EyeOutlined, DeleteOutlined  } from '@ant-design/icons';

import './index.css'
import { ViewKeyboardAssignedQuestions } from "./ViewKeyboardAssignedQuestions"
import { useNavigate } from "react-router-dom"

export function KeyboardsList(){
    const { isLoadingKeyboards, keyboards, errorGetKeyboards} = useKeyboard()

    const [firstIndex, setFirstIndex] = useState(0)

    const [showKeyboardAssignedQuestions, setShowKeyboardAssignedQuestions] = useState(false)
    const [selectedKeyboard, setSelectedKeyboard] = useState(null)

    const navigate = useNavigate()

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

    const keyboardActionList = (k) => [{
        key:'edit_view_keyboard',
        label:'Edit / View keyboard',
        icon: <EditOutlined/>,
        onClick: () => navigate('/keyboard_edit_view/' + k.Id)
    },
    {
        key:'view_keyboard_questions',
        label:'View questions',
        icon: <EyeOutlined />,
        onClick: () => {
            setSelectedKeyboard(k)
            setShowKeyboardAssignedQuestions(true)
        }
    },
    {
        key:'remove_keyboard',
        label:'Delete',
        icon: <DeleteOutlined />,
        onClick: () => {
            
        }
    }]

    const renderKeyboards = () => {
        return(
            <List 
                dataSource={keyboards.Keyboards}
                renderItem={(k, ki) => {
                    const {Id, Name, AddedByName, DateCreated} = k

                    return(
                        <div 
                            key={Id}
                            className="hq-element-container"
                        >
                            <Space
                                    align="start"
                            >
                                <p className="default-gray">{ki+firstIndex+1}</p>
                                    
                                <Space
                                    direction="vertical"
                                    align="start"
                                    className="keyboards-list-name"
                                >
                                    <Dropdown
                                        menu={{
                                            title:'Action',
                                            items:keyboardActionList(k)
                                        }}
                                    >
                                        <p className="hoverable-plus">{Name}</p>
                                    </Dropdown>
                                    <Space direction="vertical">
                                        <small className="default-gray">{AddedByName}</small>
                                        <small className="default-gray">{beautifyDate(DateCreated)}</small>
                                    </Space>
                                </Space>
                                <Space>
                                    {renderKeyboard(k)}
                                </Space>
                            </Space>
                        </div>
                    )
                }}
            />
        )
    }

    return(
        <PagesWrapper>
            <Divider orientation="left">
                Keyboards List
            </Divider>
            <KeyboardsSearchTool 
                onSetFirstIndex={(i) => setFirstIndex(i)}
            />

            <br/>

            {isLoadingKeyboards && <Skeleton />}
            {errorGetKeyboards && !isLoadingKeyboards && 
                <ErrorComponent 
                    error={errorGetKeyboards}
                    onReload={() => window.location.reload()}
                />
            }

            {!(isLoadingKeyboards || errorGetKeyboards) && keyboards && renderKeyboards()}
            
            <ViewKeyboardAssignedQuestions 
                open={showKeyboardAssignedQuestions}
                onClose={() => setShowKeyboardAssignedQuestions(false)}
                keyboard={selectedKeyboard}    
            />

        </PagesWrapper>
    )
}