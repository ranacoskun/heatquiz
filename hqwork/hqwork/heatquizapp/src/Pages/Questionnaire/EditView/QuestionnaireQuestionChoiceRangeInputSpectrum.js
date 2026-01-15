import React, { useEffect, useState } from "react";

export function QuestionnaireQuestionChoiceRangeInputSpectrum({start, end, step, data, total, style}){

    const canvasRef = React.createRef()

    const [ctx, setCtx] = useState(null)

    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)
    const [offsetY2, setOffsetY2] = useState(0)

    const [dashWidth, setDashWidth] = useState(3)

    const [dynamicRendering, setDynamicRendering] = useState(false)
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)

    const {width, height} = style

    useEffect(() => {
        if(canvasRef && canvasRef.current){
            const _ctx = canvasRef.current.getContext('2d')

            setCtx(_ctx)
            setOffsetY(25)
            setOffsetX(0.05 * width)
            setOffsetY2(0.1 * height)
        }
    }, [canvasRef, canvasRef && canvasRef.current])

    useEffect(() => {
        if(ctx){
            drawPlot()
        }
    }, [ctx, data, dynamicRendering, mouseX])

    //Function to draw text
    const drawText = (x, y, color, text, font) => {
        ctx.font = font|| "10px Arial";
        ctx.fillStyle = color || '#cccccc'
        ctx.fillText(text, x, height - y);
    }

    //Function to draw point
    const drawPoint = (x, y, color = '#0099cc') => {
        ctx.strokeStyle = color;

        ctx.beginPath();
        ctx.arc(x, height - y, 1, 0, 2 * Math.PI, true);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, height - y, 1, 0, 2 * Math.PI, true);
        ctx.fillStyle = color;
        ctx.fill();
    }

    //Function to draw line
    const drawLine = (x1, y1, x2, y2, color) => {
        ctx.beginPath();
        ctx.moveTo(x1,height - y1);
        ctx.lineTo(x2,height - y2);
        ctx.strokeStyle = color || 'orange';
        ctx.lineWidth = 1;
        ctx.stroke();

    }

    const drawRect = (x1, y1, w, h, color, borderColor) => {
        ctx.beginPath();
        ctx.fillStyle  = color;
        ctx.fillRect(x1,height-y1,w,-h); 
        ctx.closePath();

        if(borderColor){
            // the outline rectangle
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(x1,height-y1,w,-h)
        }
    }

    const drawPlot = () => {
        ctx.clearRect(0,0,width,height);

        drawRect(0,0,width,height,'white'); 

        drawText(offsetX/2, offsetY - 15, 'blue', start)
        drawText(width - offsetX *1.25 , offsetY - 15, 'blue', end)
      
        drawLine(offsetX,offsetY, width - offsetX, offsetY, 'gray')
        drawPoint(offsetX, offsetY, 'blue')
        drawPoint(width - offsetX, offsetY, 'blue')

        const maxCount = Math.max(...data.map(a => a.Count))
        const maxHeight = (0.8*height - 2 * offsetY2)

        const nSteps = Math.trunc((end - start)/step)

        const wStep = (width - offsetX * 2)/nSteps

        for(let i = 1; i < nSteps; i++) {

            const x = offsetX + (i) * wStep
            drawPoint(x, offsetY, 'gray')
        }

        for(const d of data){
            const {Text, Count} = d
            const v = parseFloat(Text)

            const xPosition = wStep * nSteps * ((v - start)/(end - start))  + offsetX
            const yPosition = maxHeight * (Count/maxCount) + offsetY

            drawPoint(xPosition, yPosition, 'green')
            drawRect(xPosition-dashWidth,offsetY,2*dashWidth+1,yPosition,'#e6ffe6','#008000'); 
        }

        if(dynamicRendering){
            drawLine(mouseX, offsetY, mouseX, height-offsetY, 'blue')
            const r = ((mouseX - offsetX)/(width - 2*offsetX))
            const v = r * (end - start) + start

            const diffMatrix = 
            data.map((a, ai) => ({...a, index: ai, diff:v - parseFloat(a.Text)}))
            .filter(a => a.diff > 0)
            .sort((a,b) => a.diff -b.diff) 
            
            const lowerV = diffMatrix[0]

            if(lowerV){
                const value = parseFloat(lowerV.Text)
                const count = lowerV.Count
                const perc = (100 * (count / total)).toFixed(0) + "%"

                drawText(5, height - offsetY + 10, 'blue', "{" + value + "}" + ":" + perc)

                const xPosition = wStep *nSteps* ((value - start)/(end - start))  + offsetX
                const yPosition = maxHeight * (count/maxCount) + offsetY
    
                drawPoint(xPosition, yPosition, 'red')
            }

            drawText(width/2, offsetY - 15, 'gray', "{" + v.toFixed(2) + "}")    
        }
    }

    const computePointInCanvas = (e) => {
        const {clientX, clientY} = e
        const boundingRect = canvasRef.current.getBoundingClientRect();

        return {
            x: Math.floor(clientX - boundingRect.left),
            y: Math.floor(clientY - boundingRect.top)
        }
    }

    const onMouseMove = (e) => {
        const {width} = style
        const point = computePointInCanvas(e)
        if((point.x >= offsetX || point.x <= (width-offsetX))){

            setMouseX(point.x)
        }
    }
    

    return(
        <div className="hq-full-width">
            <canvas 
                ref={canvasRef}
                style={{...style, cursor:'crosshair'}}
                width={width}
                height={height}

                onMouseEnter={() => setDynamicRendering(true)}
                onMouseLeave={() => setDynamicRendering(false)}

                onMouseMove={(e) => onMouseMove(e)}
            />
        </div>
    )
}