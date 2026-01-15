import Input from "antd/es/input/Input";
import React from "react";

export function AddCommentComponent({className, value, onChange}){

    return(
        <div>
            <Input 
                type="text"
                placeholder="comment"
                className={className}
                onChange= {(v) => onChange(v)}
                value={value}
            />
        </div>
    )
}