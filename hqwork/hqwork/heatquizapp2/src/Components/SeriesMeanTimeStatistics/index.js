import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import {Drawer, Skeleton, Space, Tooltip } from "antd";
import { useSeries } from "../../contexts/SeriesContext";
import { ErrorComponent } from "../ErrorComponent";
import { beautifyNumber } from "../../services/Auxillary";

export function SeriesMeanTimeStatistics({series, children, style}){

    const {seriesMedianTimeSpectrum: spectrum, isLoadingGetSeriesMedianTimeSpectrum: loading, errorGetSeriesMedianTimeSpectrum: error, getSeriesMedianTimeSpectrum} = useSeries()

    const [showModal, setShowModal] = useState(false)

    const [proccessedData, setProccessedData] = useState({})
    const [maxAccCount, setMaxAccCount] = useState(0)
    const [maxTime, setMaxTime] = useState(0)

    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)

    const [dynamicRendering, setDynamicRendering] = useState(false)
    const [dynamicLineX, setDynamicLineX] = useState(false)

    const [ctx, setCtx] = useState(null)

    const canvasRef = React.createRef()

    useEffect(() => {
        if(showModal){
            getSeriesMedianTimeSpectrum(series.Id)
        }
    }, [showModal])

    useEffect(() => {
        if(canvasRef && canvasRef.current){
            const _ctx = canvasRef.current.getContext('2d')

            setCtx(_ctx)
        }
    }, [canvasRef])

    useEffect(() => {
        if(ctx && spectrum){
            let proccessedData = {}
            let maxAccCount=0
            let maxTime = 0

            const {TimeSpectrum: timeSpectrum} = spectrum

            for(let i_t = 0; i_t < timeSpectrum.length; i_t++){
                let tData = timeSpectrum[i_t]
                const accCount =  timeSpectrum.slice(0, i_t+1).reduce((r, c) => r += c.Count, 0)
                proccessedData[tData.Time] = accCount

                if(i_t === (timeSpectrum.length-1)){
                    maxAccCount = accCount
                    maxTime = tData.Time
                }
            }

            setProccessedData(proccessedData)
            setMaxAccCount(maxAccCount)
            setMaxTime(maxTime)  
            
            const {width, height} = style

            setOffsetX(width * 0.075) 
            setOffsetY(height * 0.075)

            drawPlot()
        }
        }, [showModal, ctx, spectrum, maxTime])
    
    useEffect(() => {
        if(showModal) drawPlot()
    }, [dynamicRendering, dynamicLineX])

    //Function to draw axis
    const drawRefLines = () => {    
        const {width, height} = style
    
        ctx.beginPath();
        ctx.moveTo(offsetX, height/2 - offsetY);
        ctx.lineTo(width - offsetX,  height/2 - offsetY);
        ctx.strokeStyle = '#cccccc';
        ctx.stroke();
    
        ctx.beginPath();
        ctx.moveTo(offsetX, height - offsetY);
        ctx.lineTo(width - offsetX,  height - offsetY);
        ctx.strokeStyle = '#cccccc';
        ctx.stroke();
    }


    //Function to draw text
    const drawText = (x, y, color, text, font) => {
        ctx.font = font|| "10px Arial";
        ctx.fillStyle = color || '#cccccc'
        ctx.fillText(text, x, y);
    }

    //Function to draw point
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

    //Function to draw line
    const drawLine = (x1, y1, x2, y2, color) => {
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.strokeStyle = color || 'orange';
        ctx.lineWidth = 1;
        ctx.stroke();

    }


    //Function to draw time stamps for median time spectrum
    const drawTimeStamps = () => {
        const {width, height} = style
        const {MedianPlayTime: medianTime} = spectrum

        let drawColor = "blue"
        const drawColorLight = "#cccccc"

        //Draw median value 
        const minDrawTime = 0//Math.trunc(medianTime*0.2)
        let maxDrawTime = maxTime

        maxDrawTime = (maxTime > 5 * medianTime) ? (medianTime*5) : maxDrawTime

        drawText(width/2 - 5, height/2-offsetY + 15, 'blue', medianTime)
        drawLine(width/2, offsetY, width/2, height/2-offsetY + 5, 'rgba(140, 140, 140, 0.25)')
        
        drawText(width/2 - 5, height-offsetY + 15, 'blue', medianTime)
        drawLine(width/2, offsetY + height/2, width/2, height-offsetY + 5, 'rgba(140, 140, 140, 0.25)')
        
        const beforeMedianTimeStep =  (medianTime-minDrawTime)/5
        for(let i = 0; i < 5; i++){
            let pTime = Math.trunc((i * beforeMedianTimeStep) + minDrawTime)

            let x = (pTime - minDrawTime)/(medianTime - minDrawTime)
            x = offsetX + (x) * (0.5*width-offsetX)

            drawColor = (dynamicRendering && (dynamicLineX < x)) ? drawColorLight : drawColor

            drawLine(x, height/2-offsetY, x, height/2-offsetY + 5, '#cccccc')
            drawText(x - 5, height/2-offsetY + 15, drawColor, pTime.toFixed(0))

            drawLine(x, height-offsetY, x, height-offsetY + 5, '#cccccc')
            drawText(x - 5, height-offsetY + 15, drawColor, pTime.toFixed(0))

        
        }

        const afterMedianTimeStep =  (maxDrawTime-medianTime)/5
        for(let i = 0; i < 6; i++){
            let pTime = Math.trunc((i * afterMedianTimeStep) + medianTime)

            let x = (pTime - medianTime)/(maxDrawTime - medianTime)
            x = width/2 + (x) * (width*0.5-offsetX)

            drawColor = (dynamicRendering && (dynamicLineX < x)) ? drawColorLight : drawColor

            drawLine(x, height/2-offsetY, x, height/2-offsetY + 5, '#cccccc')
            drawText(x - 5, height/2-offsetY + 15, drawColor, pTime.toFixed(0))

            drawLine(x, height-offsetY, x, height-offsetY + 5, '#cccccc')
            drawText(x - 5, height-offsetY + 15, drawColor, pTime.toFixed(0))
        }

        //Word seconds
        drawText(width - offsetX +5, height/2-offsetY + 5, 'blue', "seconds")
        drawText(width - offsetX +5, height-offsetY + 5, 'blue', "seconds")

        if(dynamicRendering){
            let lineTime = 0

            if(dynamicLineX <= width/2){
                lineTime = (dynamicLineX - offsetX)/(0.5*width-offsetX) * (medianTime - minDrawTime) + minDrawTime
            }
            else{
                lineTime = (dynamicLineX - 0.5*width)/(width*0.5-offsetX) * (maxDrawTime - medianTime) + medianTime

            }

            drawText(dynamicLineX+2, height/2-offsetY + 15, 'blue', lineTime.toFixed(0))            
            drawText(dynamicLineX+2, height-offsetY + 15, 'blue', lineTime.toFixed(0))            
        }


    }

    //Function to draw spectrum for all points
    const drawNormalDataPoints = () => {
        const {width, height} = style

        const {TimeSpectrum: timeSpectrum, MedianPlayTime: medianTime, AvgPlayTime: avgTime} = spectrum

        const maxCount = Math.max(...timeSpectrum.map((a) => a.Count))
        const minTime = Math.min(...timeSpectrum.map((a) => a.Time))


        //Draw median value 
        const minDrawTime = 0
        let maxDrawTime = maxTime

        maxDrawTime = (maxTime > 5 * medianTime) ? (medianTime*5) : maxDrawTime

        const pointsAroundTheMedianTime  = timeSpectrum.filter((a) => a.Time >= minDrawTime && a.Time <= maxDrawTime)

        let countAtMedianTime = timeSpectrum.filter((a) => a.Time === medianTime)[0].Count
        
        let y = (countAtMedianTime)/maxCount
       
        y = (1 - y)*(height/2 - 2*offsetY) + offsetY
      
        drawPoint(width/2, y, 'red')
        drawText(width/2 - 5, offsetY - 15, 'rgb(89, 89, 89)', "medianTime: "+ medianTime.toFixed() + " s")

        for(let point of pointsAroundTheMedianTime){

            let pTime = (point.Time)
            let x = 0

            if(pTime < medianTime){
                
                x = (pTime - minDrawTime)/(medianTime - minDrawTime)
                x = offsetX + (x) * (0.5*width-offsetX)
               
            }
            else if(pTime>medianTime) {
                x = (pTime - medianTime)/(maxDrawTime - medianTime)
                x = width/2 + (x) * (width*0.5-offsetX)
            }
            else{
                continue
            }
           
            let y = (point.Count)/maxCount

            y = (1 - y)*(height/2 - 2*offsetY) + offsetY

            if(!dynamicRendering){
                drawPoint(x, y)
            }
            else{
                const isIncluded = x <= dynamicLineX

                drawPoint(x, y, isIncluded ? '#0099cc' : '#cccccc')
            }

        }

        //Draw the average line 
        let x = 0
       
        if(avgTime <= medianTime){
                
            x = (avgTime - minDrawTime)/(medianTime - minDrawTime)
            x = offsetX + (x) * (0.5*width-offsetX)
           
        }
        else if(avgTime>medianTime) {
            x = (avgTime - medianTime)/(maxDrawTime - medianTime)
            x = width/2 + (x) * (width*0.5-offsetX)
        }
      
        drawLine(x, height/2 + offsetY, x, offsetY, 'orange')
        drawLine(x, height - offsetY, x, height/2 + offsetY, 'orange')

        drawText(x - 5, offsetY - 15, 'rgb(89, 89, 89)', "avgTime: "+ avgTime.toFixed() + " s")

        drawText(15, - 5, 'rgb(89, 89, 89)', "maxCount: "+ maxCount)
        drawText(15, -15, 'rgb(89, 89, 89)', "maxTime: "+ maxTime.toFixed() + " s")
        drawText(15, - 25, 'rgb(89, 89, 89)', "minTime: "+ minTime.toFixed() + " s")


        ctx.save();
        ctx.translate(offsetX/2, height*0.35);
        ctx.rotate(-Math.PI / 2);
        ctx.font =  "10px Arial";
        ctx.fillStyle = '#0099cc'
        ctx.fillText("Play time vs Count", 0, 0);
        ctx.restore();
    }


    //Function to draw lines for frquency plot
    const drawNormalDataAccFreq = () => {
        const {width, height} = style

        const {TimeSpectrum: timeSpectrum, MedianPlayTime: medianTime} = spectrum        

        //Draw median value 
        const minDrawTime = 0
        let maxDrawTime = maxTime
        maxDrawTime = (maxTime > 5 * medianTime) ? (medianTime*5) : maxDrawTime

        const pointsAroundTheMedianTime  = timeSpectrum.filter((a) => a.Time >= minDrawTime && a.Time <= maxDrawTime)

        let frequencyAtMedianTime = proccessedData[medianTime]

        let y = (frequencyAtMedianTime)/maxAccCount
       
        y = (1 - y)*(height/2 - 2*offsetY) + offsetY + height/2
      
        drawPoint(width/2, y, 'red')

        for(let point of pointsAroundTheMedianTime){

            let pTime = (point.Time)
            let x = 0

            if(pTime < medianTime){
                
                x = (pTime - minDrawTime)/(medianTime - minDrawTime)
                x = offsetX + (x) * (0.5*width-offsetX)
               
            }
            else if(pTime>medianTime) {
                x = (pTime - medianTime)/(maxDrawTime - medianTime)
                x = width/2 + (x) * (width*0.5-offsetX)
            }
            else{
                continue
            }

            let y = (proccessedData[pTime])/maxAccCount

            y = (1 - y)*(height/2 - 2*offsetY) + offsetY + height/2

            if(!dynamicRendering){
                drawPoint(x, y)
            }
            else{
                const isIncluded = x <= dynamicLineX

                drawPoint(x, y, isIncluded ? '#0099cc' : '#cccccc')
            }

        }
       
        //Define plot name
        ctx.save();
        ctx.translate(offsetX/2, height*0.825);
        ctx.rotate(-Math.PI / 2);
        ctx.font =  "10px Arial";
        ctx.fillStyle = '#0099cc'
        ctx.fillText("Play time vs Accumulated frequency", 0, 0);
        ctx.restore();

        //Draw 50%,  100% lines
        drawLine(
            offsetX, offsetY + (height/2 - offsetY*2)*0.5 + height/2,
            width - offsetX, offsetY + (height/2 - offsetY*2)*0.5 + height/2,
            'rgba(0, 0, 0, 0.1)'
        )

        drawLine(
            offsetX, offsetY + height/2,
            width - offsetX, offsetY+ height/2,
            'rgba(0, 0, 0, 0.1)'
        )
    }

    //Function to draw frequency percentages
    const drawPercentageStampsNormal = () => {
        const {width, height} = style

        let drawColor = "#737373"
        const drawColorLight = "#cccccc"

        const drawColorWhite = "#cccccc"
        const {TimeSpectrum: timeSpectrum, MedianPlayTime: medianTime} = spectrum        

        const totalTimeSpectrumCount = timeSpectrum.reduce((r,c) => r += c.Count, 0)

        //Draw median value 
        const minDrawTime =0// Math.trunc(medianTime*0.2)
        let maxDrawTime = maxTime

        maxDrawTime = (maxTime > 5 * medianTime) ? (medianTime*5) : maxDrawTime
   
        const beforeMedianTimeStep =  (medianTime-minDrawTime)/5
        
        let Xs = []
        let Ts = []

        for(let i = 0; i < 5; i++){
            let pTime = Math.trunc((i * beforeMedianTimeStep) + minDrawTime)

            let x = (pTime - minDrawTime)/(medianTime - minDrawTime)
            x = offsetX + (x) * (0.5*width-offsetX)
            Xs.push(x)
            Ts.push(pTime)
        }
        let x =0
        let x_next = 0

        let pTime =0
        let pTime_next = 0

        let countForTimeRange =0
        let countForAccumulatedRange = 0

        let percentage = 0
        let percentageAcc = 0

     
        for(let i = 0; i < 4; i++){
            x = Xs[i]
            x_next = Xs[i+1]

            pTime = Ts[i]
            pTime_next = Ts[i+1]

            countForTimeRange = timeSpectrum
            .filter((a) => a.Time >= pTime && a.Time < pTime_next)
            .reduce((r,c) => r += c.Count, 0)

            countForAccumulatedRange = 
            timeSpectrum
            .filter((a) => a.Time <= pTime_next)
            .reduce((r,c) => r += c.Count, 0)

            percentage = (100*(countForTimeRange/totalTimeSpectrumCount)).toFixed(2) + "%"
            percentageAcc = (100*(countForAccumulatedRange/totalTimeSpectrumCount)).toFixed(2) + "%"

            drawColor = (dynamicRendering && (dynamicLineX < x_next)) ? drawColorLight : drawColor
            drawColor = (dynamicRendering && (dynamicLineX < x_next && dynamicLineX > x)) ? drawColorWhite : drawColor

            drawText(-10+ x_next, height/2-offsetY + 25, drawColor, percentageAcc)
            drawText(-10+ x_next, height/2-offsetY + 40, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

        }

        x = x_next
        pTime = pTime_next

        x_next = width/2
        pTime_next = medianTime

        countForTimeRange = timeSpectrum
            .filter((a) => a.Time >= pTime && a.Time < pTime_next)
            .reduce((r,c) => r += c.Count, 0)

        countForAccumulatedRange = 
            timeSpectrum
            .filter((a) => a.Time <= pTime_next)
            .reduce((r,c) => r += c.Count, 0)

        percentage = (100*(countForTimeRange/totalTimeSpectrumCount)).toFixed(2) + "%"
        percentageAcc = (100*(countForAccumulatedRange/totalTimeSpectrumCount)).toFixed(2) + "%"

        drawColor = (dynamicRendering && (dynamicLineX < x_next)) ? drawColorLight : drawColor
        drawColor = (dynamicRendering && (dynamicLineX < x_next && dynamicLineX > x)) ? drawColorWhite : drawColor

        drawText(-10+ x_next, height/2-offsetY + 25, drawColor, percentageAcc)
        drawText(-10+ x_next, height/2-offsetY + 40, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

        Xs = []
        Ts = []

        const afterMedianTimeStep =  (maxDrawTime-medianTime)/5
        for(let i = 0; i < 6; i++){
            let pTime = Math.trunc((i * afterMedianTimeStep) + medianTime)

            let x = (pTime - medianTime)/(maxDrawTime - medianTime)
            x = width/2 + (x) * (width*0.5-offsetX)

            Xs.push(x)
            Ts.push(pTime)
        }

        x =0
        x_next = 0

        pTime =0
        pTime_next = 0

        countForTimeRange =0
        countForAccumulatedRange = 0

        percentage = 0
        percentageAcc = 0

        for(let i = 0; i < 5; i++){
            x = Xs[i]
            x_next = Xs[i+1]

            pTime = Ts[i]
            pTime_next = Ts[i+1]

            countForTimeRange = timeSpectrum
            .filter((a) => a.Time >= pTime && a.Time < pTime_next)
            .reduce((r,c) => r += c.Count, 0)

            countForAccumulatedRange = 
            timeSpectrum
            .filter((a) => a.Time <= pTime_next)
            .reduce((r,c) => r += c.Count, 0)

            percentage = (100*(countForTimeRange/totalTimeSpectrumCount)).toFixed(2) + "%"
            percentageAcc = (100*(countForAccumulatedRange/totalTimeSpectrumCount)).toFixed(2) + "%"

            drawColor = (dynamicRendering && (dynamicLineX < x_next)) ? drawColorLight : drawColor
            drawColor = (dynamicRendering && (dynamicLineX < x_next && dynamicLineX > x)) ? drawColorWhite : drawColor

            drawText(-10+ x_next, height/2-offsetY + 25, drawColor, percentageAcc)
            drawText(-10+ x_next, height/2-offsetY + 40, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

        }

        if(dynamicRendering ){
            let lineTime = 0

            if(dynamicLineX <= width/2){
                lineTime = (dynamicLineX - offsetX)/(0.5*width-offsetX) * (medianTime - minDrawTime) + minDrawTime
            }
            else{
                lineTime = (dynamicLineX - 0.5*width)/(width*0.5-offsetX) * (maxDrawTime - medianTime) + medianTime
            }

      
            countForAccumulatedRange = 
                timeSpectrum
                .filter((a) => a.Time <= lineTime)
                .reduce((r,c) => r += c.Count, 0)

                percentageAcc = (countForAccumulatedRange/totalTimeSpectrumCount)

                let lineY = offsetY + (1-percentageAcc) * (height/2-2*offsetY) + height/2
    
                drawLine(offsetX,  lineY, dynamicLineX, lineY, 'rgba(0, 0, 0, 0.1)')
    
                percentageAcc = (100*percentageAcc).toFixed(2) + "%"
    
                drawText(offsetX, lineY - 5, "blue", percentageAcc + " ("+beautifyNumber(countForAccumulatedRange) + ")")
            
            let hitPoint = timeSpectrum.filter((a) => a.Time.toFixed(0) === lineTime.toFixed(0))
            if (hitPoint.length){
                hitPoint = hitPoint[0]

                drawText(2+ dynamicLineX, height/2 + 30, "#737373", "("+lineTime.toFixed(0)+" seconds,"+hitPoint.Count+" plays)")
        
            }
        }
    }

    //Main function to draw plot
    const drawPlot = () => {
        if(!(ctx && spectrum)) return;

        const {TotalPlay, TotalPlayMobile} = spectrum
        const {width, height} = style
        
        const onMobilePerc = (100*(TotalPlayMobile/TotalPlay)).toFixed(0) + "%"

        ctx.clearRect(0,0,width,height*1.1)

        drawText(15, 15, 'rgb(89, 89, 89)', "Play stats: " + beautifyNumber(TotalPlay) + ", (" + onMobilePerc + " on mobile)",  '11px Arial')

        drawRefLines()

        drawNormalDataPoints()
        drawNormalDataAccFreq()

        drawTimeStamps()

        drawPercentageStampsNormal()

        if(dynamicRendering){
            drawLine(dynamicLineX, 0, dynamicLineX, height*1.1, '#0099cc')
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

    const onMouseEnter = () => {
        setDynamicRendering(true) 
    }

    const onMouseLeave = () => {
        setDynamicRendering(false) 
    }

    const onMouseMove = (e) => {
        const {width} = style
        const point = computePointInCanvas(e)

        if((point.x >= offsetX || point.x <= (width-offsetX)) && dynamicRendering){

            setDynamicLineX(point.x)
        }
    }

    const renderSpectrum = () => {
        const {width, height} = style

        return(
            <Space className="hq-full-width" direction="vertical" align="center">
                <canvas 
                    ref={canvasRef}
                    style={{...style, height: height*1.1, cursor:'crosshair'}}

                    width={width}
                    height={height*1.1}

                    onMouseEnter= {onMouseEnter}
                    onMouseLeave= {onMouseLeave}
                    onMouseMove= {onMouseMove}
                />
            </Space>
        )
    }

    const renderModal = () => {

        return(
            <Drawer
                title={
                    <Space size={"large"}>
                        <p className="hq-normal-font-weight">Median time spectrum for series</p>

                        <p className="default-title hq-normal-font-weight">{series.Code}</p>
                    </Space>
                }
                width={'100%'}
                onClose={() => setShowModal(false)}
                open={showModal}
                closeIcon={<ArrowLeftOutlined />}
                maskClosable={false}            
            >
                {loading && <Skeleton />}

                {error && !loading && 
                <ErrorComponent 
                    error={error}
                    onReload={() => getSeriesMedianTimeSpectrum(series.Id)}
                />}

                {!(loading || error) && spectrum && renderSpectrum()}
            </Drawer>
        )
    }

    return(
        <div>
            <Tooltip
                color="white"
                title={<p>Click for more detailed view</p>}
            >
                <div onClick={() => setShowModal(true)} className="hq-clickable">
                    {children}
                </div>
            </Tooltip>
            {renderModal()}
        </div>
    )
}