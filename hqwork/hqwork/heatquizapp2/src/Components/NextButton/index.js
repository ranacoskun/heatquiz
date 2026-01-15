import { Button } from "antd";
import React from "react";
import {ForwardOutlined} from '@ant-design/icons';

export function NextButton({nextAction}){
    return(
        <Button
            onClick={() => nextAction()}
            icon = {<ForwardOutlined />}
            size="small"
        >
            Next              
        </Button>
    )
}