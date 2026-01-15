import {Button, Drawer, Space, message, Form, Select, Skeleton, List} from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useMaps } from "../../../../contexts/MapsContext";
import { useCourses } from "../../../../contexts/CoursesContext";
import { useEffect } from "react";
import { handleResponse } from "../../../../services/Auxillary";

export function AttachMapToElement({open, onClose, element, reloadMap}){
    
    if(!open) return <div/>;

    const {loadingAttachMapToElement, attachMapToElement,} = useMaps()

    const {courses, loadingCourse, Course: courseWithMaps, getCourseView} = useCourses()

    const [selectedCourse, setSelectedCourse] = useState(null)
    const [selectedMap, setSelectedMap] = useState(null)

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            setSelectedCourse(null)
            setSelectedMap(null)
        }
    }, [open])

    useEffect(() => {
        if(selectedCourse){
            getCourseView(selectedCourse.Id)
        }
    }, [selectedCourse])

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
            <Space>
                <p>Attach map to element {' '}{element.Title}</p>

                <Button
                    size="small"
                    type="primary"
                    loading={loadingAttachMapToElement}
                    onClick={() => {
                        if(!selectedMap){
                            api.destroy()
                            api.warning('Please select a map')

                            return
                        }

                        const data = new FormData()
                        data.append('ElementId', element.Id)
                        data.append('MapId', selectedMap.Id)

                        attachMapToElement(data)
                        .then(r => 
                            handleResponse(
                                r,
                                api,
                                'Attached successfuly',
                                1,
                                () => {
                                    reloadMap()
                                    onClose()
                                })
                        )
                    }}
                >
                    Assign
                </Button>
            </Space>}
            width={'40%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
            <Form>
                <Form.Item>
                    <small className="default-gray">Course</small>
                    <Select
                            
                        onChange={(v, option) => {
                            const findCourse = courses.filter(l => l.Id === option.value)[0]

                            setSelectedCourse(findCourse)
                            setSelectedMap(null)
                        }}
                        
                        defaultValue={'please select'}
                        value={(selectedCourse || {'Name': 'please select'}).Name}

                        options={(courses || []).map((d) => ({
                            value: d.Id,
                            label: d.Name
                        }))}
                    />
                </Form.Item>
            </Form>

            {loadingCourse && <Skeleton />}

            {courseWithMaps && !(loadingCourse) && selectedCourse &&
            <List 
                dataSource={courseWithMaps.CourseMaps}
                renderItem={(m, mi) => {
                    const isSelected = selectedMap && (selectedMap.Id === m.Id)

                    const {Title, LargeMapURL} = m
                    return(
                        <div 
                        onClick={() => setSelectedMap(m)}
                        className={"hq-element-container hoverable hq-full-width" + (isSelected ? " hq-element-higlighted" : "")}>
                            <Space>
                                <p className="default-gray">{mi+1}</p>
                                <p className={isSelected ? "default-title" : ""}>{Title}</p>
                            </Space>

                            <img 
                                alt={Title}
                                src={LargeMapURL}
                                className="attach-map-to-element-img"
                            />
                        </div>
                    )
                }}
            />}
            </Drawer>
        </div>
    )
}