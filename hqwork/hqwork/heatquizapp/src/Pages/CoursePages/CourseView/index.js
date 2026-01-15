import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PagesWrapper } from "../../../PagesWrapper";
import { useCourses } from "../../../contexts/CoursesContext";
import {Divider, Drawer, Dropdown, List, Space, Spin } from "antd";
import {StarFilled,EditOutlined, PlusOutlined, DeleteOutlined, TrophyOutlined, ProfileFilled, ArrowLeftOutlined} from '@ant-design/icons';

import './CourseView.css'
import { EditCourseNameThumbnail } from "../Shared/EditCourseNameThumbnail";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import Input from "antd/es/input/Input";
import { goToMapPlay } from "../../../services/Auxillary";

export function CourseView(){
    const { id } = useParams()
    const [showEditCourseModal, setShowEditCourseModal] = useState(false)

    const [searchCode, setSearchCode] = useState("")

    const [showMaps, setShowMaps] = useState(true)

    const [showAddBPR, setShowAddBPR] = useState(false)

    const [BPRCode, setBPRCode] = useState("")
    const [BPRMaps, setBPRMaps] = useState([])

    const [selectBPRMaps, setSelectBPRMaps] = useState(true)

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
        },
        {
          key: 'add_bpr',
          label: 'Add bonus points regime',
          icon: <PlusOutlined  />,
          onClick: () => {
            setShowAddBPR(true)
          }
        }
    ];

    const getMaps = () => {
        if(!Course) return [];

        const {CourseMaps} = Course

        if(!CourseMaps) return [];

        const maps = CourseMaps.filter((m) => {
            const search = searchCode.trim().toLowerCase()
            const {Title} = m
            return (Title.toLowerCase().includes(search))
        })

        return maps
    }

    const maps = getMaps()

    const addBPRModal = () => {
        if(!showAddBPR) return <div/>;

        return(
            <Drawer
                title={"Add Bonus Point Regime"}
                width={'100%'}
                onClose={() => setShowAddBPR(false)}
                open={showAddBPR}
                bodyStyle={{
                paddingBottom: 80,
                }}
                maskClosable={false}
                closeIcon={<ArrowLeftOutlined />}
            >
                <p className="default-title">Code</p>
                <Input 
                    type="text"
                    value={BPRCode}
                    className="course-view-map-bpr-code"
                    onChange={(v) => setBPRCode(v.target.value)}
                />
                <Divider/>
                <p className="default-title">Maps</p>
                <br/>
                <br/>
                {maps.map((m, mi) => {
                    const {Id, Title, LargeMapURL} = m
                    const isSelected = BPRMaps.map(a => a.Id).includes(Id)
                    return(
                        <div>
                            <Space align="start" size="large" className={isSelected ? "course-view-map-bpr-selected" : ""}>
                                <p className={!isSelected ? "default-gray" : "default-title"}>{mi+1}</p>
                                <Space direction="vertical" className="hq-clickable" onClick={() =>  {
                                    if(isSelected){
                                        let _maps = [...BPRMaps]

                                        _maps = _maps.filter(e => e.Id !== Id)

                                        setBPRMaps(_maps)
                                    }
                                    else{
                                        let _maps = [...BPRMaps]

                                        _maps.push({
                                            Id,
                                            StartDate: '',
                                            EndDate:'',
                                            Percentage:75
                                        })

                                        setBPRMaps(_maps)
                                    }
                                }}>
                                    <p className={!isSelected ? "default-gray" : "default-title"}>{Title}</p>
                                    <img 
                                        src={LargeMapURL}
                                        alt={Title}
                                        className="course-view-map-img-small"
                                    />
                                </Space>
                            </Space>
                            <Divider />
                        </div>
                    )
                })}
            </Drawer>)
    }

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
                    <Space align="center" size="large">
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
                        <Space direction="vertical">
                            <ProfileFilled 
                                title="Show maps"
                                onClick={() => setShowMaps(true)}
                                className={"hq-clickable "+(showMaps ? "default-title":"default-gray")}/>

                            <StarFilled 
                                title="Show bonus points regimes"   
                                onClick={() => setShowMaps(false)}
                                className={"hq-clickable "+(!showMaps ? "default-title":"default-gray")}/>
                        </Space>
                    </Space>
                </Divider>
                
                <Input 
                    type = "text"
                    placeholder={showMaps?"Search with a map's name":"Search with a bonus points regime's name"}
                    value={searchCode}
                    onChange = {(v) => setSearchCode(v.target.value)}
                    className="map-search-bar"
                /> 
                {showMaps? 
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 4,
                        xxl: 4,
                    }}
                    dataSource={maps}
                    
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
                            onClick: () => goToMapPlay(m)
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
                /> : <div/>}
                
            </div>}

            <EditCourseNameThumbnail 
                open={showEditCourseModal}
                selectedCourse={Course}
                onClose={() => setShowEditCourseModal(false)}
                reloadData={() => getCourseView(id)}
            />

            {addBPRModal()}
        </PagesWrapper>
    )
}