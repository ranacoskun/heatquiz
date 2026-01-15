import {Drawer} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { SelectKeyboardList } from "../../../Keyboards/Shared/SelectKeyboardList";

export function SelectKeyboard({open, onClose, onSelect}){

    if(!open) return <div/>;


    return(
        <Drawer
            title="Select keyboard"
            width={'100%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
        >
            <SelectKeyboardList 
                onSelect={onSelect}
            />
        </Drawer>
    )
}