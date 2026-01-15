import {Button, Drawer, Space, message,Input, Select, Divider, Tooltip} from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined, PlusOutlined, CloseCircleFilled} from '@ant-design/icons';
import { useMaps } from "../../../../contexts/MapsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function AssignRelationshipToElement({open, onClose, element, elements, reloadMap}){
    
    if(!open) return <div/>;

    const {loadingAssignRelationsToMapElement, assignRelationsToMapElement} = useMaps()

    const [selectedElements, setSelectedElements] = useState([])

    const [api, contextHolder] = message.useMessage()

    const existingSelectedElements = element.Relations

    const selectableElements = elements.filter(a => a.Id !== element.Id && a.QuestionSeries)

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
            <Space>
                <p>Assign relations to element {' '}{element.Title}</p>

                <Button
                    size="small"
                    type="primary"
                    loading={loadingAssignRelationsToMapElement}
                    onClick={() => {
                        if(!selectedElements.length){
                            api.destroy()
                            api.warning("Please add relations")

                            return
                        }

                        if(selectedElements.filter(a => !a.selectedElement).length){
                            api.destroy()
                            api.warning("All relations need to specify a required element")

                            return
                        }

                        const data = new FormData()

                        data.append('BaseElementId', element.Id)

                        for(let e of selectedElements){
                            console.log(e.selectedElement.value)
                            data.append('RequiredElementsIds', e.selectedElement.value)
                        }

                        for(let e of selectedElements){
                            data.append('Thresholds', e.threshold)
                        }

                        assignRelationsToMapElement(data).then(r => handleResponse(r, api, 'Updated', 1, () => {
                            reloadMap()
                            onClose()
                        }))
                    }}
                >
                    Assign
                </Button>
            </Space>}
            width={'70%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
            <Space direction="vertical" align="start">
                <p>Existing relations</p>
                {existingSelectedElements.map((r, ri) => {
                    const {Id, Threshold, RequiredElementId} = r
                    const RequiredElement = elements.filter(a => a.Id === RequiredElementId)[0]
                    
                    const {Title} = RequiredElement

                    return(
                    <div 
                        key={Id}
                        className="hq-full-width"
                    >
                        <Space>
                            <p className="default-gray">{ri+1}</p>
                            <p className="default-title">{Title}</p>
                            <p className="default-gray">@{Threshold}%</p>
                        </Space>
                    </div>
                    )
                })}
            </Space>
            <Divider />
            <Space
                className="hq-clickable"
                onClick={() => {
                    if(selectedElements.length === selectableElements.length)
                    {
                        return
                    }

                    const newRelation = ({
                        selectedElement:null,
                        threshold:1
                    })

                    setSelectedElements([...selectedElements, newRelation])
                }}
            >
                <PlusOutlined  style={{color:'green'}}/> 
                <p>Add relation</p>
            </Space>
            <br/>
            <br/>
            {selectedElements.map((e, ei) => {
                const {selectedElement, threshold} = e

                return(
                    <div
                        className="hq-full-width"
                        key={ei}
                    >
                        <Space>
                             &nbsp;
                            <Tooltip 
                                title={<p>Click to remove boundary condition</p>}
                                color="white"
                            >
                                <CloseCircleFilled 
                                    style={{cursor:'pointer', color:'red'}}

                                    onClick={() => {
                                        let _elements = [...selectedElements]

                                        _elements = _elements.filter((t, ti) => ei !== ti)

                                        setSelectedElements(_elements)
                                    }}
                                />
                            </Tooltip>
                            &nbsp;
                            <p className="default-gray">{ei+1}</p>

                            <Select
                            onChange={(v, option) => {
                                let _elements = [...selectedElements]

                                _elements[ei].selectedElement = option

                                setSelectedElements(_elements)
                            }}
                            defaultValue={{Id: -1, Title:'Please select'}}
                            value={(selectedElement || {Id: -1, Title:'Please select'})}
                            className='assign-relations-element-select-element'
                            options={
                            (selectableElements)
                            .filter(a => {
                                const isSelected = selectedElements.filter(s => s.selectedElement && s.selectedElement.value === a.Id)[0]

                                if(isSelected) return false

                                return true

                            }).map((d) => ({
                                value: d.Id,
                                label: d.Title
                                }))}
                            />

                            <Input 
                                type="number"

                                suffix={"Threshold (%)"}

                                value={threshold}

                                onChange={(v) => {
                                    const value = v.target.value

                                    if(value < 1 || value>100) return

                                    let _elements = [...selectedElements]

                                    _elements[ei].threshold = value
    
                                    setSelectedElements(_elements)

                                }}
                            />
                        </Space>

                        <br/>
                        <br/>
                    </div>
                ) 
            })}
            </Drawer>
        </div>
    )
}