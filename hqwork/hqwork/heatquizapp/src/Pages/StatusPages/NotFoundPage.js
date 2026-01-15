import { Button, Result } from "antd"
import React from "react"
import { Link } from "react-router-dom"
import { PagesWrapper } from "../../PagesWrapper"

export function NotFoundPage(){
    return(
        <PagesWrapper>
            <Result 
            status="404"
            title="404"
            subTitle="Sorry, page not found!"
            extra = {
                <Button
                type="primary"
                >
                    <Link to={'/'}>
                        Go Dashboard
                    </Link>
                </Button>
            }
        />
        </PagesWrapper>
    )
}