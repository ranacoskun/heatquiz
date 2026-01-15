import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PagesWrapper } from "../../../PagesWrapper";
import { useCourses } from "../../../contexts/CoursesContext";
import {Divider, Dropdown, List, Space, Spin } from "antd";
import {EditOutlined, PlusOutlined, DeleteOutlined, TrophyOutlined} from '@ant-design/icons';

import './CourseView.css'
import { EditCourseNameThumbnail } from "../Shared/EditCourseNameThumbnail";
import { ErrorComponent } from "../../../Components/ErrorComponent";

export function CourseView(){
    const { id } = useParams()
    const [showEditCourseModal, setShowEditCourseModal] = useState(false)

    const navigate = useNavigate()

    const { loadingCourse, Course, getCourseView, getCourseError} = useCourses()

    useEffect(() => {
        getCourseView(id)
    }, [id])


    const courseActionsDropdownList = [
        {
          key: 'edit_course',
          label: 'Edit name / thumbnail',
          icon: <EditOutlined/>,
          onClick: () => setShowEditCourseModal(true)
        },
        {
          key: 'add_map',
          label: 'Add map',
          icon: <PlusOutlined  />,
          onClick: () => navigate('/add_map')
        }
    ];


    return(
        <PagesWrapper>
            {loadingCourse && 
            <Spin tip=". . . loading course . . ." size="large">
                <div className="loading-section"/>
            </Spin>}

            {getCourseError && !loadingCourse &&
             
                <ErrorComponent 
                    error={getCourseError}
                    
                    onReload={() =>  getCourseView(id)}
                />
            }

            {!loadingCourse && Course && 
            <div>
                <img 
                    src={Course.URL}
                    className="course-img"
                    alt={Course.Name}
                />
                <Divider orientation="left">
                    <Space>
                        <div className="course-card">
                            <Space 
                                className="course-card-internal" 
                                align="start"
                                direction="vertical"
                            >
                                <Space>
                                    <p className="course-title-view default-title">{Course.Name}</p>
                                    <div className="hoverable">
                                        <Dropdown
                                            
                                            menu={{
                                                items:courseActionsDropdownList,
                                                title:'Settings'
                                            }}
                                        > 
                                            <Space>
                                                <EditOutlined /><PlusOutlined  />
                                            </Space>
                                        </Dropdown>
                                    </div>
                                </Space>
                                <p>{Course.Code}</p>
                            </Space>
                        </div>
                    </Space>
                </Divider>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 3,
                        xxl: 3,
                    }}
                    dataSource={Course.CourseMaps}
                    
                    renderItem={(m, mi) => {
                       const mapActionsDropdownList = [{
                            key: 'edit_map',
                            label: 'Edit map',
                            icon: <EditOutlined/>,
                            onClick: () => navigate('/edit_view_map/'+m.Id)
                        },
                        {
                            key: 'play_map',
                            label: 'Play map',
                            icon: <TrophyOutlined style={{color:'green'}}/> ,
                            onClick: () => navigate('/playcoursemap/'+m.Id)
                        },
                        {
                            key: 'delete_map',
                            label: 'Delete map',
                            icon: <DeleteOutlined style={{color:'red'}}/>,
                            onClick: () => {}
                        }]

                        return(
                            <List.Item>
                                <div className="map-box">
                                    <div className="map-box-internal">
                                        <Space align="start">
                                            <p>{mi+1}</p>

                                            <div>
                                                <Dropdown
                                                    menu={{
                                                            items:mapActionsDropdownList,
                                                            title:'Actions'
                                                        }}
                                                >
                                                        <p 
                                                        title={m.Title}
                                                        className="hoverable-plus hq-shortened-text map-title">{m.Title}</p>
                                                </Dropdown>
                                                <p>{m.DateCreated.substring(0,10)}</p>
                                            </div>
                                        </Space>
                                        
                                    </div>
                                    <img 
                                        src={m.LargeMapURL}
                                        alt={m.Title}
                                        className="course-view-map-img"
                                        onClick={() => navigate('/playcoursemap/'+m.Id)}
                                    />
                                </div>

                            </List.Item>)
                    }}
                />
                
            </div>}

            <EditCourseNameThumbnail 
                open={showEditCourseModal}
                selectedCourse={Course}
                onClose={() => setShowEditCourseModal(false)}
                reloadData={() => getCourseView(id)}
            />
        </PagesWrapper>
    )
}