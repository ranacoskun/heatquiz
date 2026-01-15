import {Divider, Drawer, Dropdown, Space} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import {TrophyOutlined, EditOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

export function SeriesRelations({open, onClose, Series}){

    if(!open) return <div/>;

    const navigate = useNavigate()

    const {MapElements} = Series

    const elementActionList = (e) => [{
        key: 'play_map',
        label: 'Play',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => navigate('/playcoursemap/'+e.Id)
    },
    {
        key: 'view_edit_map',
        label: 'View / edit map',
        icon: <EditOutlined/> ,
        onClick: () => navigate('/edit_view_map/'+e.Id)
    }]

    return(
        <Drawer
        title="Series relations"
        width={'40%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {MapElements.map((me) => {
                const {Map} = me
                return(
                    <div
                        className="hq-full-width"
                    >
                        <Space 
                            direction="vertical"
                        >
                                <Space 
                                    size={'large'}
                                    className="series-edit-view-element-other-info"
                                >
                                    <Dropdown
                                        menu={{
                                            items:elementActionList(Map),
                                            title:'Actions'
                                            }}
                                    >
                                        <p className="default-title hoverable">{Map.Title}</p>
                                    </Dropdown>
                                    <p>-</p>
                                    <p>{me.Title}</p>
                                </Space>
                                <img 
                                    alt={Map.Title}
                                    src={Map.LargeMapURL}
                                    className="series-relation-map-img"
                                />
                        </Space>
                        <Divider/>

                    </div>)
                
            })}
        </Drawer>
    )
}