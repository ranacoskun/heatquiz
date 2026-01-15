import {Button, Drawer, message, Space, Select, Row, Col} from "antd";
import React, {useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useMaps } from "../../../../contexts/MapsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function AssignBadgesToElement({open, onClose, system, map, reloadMap}){
    
    if(!open) return <div/>;

    const [selectedElement, setSelectedElement] = useState(null)
    const [selectedBadges, setSelectedBadges] = useState([])

    const {loadingAssignBadgeSystemToElement, assignBadgeSystemToElement} = useMaps()

    const [api, contextHolder] = message.useMessage()

    const {Elements} = map
    const {Entities} = system
    const {Badges} = (selectedElement || {Badges:[]})

    console.log(selectedElement)

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
                <Space size={'large'}>
                    <p>Assign badges to element</p>

                    <Select
                        onChange={(v, option) => {
                            const findElement = Elements.filter(a => a.Id === option.value)[0]
                            setSelectedElement(findElement)
                            setSelectedBadges([])
                        }}
                        defaultValue={'please select'}
                        value={(selectedElement || {Title:'Please select'}).Title}
                        className="assign-badges-element-select-element"
                       
                        options={(Elements || []).map((d) => ({
                            value: d.Id,
                            label: d.Title
                            }))}
                        />

                    <Button 
                        size="small"
                        type="primary"
                        onClick={() => {
                            if(!selectedBadges.length){
                                api.destroy()
                                api.warning('Please select badges')
                                
                                return
                            }

                            const data = new FormData()
                            data.append("MapElementId", selectedElement.Id)
    
                            for (let b of selectedBadges) {
                                data.append('BadgeEntityIds', b.Id);
                            }

                            assignBadgeSystemToElement(data)
                            .then(r => handleResponse(
                                r,
                                api,
                                'Assigned successfuly',
                                1,
                                () => {
                                    reloadMap()
                                    onClose()
                                }))
                        }}

                        loading={loadingAssignBadgeSystemToElement}
                    >
                        Assign
                    </Button>
                </Space>
            }
            width={'70%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
                {selectedElement ? 
                <Row gutter={12}>
                    {Entities.map((e) => {
                        const {Id, URL, Progress} = e
                        const isSelected = selectedBadges.map(a => a.Id).includes(Id)
                        const selectable = !Badges.filter(b => b.Progress === Progress).length

                        return( 
                            <Col 
                            xs={6}
                            className={"hoverable map-element-inside-img hq-element-container" + (isSelected ? " assign-badges-element-selected-badge " : "") }
                            key={Id}
                            onClick={() => {
                                       
                                let _selectedBadges = [...selectedBadges]

                                if(isSelected){
                                    _selectedBadges = _selectedBadges.filter(a => a.Id !== Id)
                                }
                                else{
                                    _selectedBadges.push(e)
                                }

                                setSelectedBadges(_selectedBadges)

                            }}
                            >
                                <div
                                    className={(selectable ? "" : " assign-badges-element-non-selectable-badge")}
                                    
                                >
                                    <img 
                                        alt="badge"
                                        src={URL}
                                        className="assign-badges-element-badge-img"
                                    />
                                    <p className="default-gray default-smaller">{Progress}%</p>
                                    </div>
                                    {!selectable && <small className="default-red">Progress rate exists already for this element</small>}
                            </Col>
                        )
                    })}
                </Row> : 

                <Space>
                    <p className="defualt-green"><i>Please select an element</i></p>
                </Space>}
            </Drawer>
        </div>
    )
}