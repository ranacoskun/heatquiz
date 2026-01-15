import { Button, Space } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export function ReportGraphicalStatistics({data, style}){

    const canvasRef = React.createRef()

    const [canvasWidth, setCanvasWidth] = useState(0)
    const [canvasHeight, setCanvasHeight] = useState(0)

    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)

    const [ctx, setCtx] = useState(0)

    const [showCorrectData, setShowCorrectData] = useState(false)

    const [dynamicRendering, setDynamicRendering] = useState(false)
    const [dynamicRenderingX, setDynamicRenderingX] = useState(0)

    useEffect(() => {
        const {width, height} = style

        setCanvasWidth(width)
        setCanvasHeight(height)
        
        setOffsetX(width*0.05)
        setOffsetY(height*0.05)

        setDynamicRendering(false)
    }, [style])

    useEffect(() => {
        if(canvasWidth && data){
            
            renderGraph()
        }
    }, [canvasWidth, data, dynamicRendering, dynamicRenderingX, showCorrectData])

    useEffect(() => {
        if(canvasRef){
            const _ctx = canvasRef.current.getContext('2d')

            if(_ctx){
                setCtx(_ctx)
            }
        }
    }, [canvasRef])

    //Function to calculate point position inside canvas
    const computePointInCanvas = (e) => {
        const {clientX, clientY} = e

        const boundingRect = canvasRef.current.getBoundingClientRect();
            return {
                x: Math.floor(clientX - boundingRect.left),
                y: Math.floor(clientY - boundingRect.top)
            }
    }    


    //Function to draw texts
    const drawText = (x, y, color, text, font) => {
        ctx.font = font|| "10px Arial";
        ctx.fillStyle = color || '#cccccc'
        ctx.fillText(text, x, y);
    }

    //Function to draw line
    const drawLine = (x1, y1, x2, y2, color, dashed = false) => {

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2,  y2);
        ctx.strokeStyle = color || 'gray';
        ctx.lineWidth = 1;

        if(dashed) ctx.setLineDash([5, 15]);
        ctx.stroke();

        ctx.setLineDash([]);
    }

    //Function to draw X Y axis
    const drawXYAxis = () => {
        //Draw X axis 
        drawLine(
            offsetX, canvasHeight - offsetY,
            canvasWidth - offsetX * 0.5, canvasHeight - offsetY,
            'black')

        //Draw Y axis 
        drawLine(
            offsetX, canvasHeight - offsetY,
            offsetX, offsetY* 0.5,
            'black')

        //Define plot name and labels
        ctx.save();
        ctx.translate(offsetX/4, canvasHeight*0.5);
        ctx.rotate(-Math.PI / 2);
        ctx.font =  "10px Arial";
        ctx.fillStyle = '#595959'
        ctx.fillText("Number of games played", 0, 0);
        ctx.restore();

        drawText(canvasWidth/2 - 10, canvasHeight, '#595959', 'Months')
    }

    //Function to calculate date labels positions
    const getDateLabelsPositions = (dates) => {
        const result = dates.reduce((r, date) => {

            const [year, month, day] = date.substr(0,10).split('-');
            const key = `${year}_${month}`;

            let monthName = new Date();
            monthName.setMonth(month - 1);

            monthName = monthName.toLocaleString('en-US', { month: 'long' });

            r[key] = r[key] || {month, year,monthName, dates: []};
            r[key].dates.push(day);
            return r;
          },{})

        return result
    }

    //Function to draw date labels
    const drawDateLabels = (normalData, datesData) => {

        const widthX = canvasWidth-2*offsetX
        const maxX = normalData.length - 1
        const stepX = widthX/maxX

        let datesLength = 0
        let dateLabels = getDateLabelsPositions(datesData)

        for(let k of Object.keys(dateLabels)){
            const nData = dateLabels[k].dates.length 

            let seperationLineX = (nData + datesLength - 1) * stepX + offsetX
            let prevSeperationLineX = (datesLength - 1) * stepX + offsetX

            drawLine(seperationLineX, offsetY, seperationLineX, canvasHeight - offsetY, '#cccccc', true)
            
            drawText((seperationLineX+prevSeperationLineX)/2, canvasHeight - offsetY/2, '#595959', k)

            datesLength += nData
        }
    }

    //Function to draw y axis values 
    const drawYTicks = (normalData) => {
        const maxY = Math.max(...normalData)

        const linesArray = [1, 2, 4]

        for(let l of linesArray){
            let value = Math.trunc(maxY/l)
            const stringLength = (value + "").length

            let y = offsetY + (canvasHeight - 2*offsetY) * (1-1/l)

            drawText(offsetX - 5*stringLength - 5, y - 3, '#0099cc', value)
            drawLine(offsetX - 10, y, offsetX, y, '#cccccc')
        }
    }

    //Function to draw a group of points of similar type
    const drawBatchPoints = (points, color, maxY) => {
        const widthX = canvasWidth-2*offsetX
        const maxX = points.length - 1
        
        const widthY = canvasHeight-2*offsetY

        const stepX = widthX/maxX

        for(let i =0; i <points.length; i++){
            let p = points[i]
            let x = i*stepX + offsetX
            
            let y =  (canvasHeight - 2*offsetY) - (p/maxY * widthY) + offsetY

            drawPoint(x, y, color)
        }
    }

    //Function to draw a point
    const drawPoint = (x, y, color = '#0099cc') => {
        ctx.strokeStyle = color;

        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x,y, 1, 0, 2 * Math.PI, true);
        ctx.fillStyle = color;
        ctx.fill();
    }


    //Function to draw dynamic data
    const drawNavigationInfo = (maxY, normalData, correctData, datesData) => {
        if(dynamicRenderingX < offsetX || dynamicRenderingX > (canvasWidth - offsetX)){
            return
        }

        const widthX = canvasWidth-2*offsetX
        const maxX = normalData.length - 1
        
        const widthY = canvasHeight-2*offsetY

        const stepX = widthX/maxX

        let x_i = Math.trunc((dynamicRenderingX - offsetX)/stepX) 

        let data = normalData[x_i]
        let dataCorrect = correctData[x_i]
        let date = datesData[x_i]

        drawLine(dynamicRenderingX, canvasHeight - offsetY, dynamicRenderingX, offsetY, 'rgba(0, 153, 204, 0.5)')

        let y =  (canvasHeight - 2*offsetY) - (data/maxY * widthY) + offsetY
        let yCorrect =  (canvasHeight - 2*offsetY) - (dataCorrect/maxY * widthY) + offsetY

        const successRate = dataCorrect ? (100*(dataCorrect/data)).toFixed(0) + "%" : ''

        drawText(offsetX + 5, y - 3, '#0099cc', data)
        drawLine(offsetX, y, x_i*stepX + offsetX, y, 'rgba(0, 153, 204, 0.5)')

        drawText(x_i*stepX + offsetX, canvasHeight + 15, '#0099cc', date.substr(0, 10))
        drawText(x_i*stepX + offsetX, canvasHeight + 30, '#0099cc', data)
        drawText(x_i*stepX + offsetX, canvasHeight + 45, 'green', dataCorrect + (dataCorrect ? " (" + successRate + ")": ""))

        if(showCorrectData){
            drawText(offsetX + 5, yCorrect - 3, 'green', dataCorrect + (dataCorrect ? " (" + successRate + ")": ""))
            drawLine(offsetX, yCorrect, x_i*stepX + offsetX, yCorrect, 'rgba(0, 153, 51, 0.5)')
        }
        
     
    }

    //Function to render the graph
    const renderGraph = () => {
        
        //Clear the rect
        ctx.clearRect(0,0, canvasWidth, canvasHeight * 1.1)

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight * 1.1);
        
        if(!ctx) return;

        const normalData = data.map((s) => s.Count)
        const correctData = data.map((s) => s.CountCorrect)
        const datesData = data.map((s) => s.Date)

        if(normalData.length<2) return;

        //Draw x - y - axis
        drawXYAxis()

        //Draw dates at x axis
        drawDateLabels(normalData, datesData)

        //Draw y axis labels
        drawYTicks(normalData)

        //Draw normal and correct points
        let maxY = Math.max(...normalData) || 1

        drawBatchPoints(normalData, '#0099cc', maxY)

        if(showCorrectData) drawBatchPoints(correctData, 'green', maxY);

        if(dynamicRendering){
            drawNavigationInfo(maxY, normalData, correctData, datesData)
        }

    }

    const onMouseEnter = (e) => {
        setDynamicRendering(true)
    }

    const onMouseLeave = (e) => {
        setDynamicRendering(false)
    }

    const onMouseMove = (e) => {
        const point = computePointInCanvas(e)
        setDynamicRenderingX(point.x)
    }

    const downloadGraph = () => {
        const canvas = document.getElementById("canvas")
        let canvasUrl = canvas.toDataURL();

        const createEl = document.createElement('a');
        createEl.href = canvasUrl;

        //Name of downloaded file
        createEl.download = "games_played_report";

        //Download
        createEl.click();
        createEl.remove();
    }

    return(
        <Space align="start">
            <canvas 
                ref={canvasRef}
                id="canvas"
                style = {{
                    ...style,
                    cursor: 'crosshair',
                    border:'1px solid #cccccc'
                }}

                width = {canvasWidth}
                height = {canvasHeight*1.1}

                onMouseEnter = {onMouseEnter}
                onMouseLeave = {onMouseLeave}
                onMouseMove = {onMouseMove}
            />

            <br/>
            <Space>
                <Button 
                    size="small"
                    type={"primary"}

                    onClick={() => setShowCorrectData(!showCorrectData)}
                >
                    {showCorrectData ? "Hide" : "Show"} correct data
                </Button>

                <Button 
                    size="small"
                    type={"primary"}

                    onClick={downloadGraph}
                >
                    Download graph
                </Button>
            </Space>
        </Space>
    )
}