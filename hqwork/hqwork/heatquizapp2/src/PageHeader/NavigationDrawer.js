import React, {useState } from "react";
import {MenuOutlined, BuildTwoTone, SettingTwoTone, IdcardTwoTone, ContactsTwoTone, SnippetsTwoTone, BellTwoTone, SoundTwoTone,DatabaseTwoTone, ContainerTwoTone, FlagTwoTone, AppstoreTwoTone, ControlTwoTone, SlidersTwoTone, PlusSquareTwoTone } from '@ant-design/icons';
import { Button, Drawer, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCourses } from "../contexts/CoursesContext";
import { useAuth } from "../contexts/AuthContext";

const NavigationDrawer = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState('dashboard')
    const {roles, isStudent,} = useAuth()

    const navigate = useNavigate()

    const {/*myCourses,*/ courses} = useCourses()

    const onChangePage = (e) => {        
        setCurrentPage(e.key)
        navigate(e.key)
        setDrawerOpen(false)
    }


    const iconStyle = ({fontSize:'150%'})

    const studentNavigationItems = [{
        label:'Dashboard',
        key:'/',
        icon: <BuildTwoTone style={{...iconStyle}}/>
    }]

    const adminNavigationItems = [{
        label:'Dashboard',
        key:'/',
        icon: <BuildTwoTone style={{...iconStyle}}/>
    },
    {
        label:'Users',
        key:'/users_list',
        icon: <ContactsTwoTone  style={{...iconStyle}}/>
    },,
    {
        label:'Level of difficulty',
        key:'/level_of_difficulty',
        icon: <SlidersTwoTone style={{...iconStyle}}/>
    },
    {
        label:'Datapools',
        key:'/datapools',
        icon: <DatabaseTwoTone  style={{...iconStyle}}/>
    }]

    const navigationItems = [{
        label:'Dashboard',
        key:'/',
        icon: <BuildTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Settings',
        key:'/settings',
        icon: <SettingTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Profile / Colleagues',
        key:'/profile',
        icon: <IdcardTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Reports',
        key:'/reports',
        icon: <SnippetsTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Courses',
        children:[
            {
                label:'Courses list',
                key:'/courses',
                icon:<DatabaseTwoTone style={{...iconStyle}}/>
            },
            ...(courses || []).map((c, ci) => 
            ({
                label:c.Name,
                key:'/viewcourse/'+c.Id,
                icon:<ContainerTwoTone   style={{...iconStyle}}/>
            })),
            {
                label:'Map',
                key:'/add_map',
                icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
            },
        ],
        type:'group'
    },    
    {
        label:'User comments',
        key:'/user_comments',
        icon: <BellTwoTone  style={{...iconStyle}}/>
    },    
    {
        label:'Student feedback',
        key:'/feedback',
        icon: <SoundTwoTone style={{...iconStyle}}/>
    },    
    {
        label:'Questions',
        children:[
        {
            label:'Questions list',
            key:'/questions_list',
            icon:<DatabaseTwoTone style={{...iconStyle}}/>
        },
        {
            label:'Clickable question',
            key:'/add_c_q',
            icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
        },
        {
            label:'Keyboard question',
            key:'/add_k_q',
            icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
        },
        {
            label:'Multiple choice question',
            key:'/add_mc_q',
            icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
        },
        {
            label:'Energy balance question',
            key:'/add_eb_q',
            icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
        },
        {
            label:'Freebody diagram question',
            key:'/add_fbd_q',
            icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
        },
        {
            label:'Diagram question',
            key:'/add_d_q',
            icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
        },
        {
            label:'PV-Diagram question',
            key:'/add_pvd_q',
            icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
        }
        ],
        type:'group'
    },    
    {
        label:'Keyboards',
        children:[
        {
            label:'Keyboards list',
            key:'/keyboards_list',
            icon:<DatabaseTwoTone style={{...iconStyle}}/>
        },
        {
            label:'Keyboard',
            key:'/add_keyboard',
            icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
        },
        {
            label:'Key lists',
            key:'/key_list_list',
            icon:<DatabaseTwoTone style={{...iconStyle}}/>
        },
        {
            label:'Keys',
            key:'/keys_list',
            icon:<DatabaseTwoTone style={{...iconStyle}}/>
        },
        {
            label:'Key',
            key:'/add_key',
            icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
        },
        ],
        type:'group'
    },
    {
        label:'Series',
        children:[
        {
            label:'Series list',
            key:'/series_list',
            icon:<DatabaseTwoTone style={{...iconStyle}}/>
        },
        {
            label:'Series',
            key:'/add_series',
            icon:<PlusSquareTwoTone  style={{...iconStyle}}/>
        }
        ],
        type:'group'
    }, 
    {
        label:'Auxilliary',
        children:[
            {
                label:'Map pop-up icons',
                key:'/map_click_images_list',
                icon:<DatabaseTwoTone style={{...iconStyle}}/>
            },
            {
                label:'Question explanations',
                key:'/information_list',
                icon:<DatabaseTwoTone style={{...iconStyle}}/>
            },
            {
                label:'Default images',
                key:'/default_images_list',
                icon:<DatabaseTwoTone style={{...iconStyle}}/>
            },
            {
                label:'Background images',
                key:'/background_images_list',
                icon:<DatabaseTwoTone style={{...iconStyle}}/>
            },
            {
                label:'Click trees',
                key:'/click_trees',
                icon: <AppstoreTwoTone   style={{...iconStyle}}/>
            },    
            {
                label:'Interpreted trees',
                key:'/interpreted_trees',
                icon: <ControlTwoTone     style={{...iconStyle}}/>
            },  
            {
                label:'Topics',
                key:'/topics',
                icon: <FlagTwoTone  style={{...iconStyle}}/>
            }
        ],
        type:'group'
    }
]   

    let navigationList = []
    const isAdmin = roles.includes('admin')
    const isNormalUser = roles.includes('course_editor')

    if(isStudent) navigationList = studentNavigationItems
    if(isAdmin) navigationList = adminNavigationItems
    if(isNormalUser) navigationList = navigationItems

    return(
        <div>
            <Button
                type="light"
                onClick = {() => setDrawerOpen(!drawerOpen)}
            >
                <MenuOutlined /> 
            </Button>
            <Drawer
                title="Pages"
                placement="left"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
            >
                <Menu 
                    onClick={onChangePage}
                    selectedKeys={[currentPage]}
                    mode="vertical"
                    theme="light"
                    items={navigationList} 
                />
            </Drawer>
        </div>
    )
}

export default NavigationDrawer;