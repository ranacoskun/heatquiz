import React, { useEffect, useState } from "react";
const SLIDER_POINT_RAD = 4

export function PlayInteractivePlot({width, height, OriginX, OriginY, title, sections}){

    const plotRef = React.createRef()

    const [ctx, setCtx] = useState(null)

    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const offset = 0.125*height

        setOffset(offset)

    }, [])

    useEffect(() => {
        if(plotRef){
            const _ctx = plotRef.current.getContext('2d')

            setCtx(_ctx)
        }
    }, [plotRef])




    return(
        <div 
            className="border border-danger"
           style = {{justifyContent:'center', width: width + SLIDER_POINT_RAD}}>
                <canvas

                    ref = {plotRef}

                        style = {{
                            ...style,
                            cursor: cursorType,
                            height:height + offset * 2,
                            width:width + SLIDER_POINT_RAD
                        }}

                        width = {width + SLIDER_POINT_RAD}
                        height = {height + offset * 2}


                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        onMouseMove={this.onMouseMove}
                        onClick = {this.onMouseClick}
                    />
                <p style = {{textAlign:'center', width:'100%'}}>{title}</p>
           </div> 
    )
}