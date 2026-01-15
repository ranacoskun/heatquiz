import { Button, Divider, Drawer, List, Select, Skeleton, Space, Spin, Tooltip, message } from "antd";
import React, {} from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useKeyboard } from "../../../../contexts/KeyboardContext";
import { useEffect } from "react";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useState } from "react";
import { NUMERIC_KEY, VARIABLE_KEY } from "../../../../Components/Keyboard/constants";
import { handleResponse } from "../../../../services/Auxillary";

export function ViewAssignedKeys({open, onClose, list, reloadData}){

    if(!open) return <div/>;

    const [messageApi, contextHolder] = message.useMessage();
    
    const {
        isLoadingKeyLists, keyLists, errorGetKeyLists, getAllKeyLists,
        getKeyListAssignedKeysResult: assignedKeys, errorGetKeyListAssignedKeys, isLoadingGetKeyListAssignedKeys, getKeyListAssignedKeys,
        isLoadingReassignKeysToList, reassignKeysToList
    } = useKeyboard()

    const [selectedReassignKeys, setSelectedReassignKeys] = useState([])

    const [selectedReassignList, setSelectedReassignList] = useState(null)

    useEffect(() => {
        if(open){
            getKeyListAssignedKeys(list)
        }
    }, [open])

    const renderAssignedKeysList = () => {
        const {NumericKeys, VariableKeys} = assignedKeys

        return(
            <div className="hq-full-width">
                <Divider><p>Numeric keys (<span className="default-title">{NumericKeys.length}</span>)</p></Divider>
                <List 
                    dataSource={NumericKeys}
                    renderItem={(k, ki) => {
                        const {Id, TextPresentation, Code} = k

                        const isSelected = (selectedReassignKeys.filter(a => a.Id === Id && a.Type === NUMERIC_KEY).length)
                        return(
                            <div 
                            key={ki}
                            className="hq-full-width">
                                <Space>
                                    <p className="default-gray">{ki+1}</p>
                                    
                                    <Tooltip
                                        color="white"
                                        title={<p>Click to select for <strong>Reassigning</strong> to another list</p>}
                                    >
                                        <Space 
                                            onClick={() => {
                                                let _selectedKeys = [...selectedReassignKeys]
                                                
                                                if(isSelected){
                                                    _selectedKeys = _selectedKeys.filter(a => !(a.Id === Id && a.Type === NUMERIC_KEY))
                                                }   
                                                else{
                                                    _selectedKeys.push({...k, Type:NUMERIC_KEY})
                                                }

                                                setSelectedReassignKeys(_selectedKeys)
                                            }}
                                            className={isSelected ? "highlighted" : "hoverable-plus"}
                                        >
                                            <p className="key-list-view-assigned-key-code">{Code}</p>
                                            &nbsp; 
                                            &nbsp; 
                                            <LatexRenderer 
                                                latex={"$$"+TextPresentation+"$$"}
                                            />
                                        </Space>
                                    </Tooltip>
                                </Space> 
                                <br/>
                                <br/>
                            </div>    
                        )
                    }} 
                />

                <Divider><p>Variable keys (<span className="default-title">{VariableKeys.length}</span>)</p></Divider>
                <List 
                    dataSource={VariableKeys}
                    renderItem={(k, ki) => {
                        const {Id, TextPresentation, Code} = k
                        const isSelected = (selectedReassignKeys.filter(a => a.Id === Id && a.Type === VARIABLE_KEY).length)

                        return(
                            <div className="hq-full-width">
                                <Space>
                                    <p className="default-gray">{ki + 1 + NumericKeys.length}</p>
                                    
                                    <Tooltip
                                        color="white"
                                        title={<p>Click to select for <strong>Reassigning</strong> to another list</p>}
                                    >
                                        <Space 
                                            onClick={() => {
                                                let _selectedKeys = [...selectedReassignKeys]
                                                
                                                if(isSelected){
                                                    _selectedKeys = _selectedKeys.filter(a => !(a.Id === Id && a.Type === VARIABLE_KEY))
                                                }   
                                                else{
                                                    _selectedKeys.push({...k, Type:VARIABLE_KEY})
                                                }

                                                setSelectedReassignKeys(_selectedKeys)
                                            }}
                                            className={isSelected ? "highlighted" : "hoverable-plus"}
                                        >
                                            <p className="key-list-view-assigned-key-code">{Code}</p>
                                            &nbsp; 
                                            &nbsp; 
                                            <LatexRenderer 
                                                latex={"$$"+TextPresentation+"$$"}
                                            />
                                        </Space>
                                    </Tooltip>
                                </Space> 
                            </div>    
                        )
                    }} 
                />
            </div>
        )
    }

    const renderAssignedKeys = () => {

        return(
            <div className="hq-full-width">
                {isLoadingGetKeyListAssignedKeys && <Skeleton />}

                {errorGetKeyListAssignedKeys && !isLoadingGetKeyListAssignedKeys && 
                    <ErrorComponent 
                        error={errorGetKeyListAssignedKeys}
                        onReload={() => getKeyListAssignedKeys(list)}
                    />
                }

                {!(isLoadingGetKeyListAssignedKeys && errorGetKeyListAssignedKeys) && assignedKeys && renderAssignedKeysList()}
            </div>
        )
    }

    const renderSelectedUnassignedKeys = () => {
        return(
            <div className="hq-element-container">
                <p className="default-title">Selected keys <strong>({selectedReassignKeys.length})</strong></p>
                {selectedReassignKeys.map((a, ai) => {
                    const {TextPresentation, Code} = a

                    return(
                        <div
                            key={ai}
                        >
                            <Space size={'large'}>
                                <p className="default-gray">{ai+1}</p>
                                <p className="default-gray">{Code}</p>
                                
                                <LatexRenderer 
                                    latex={"$$"+TextPresentation+"$$"}
                                    className={"default-black"}
                                />
                            </Space>
                        </div>    
                    )
                })}
            </div>
        )
    }

    const renderSelectNewList = () => {
        return(
            <div>
                {isLoadingKeyLists && <Spin />}
                        
                {keyLists && !isLoadingKeyLists &&
                    <Select
                        className="reassign-keys-select-list"
                        onChange={(v, option) => {
                            const findL = keyLists.filter(l => l.Id === option.value)[0]
                            setSelectedReassignList(findL)
                        }}
                        defaultValue={'please select'}
                        value={(selectedReassignList || {'Code': 'please select'}).Code}

                        options={(keyLists || [])
                            .filter(a => a.Id !== list.Id)
                            .map((d) => ({
                            value: d.Id,
                            label: d.Code
                        }))}
                    />}

                {errorGetKeyLists && !isLoadingKeyLists && 
                    <ErrorComponent 
                        error={errorGetKeyLists}
                        onReload={() => getAllKeyLists()}
                    />}
            </div>
        )
    }

    const renderReassignKeys = () => {
        return(
            <Space>
                <Tooltip
                    color="rgb(252, 252, 252)"
                    placement="bottom"
                    title={renderSelectedUnassignedKeys()}
                    overlayClassName="key-list-view-selected-unassign-key-list"
                >
                    <Button 
                        size="small"
                        type="primary"
                        onClick={() => {
                            if(!selectedReassignList){
                                messageApi.destroy()
                                message.warning("Please select a list")
                                return
                            }

                            const VM = ({
                                ...selectedReassignList,
                                NumericKeys: selectedReassignKeys.filter(a => a.Type === NUMERIC_KEY),
                                VariableKeys: selectedReassignKeys.filter(a => a.Type === VARIABLE_KEY),
                            })

                            console.log(VM)

                            reassignKeysToList(VM)
                            .then(r => handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                                onClose()
                                reloadData()
                            }))
                        }}  

                        loading={isLoadingReassignKeysToList}
                    >
                        Reassign selected keys
                    </Button>
                </Tooltip>

                {renderSelectNewList()}
            </Space>
        )
    }
    
    return(
        <div>
            {contextHolder}
            <Drawer
                title={
                    <Space size={'large'}>
                        <p>Assigned keys</p>
                        &nbsp; 
                        &nbsp; 
                        {selectedReassignKeys.length ? renderReassignKeys() : <div/>}
                    </Space>
                }
                width={'40%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}

                footer={
                    <Space size={'large'}>
                        <small className="default-gray">List</small>
                        <small className="default-title">{list.Code}</small>
                    </Space>
                }

                maskClosable={false}
            >
                {renderAssignedKeys()}
            </Drawer>
        </div>
    )
}