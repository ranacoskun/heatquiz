import React from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { Col, Divider, Dropdown, Row, Skeleton, Space, Spin, Tooltip, message } from "antd";
import { useParams } from "react-router-dom";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { useKeyboard } from "../../../contexts/KeyboardContext";
import { useEffect } from "react";
import { beautifyDate, handleResponse } from "../../../services/Auxillary";
import { ViewKeyboardAssignedQuestions } from "../List/ViewKeyboardAssignedQuestions";
import { EditOutlined, EyeOutlined, DeleteOutlined  } from '@ant-design/icons';
import { useState } from "react";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { NUMERIC_KEY, VARIABLE_KEY } from "../../../Components/Keyboard/constants";
import { EditKeyboardName } from "./EditKeyboardName";
import { ViewKeyConnectedQuestions } from "./ViewKeyConnectedQuestions";

export function KeyboardEditView(){

    const { 
        isLoadingKeyboard, errorGetKeyboard, Keyboard, getKeyboard,
        isLoadingSwabKeyboardKeys, swabKeyboardKeys
    } = useKeyboard()

    const [api, contextHolder] = message.useMessage()

    const [showKeyboardAssignedQuestions, setShowKeyboardAssignedQuestions] = useState(false)
    const [showEditKeyboardName, setShowEditKeyboardName] = useState(false)

    const [showKeyQuestions, setShowKeyQuestions] = useState(false)
    const [selectedKey, setSelectedKey] = useState(null)
    const [selectedKeySecond, setSelectedKeySecond] = useState(null)


    const {id} = useParams()

    useEffect(() => {
        getKeyboard(id)
    }, [id])

    const renderKeyboardHeader = () => {
        const {Name, AddedByName, DateCreated} = Keyboard
        return(
            <div>
                <Space direction="vertical">
                    <Dropdown
                        menu={{
                            title:'Actions',
                            items:[
                            {
                                key:'edit_keyboard_name',
                                label:'Update name',
                                icon: <EditOutlined />,
                                onClick: () => setShowEditKeyboardName(true)
                            },
                            {
                                key:'view_keyboard_questions',
                                label:'View questions',
                                icon: <EyeOutlined />,
                                onClick: () => setShowKeyboardAssignedQuestions(true)
                            }]
                        }}
                    >
                        <p className="default-title hoverable default-large">{Name}</p>
                    </Dropdown>
                    
                    <div>
                        <p className="default-gray">{AddedByName}</p>
                        <p className="default-gray">{beautifyDate(DateCreated)}</p>
                    </div>
                </Space>
            </div>
        )
    }

    const renderKeyboardBody = () => {
        const {NumericKeys, VariableKeys} = Keyboard

        const keys = [...NumericKeys.map((k) => ({...k, Type: NUMERIC_KEY})), ...VariableKeys.map((k) => ({...k, Type: VARIABLE_KEY}))]
        .sort((a, b) => (a.Order >= b.Order) ? 1 : -1)

        return(
            <div className="hq-full-width">
                <Space>
                    <div 
                        className="keyboard-key-item"
                    >
                        <small className="default-gray keyboard-key-item-inner"> Numeric key </small>
                    </div>
                    <div 
                        className="keyboard-key-item keyboard-key-item-variable"
                    >
                        <small className="default-gray keyboard-key-item-inner">Variable key </small>
                    </div>
                </Space>

                <br/>
                <br/>

                <Row
                    gutter={[16,16]}
                >
                    {keys.map((k, ki) => {
                            const {Id, Type} = k
                            const isNumeric = Type === NUMERIC_KEY

                            const latexFormula = (k.NumericKey || k.VariableKey).TextPresentation

                            const isSelectedForMove = ((selectedKey || {}).Id === Id)
                            const isSelectedForMoveSecond = ((selectedKeySecond || {}).Id === Id)

                            const isBeingMoved = (isSelectedForMove || isSelectedForMoveSecond)

                            return(
                                <Col
                                    key={ki}
                                >
                                    <Space>
                                        <small className="default-title">{ki+1}</small>
                                    </Space>

                                    <Tooltip
                                        placement="top"
                                        color="white"
                                        title={!selectedKey ? <p>Click to swap</p> : <p>Click here to swap with the other key </p>}
                                    >
                                        <Dropdown
                                            menu={{
                                                title:'Actions',
                                                items:[
                                                    {
                                                        key:'view_key_questions',
                                                        label:'View questions using the key',
                                                        icon: <EyeOutlined />,
                                                        onClick: () => {
                                                            setSelectedKey(({...k, TextPresentation: latexFormula}))
                                                            setShowKeyQuestions(true)
                                                        }
                                                    },{
                                                    key:'remove_key',
                                                    label:'Remove key',
                                                    icon: <DeleteOutlined />,
                                                    onClick: () => {

                                                    }
                                                }]
                                            }}
                                        >
                                            <div 
                                                onClick={() => {
                                                    if(selectedKey && selectedKey.Id !== Id){
                                                        setSelectedKeySecond(k)

                                                        const VM = ({
                                                            KeyboardId: Keyboard.Id,
                                                            FirstKeyId: (selectedKey.NumericKey || selectedKey.VariableKey).Id,
                                                            IsFirstNumeric: selectedKey.Type === NUMERIC_KEY,
                                                            SecondKeyId: (k.NumericKey || k.VariableKey).Id,
                                                            IsSecondNumeric: (k.Type === NUMERIC_KEY),
                                                        })

                                                        swabKeyboardKeys(VM).then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                                                            getKeyboard(id)
                                                            setSelectedKey(null)
                                                            setSelectedKeySecond(null)
                                                        }))
                                                    }
                                                    else if (selectedKey && selectedKey.Id === Id){
                                                        setSelectedKey(null)
                                                    }
                                                    else{
                                                        setSelectedKey(k)
                                                    }
                                                }}
                                                className={"keyboard-key-item" + (isNumeric ? "" : " keyboard-key-item-variable")}
                                            >
                                                <div
                                                    className="keyboard-key-item-inner"
                                                >
                                                    {isBeingMoved  && isLoadingSwabKeyboardKeys ? 
                                                    <Spin />:
                                                    <LatexRenderer 
                                                        latex={"$$" + latexFormula + "$$"} 
                                                        className={isBeingMoved ? "default-red" : ""}
                                                    />}
                                                </div>
                                            </div>
                                        </Dropdown>
                                    </Tooltip>
                                </Col>
                            )
                        })}                
                </Row>
            </div>
        )
    }

    const renderKeyboard = () => {

        return(
            <div>
                {renderKeyboardHeader()}
                <Divider/>
                {renderKeyboardBody()}
            </div>
        )
    }

    return(
        <PagesWrapper>
            {contextHolder}

            {isLoadingKeyboard && <Skeleton />}
            {!isLoadingKeyboard && Keyboard && renderKeyboard()}

            {errorGetKeyboard && !isLoadingKeyboard && 
                <ErrorComponent 
                    error={errorGetKeyboard}
                    onReload={() => getKeyboard(id)}
                />
            }

            <ViewKeyboardAssignedQuestions 
                open={showKeyboardAssignedQuestions}
                onClose={() => setShowKeyboardAssignedQuestions(false)}
                keyboard={Keyboard}    
            />

            <ViewKeyConnectedQuestions 
                open={showKeyQuestions}
                onClose={() => {
                    setSelectedKey(null)
                    setSelectedKeySecond(null)
                    setShowKeyQuestions(false)
                }}
                selectedKey={selectedKey} 
            />

            <EditKeyboardName 
                open={showEditKeyboardName}
                onClose={() => setShowEditKeyboardName(false)}
                keyboard={Keyboard} 
                
                reloadData={() => getKeyboard(id)}
            />
        </PagesWrapper>
    )
}