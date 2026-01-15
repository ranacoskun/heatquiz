import {Button, Drawer, Space, message, Form, Select, Skeleton, List} from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useMaps } from "../../../../contexts/MapsContext";
import { useCourses } from "../../../../contexts/CoursesContext";
import { useEffect } from "react";
import { handleResponse } from "../../../../services/Auxillary";

export function ReassignMap({open, onClose, map, reloadMap}){
    
    if(!open) return <div/>;

    const {loadingReassignMapToCourse, reassignMapToCourse} = useMaps()

    const {courses} = useCourses()

    const [selectedCourse, setSelectedCourse] = useState(null)

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            setSelectedCourse(null)
        }
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
            <Space>
                <p>Reassign map {' '}{map.Title}</p>

                <Button
                    size="small"
                    type="primary"
                    loading={loadingReassignMapToCourse}
                    onClick={() => {
                        if(!selectedCourse){
                            api.destroy()
                            api.warning('Please select a course')

                            return
                        }

                        const data = new FormData()

                        data.append('MapId', map.Id)
                        data.append('CourseId', selectedCourse.Id)

                        reassignMapToCourse(data).then(r => handleResponse(r, api, 'Reassigned successfully', 1, () => {
                            reloadMap()
                            onClose()
                        }))
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
            {selectedCourse && 
                <img 
                    className="hq-img-size-1"
                    alt="course"
                    src={selectedCourse.URL}
                />
            }         
            </Drawer>
        </div>
    )
}