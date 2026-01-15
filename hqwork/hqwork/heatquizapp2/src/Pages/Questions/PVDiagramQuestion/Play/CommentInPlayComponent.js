import React from "react"
import {InfoCircleTwoTone} from '@ant-design/icons';

import "./index.css"
import { Tooltip } from "antd";

export function CommentInPlayComponent({comment}){
    return(
        <div>
            <Tooltip
                color="white"
                title={<p>{comment}</p>}
                className="hq-clickable"
            >
                <InfoCircleTwoTone size="small"/>
            </Tooltip>
        </div>
        )
    }