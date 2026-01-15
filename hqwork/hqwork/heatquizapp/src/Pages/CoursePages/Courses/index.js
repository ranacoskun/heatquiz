import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Dropdown, Row, Skeleton, Space } from "antd";
import {EditOutlined, ReconciliationOutlined, PlusOutlined} from '@ant-design/icons';

import './Courses.css'
import { useDatapools } from "../../../contexts/DatapoolsContext";
import { PagesWrapper } from "../../../PagesWrapper";
import {EditCourseNameThumbnail} from '../Shared/EditCourseNameThumbnail'
import {AddNewCourse} from '../Shared/AddNewCourse'
import { useCourses } from "../../../contexts/CoursesContext";
import { useNavigate } from "react-router-dom";
import { ErrorComponent } from "../../../Components/ErrorComponent";

export function Courses(){

    const [showEditCourseModal, setShowEditCourseModal] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState({})

    const [showAddCourseModal, setShowAddCourseModal] = useState(false)

    const { 
        loadingCourses,
        courses,
        getCoursesError,
        getCourses, 

        loadingMyCourses,
        myCourses,
        getMyCoursesError,
        getOwnedCourses
    } = useCourses()

    const {selectedDatapool} = useDatapools()

    const [showAllCourses, setShowAllCourses] = useState(true)

    const loadData = () => {
        if(showAllCourses) getCourses()
        else getOwnedCourses()
    }

    useEffect(() => {
        loadData()
        
    }, [selectedDatapool])

    const naviagate = useNavigate()

    const isLoading = (loadingCourses || loadingMyCourses)
    const loadingError = (getCoursesError || getMyCoursesError)
    const coursesList = (showAllCourses ? courses : myCourses)

    const actionsDropdownList = (c) => {
        return[
        {
          key: 'edit_name_picture',
          label: 'Edit name / thumbnail',
          icon: <EditOutlined/>,
          onClick: () => {
                setSelectedCourse(c)
                setShowEditCourseModal(true)
            }
        },
        {
          key: 'linked_keys',
          label: 'Maps',
          icon: <ReconciliationOutlined />,
          onClick: () => naviagate('/viewcourse/'+c.Id)
        }
    ]};

    return(
        <PagesWrapper>
            <Divider orientation="left">
                <Space>
                <span
                className="page-title"
                >Courses</span>
                <Button
                    type={showAllCourses ? 'primary' : 'default'}
                    onClick={() => {
                        getCourses()
                        setShowAllCourses(true)
                    }}
                >
                    Get all courses
                </Button>

                <Button
                    type={!showAllCourses ? 'primary' : 'default'}
                    onClick={() => {
                        getOwnedCourses()
                        setShowAllCourses(false)
                    }}
                >
                    Get my courses
                </Button>
                <Button
                    type={'default'}
                    onClick={() => {
                            setShowAddCourseModal(true)
                    }}
                >
                    <PlusOutlined style={{color:'green'}}/>
                    New course
                </Button>
                </Space>
            </Divider>

            <br/>
            {isLoading && <Skeleton />}

            {loadingError && !isLoading &&
             
                <ErrorComponent 
                    error={loadingError}
                    
                    onReload={() =>  loadData()}
                />
            }

            {!(isLoading || loadingError) && coursesList && 
            <Row gutter={[16, 32]}>
                {coursesList.map((c, ci) => 
                <Col 
                lg={{span:6}}
                md={{span:8}}
                sm={{span:12}}
                xs={{span:24}}
                key={c.Id}>
                    <div className="course-box">
                        <div className="course-box-internal">
                            <Space
                                align="start"
                            >
                                <p>{ci+1}</p>
                                <div>
                                    <Dropdown
                                        menu={{
                                            items:actionsDropdownList(c),
                                            title:'Actions'
                                        }}
                                    >
                                        <p  className="default-title hoverable" onClick={() => naviagate('/viewcourse/'+c.Id)}>{c.Name}</p>
                                    </Dropdown>

                                    <p className="course-code">{c.Code}</p>

                                    <br/>

                                    <p className="course-adder">{c.AddedByName}</p>
                                    <p className="course-date-created">{c.DateCreated.substring(0,10)}</p>
                                </div>
                            </Space>
                        </div>
                        <img 
                            src={c.URL}
                            alt="course logo"
                            className="course-logo"
                            onClick={() => naviagate('/viewcourse/'+c.Id)}
                        />
                    </div>
                </Col>
                )}
            </Row>
            }

            <EditCourseNameThumbnail 
                open={showEditCourseModal}
                selectedCourse={selectedCourse}
                onClose={() => {
                    setSelectedCourse({})
                    setShowEditCourseModal(false)
                }}

                reloadData={() => loadData()}
            />

            <AddNewCourse 
                open={showAddCourseModal}
                onClose={() => setShowAddCourseModal(false)}

                reloadData={() => loadData()}
            />
        </PagesWrapper>
    
)


}