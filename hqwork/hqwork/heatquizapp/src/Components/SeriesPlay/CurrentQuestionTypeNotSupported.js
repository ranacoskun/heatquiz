import React from "react";
import {SettingOutlined} from '@ant-design/icons';
import { Space } from "antd";

export function CurrentQuestionTypeNotSupported(){

    return(
        <div className="series-q-not-supported">
            <p className="default-larger">This question type is not supported !</p>
        </div>
    )
}