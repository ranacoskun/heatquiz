import Input from "antd/es/input/Input"
import React from "react"
import "./index.css"

export function CommentComponent({onChange, value}){
    return(
        <div>
            <Input 
                type="text"
                placeholder="comment"
                className="add-q-pv-d-comment-input"
                onChange= {(v) => onChange(v)}
                value={value}
            />
        </div>
        )
    }