import {Drawer} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';

import { SelectSeriesList } from "../../../Series/List/SelectSeriesList";

export function SelectSeries({open, onClose, onSelect}){
    
    if(!open) return <div/>;

    return(
        <Drawer
        title="Select series for element"
        width={'100%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            <SelectSeriesList 
                onSelect={(s) => {
                    onSelect(s)
                }}
            />
        </Drawer>
    )
}