import { Drawer } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { SeriesPlay } from "../../../Components/SeriesPlay";

export function SeriesPlayPocket({open, onClose, Code}){

    if(!open) return <div/>;

    return(
        <Drawer
        title="Play series"
        width={'100%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            <SeriesPlay 
                Code={Code}
            />
        </Drawer>
    )
}