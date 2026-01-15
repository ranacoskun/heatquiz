import { Input, Space } from "antd";
import React, { useEffect, useState } from "react";

import './VectorDirectionComponent.css'

export function VectorDirectionComponent({widthHeight, currentAngle, onUpdateAngle, onUpdateAngleSafe, angleStep, hasTextEditor, noUpdate}){

    const [ctx, setCtx] = useState(null)

    const [angle, setAngle] = useState(0)
    const [anglePos1, setAnglePos1] = useState(0)
    const [anglePos2, setAnglePos2] = useState(0)

    const [isRotating, setIsRotating] = useState(false)

    const canvasRef = React.createRef()

    useEffect(() => {
        setAngle(currentAngle)

        if([null, undefined].includes(currentAngle)) setIsRotating(true)
    }, [])

    useEffect(() => {
        if(canvasRef){
            let ctx = canvasRef.current.getContext('2d')
            setCtx(ctx)
        }
    }, [canvasRef])


    useEffect(() => {
        if(ctx){
            draw()
        }

        if(onUpdateAngleSafe){
            onUpdateAngleSafe(angle)
        }
    }, [ctx, angle])

    //Function to calculate point position inside canvas
    const computePointInCanvas = (e) => {
        const {clientX, clientY} = e

        const boundingRect = canvasRef.current.getBoundingClientRect();
            return {
                x: Math.floor(clientX - boundingRect.left),
                y: Math.floor(clientY - boundingRect.top)
            }
    }

    const onClick = () => {
        if(noUpdate) return;

        if(!isRotating) {
            setIsRotating(true)

            return
        }
        else{
            setIsRotating(false)

            onUpdateAngle(angle)
        }


    }

    const onMove = (e) => {
        if(noUpdate) return;

        if(!isRotating) return;

            const point = computePointInCanvas(e);

            const x = point.x - widthHeight/2
            const y = widthHeight/2  -  point.y 

            let newAngle = Math.atan2(y, x) 
                        
            newAngle = (newAngle/Math.PI)*180
            newAngle += (newAngle<0) ? (360) :0

            newAngle = angleStep * Math.trunc(newAngle/angleStep)

            const clockwise = anglePos2 < anglePos1

            const newAngle2 = newAngle
            const newAngle1 = newAngle !== anglePos2 ? anglePos2 : anglePos1

            const latestAngle = clockwise ? (newAngle - 360) : newAngle
           
            setAngle(latestAngle)

            setAnglePos1(newAngle1)
            setAnglePos2(newAngle2)
    }

    const draw = () => {
        if(!ctx) return;

        let x = widthHeight/2 + widthHeight/2 * Math.cos(Math.PI * (angle/180))
        let y = widthHeight/2 - widthHeight/2 * Math.sin(Math.PI * (angle/180))

        ctx.clearRect(0,0, widthHeight, widthHeight);

        drawArrow(ctx, widthHeight/2, widthHeight/2, x, y, 2, 'red')

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(179, 179, 179, 0.5)';
        ctx.arc(widthHeight/2, widthHeight/2, 0.95*widthHeight/2, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.25)';
        
        const positiveAngle = (angle >= 0)
        const radAngle = (Math.PI/180) * Math.abs(angle)

        if(positiveAngle){
            ctx.arc(widthHeight/2, widthHeight/2, 0.5*widthHeight/2, 2*Math.PI - radAngle, 2*Math.PI);

        }
        else{
            ctx.arc(widthHeight/2, widthHeight/2, 0.5*widthHeight/2, 0, radAngle);
        }
        
        ctx.stroke();

        ctx.strokeStyle = 'rgba(179, 179, 179, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, widthHeight/2);
        ctx.lineTo(widthHeight, widthHeight/2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(widthHeight/2, 0);
        ctx.lineTo(widthHeight/2, widthHeight);
        ctx.stroke();  
    }

    const drawArrow = (ctx, fromx, fromy, tox, toy, arrowWidth, color) => {
        //variables to be used when creating the arrow
        var headlen = 10;
        var angle = Math.atan2(toy-fromy,tox-fromx);
     
        ctx.save();
        ctx.strokeStyle = color;
     
        //starting path of the arrow from the start square to the end square
        //and drawing the stroke
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.lineWidth = arrowWidth;
        ctx.stroke();
     
        //starting a new path from the head of the arrow to one of the sides of
        //the point
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                   toy-headlen*Math.sin(angle-Math.PI/7));
     
        //path from the side point of the arrow, to the other side point
        ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
                   toy-headlen*Math.sin(angle+Math.PI/7));
     
        //path from the side point back to the tip of the arrow, and then
        //again to the opposite side point
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                   toy-headlen*Math.sin(angle-Math.PI/7));
     
        //draws the paths created above
        ctx.stroke();
        ctx.restore();
    }

    return(
        <Space
            direction="vertical"
            align="center"
        >
            <canvas
                style = {{
                    height:widthHeight,
                    width:widthHeight,
                    cursor: isRotating ? 'move' : 'pointer'
                 }}

                width = {widthHeight}
                height = {widthHeight}

                ref = {canvasRef}

                onClick = {onClick}
                onMouseMove = {onMove}
            />
            {hasTextEditor ? 
            <Input 
                type="number"
                value={angle}
                onChange={(v) => {
                    const value = Number(v.target.value)

                    if(!Number.isInteger(value)) return;

                    if(value < -360 || value > 360) return;

                    setAngle(value)
                    onUpdateAngle(angle)
                }}

                className="angle-clock-input"

                suffix="°"
            />
            :<p className="default-gray default-small">{angle}°</p>}
        </Space>
    )
}