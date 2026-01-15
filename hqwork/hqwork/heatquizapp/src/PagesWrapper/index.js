import React from "react";
import { Card } from "antd";
import './PagesWrapper.css'
import PageHeader from "../PageHeader";

export function PagesWrapper({children}){

    return(
        <div className="pages-wrapper">
            <PageHeader />
            <Card className="pages-wrapper-card">
                {children}
            </Card>
        </div>
       
    )
}