import { Button, Drawer, Skeleton, Space, Tooltip } from "antd";
import React, { useState } from "react";
import { useQuestions } from "../../contexts/QuestionsContext";
import { useEffect } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { ErrorComponent } from "../ErrorComponent";
import { beautifyNumber } from "../../services/Auxillary";

export function QuestionMeanTimeStatistics({question, children, style}){

    const {isLoadingGetQuestionMedianTime: loading, getQuestionMedianTimeResult: spectrum, errorGetQuestionMedianTime: error, getQuestionMedianTime} = useQuestions()
    
    const canvasRef = React.createRef()

    const [showModal, setShowModal]= useState(false)

    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)

    const [showNoramlPlot, setShowNoramlPlot] = useState(true)

    const [proccessedData, setProccessedData] = useState({})
    const [maxAccCount, setMaxAccCount] = useState(0)
    const [maxTime, setMaxTime] = useState(0)

    const [proccessedDataCorrect, setProccessedDataCorrect] = useState({})
    const [maxAccCountCorrect, setMaxAccCountCorrect] = useState(0)
    const [maxTimeCorrect, setMaxTimeCorrect] = useState(0)

    const [dynamicRendering, setDynamicRendering] = useState(false)
    const [dynamicLineX, setDynamicLineX] = useState(style.width)

    const [ctx, setCtx] = useState(null)

    useEffect(() => {
        if(showModal){
            getQuestionMedianTime(question.Id)
        }
    }, [showModal])

    useEffect(() => {
        if(canvasRef && canvasRef.current){
            const _ctx = canvasRef.current.getContext('2d')

            setCtx(_ctx)

            const {width, height} = style

            setOffsetX(width * 0.1) 
            setOffsetY(height * 0.1)
        }
    }, [canvasRef])

    useEffect(() => {
        if(showModal && ctx && spectrum){
            
            if(showNoramlPlot){
                drawPlot1()
            }
            else{
                drawPlot2()
            }
        }
    }, [ctx, spectrum])

    useEffect(() => {
        if(showModal){
            if(showNoramlPlot){
                drawPlot1()
            }
            else{
                drawPlot2()
            }
        }
    }, [dynamicRendering, dynamicLineX])

    useEffect(() => {
        if(showModal){
            if(showNoramlPlot){
                drawPlot1()
            }
            else{
                drawPlot2()
            }
        }
    }, [showNoramlPlot])

    useEffect(() => {
        if(ctx && spectrum){
            let proccessedData = {}
            let maxAccCount=0
            let maxTime = 0
            
            let proccessedDataCorrect = {}
            let maxAccCountCorrect=0
            let maxTimeCorrect = 0

            const {TimeSpectrum: timeSpectrum, TimeSpectrumCorrect:timeSpectrumCorrect} = spectrum

            for(let i_t = 0; i_t < timeSpectrum.length; i_t++){
                let tData = timeSpectrum[i_t]
                const accCount =  timeSpectrum.slice(0, i_t+1).reduce((r, c) => r += c.Count, 0)
                proccessedData[tData.Time] = accCount

                if(i_t == (timeSpectrum.length-1)){
                    maxAccCount = accCount
                    maxTime = tData.Time
                }
            }

            for(let i_t = 0; i_t < timeSpectrumCorrect.length; i_t++){
                let tData = timeSpectrumCorrect[i_t]
                const accCount =  timeSpectrumCorrect.slice(0, i_t+1).reduce((r, c) => r += c.Count, 0)
                proccessedDataCorrect[tData.Time] = accCount

                if(i_t == (timeSpectrumCorrect.length-1)){
                    maxAccCountCorrect = accCount
                    maxTimeCorrect = tData.Time
                }
            }

            setProccessedData(proccessedData)
            setMaxAccCount(maxAccCount)
            setMaxTime(maxTime)  

            setProccessedDataCorrect(proccessedDataCorrect)
            setMaxAccCountCorrect(maxAccCountCorrect)
            setMaxTimeCorrect(maxTimeCorrect)  
        }
        }, [ctx, spectrum])

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

    //Function to draw all spectrum points
    const drawNormalDataPoints = () => {

        const {width, height} = style
        const {TimeSpectrum: timeSpectrum, MedianPlayTime: medianTime, AvgPlayTime: avgTime} = spectrum

        if(!timeSpectrum.length) return;

        const maxCount = Math.max(...timeSpectrum.map((a) => a.Count))
        const maxTime = Math.max(...timeSpectrum.map((a) => a.Time))
        const minTime = Math.min(...timeSpectrum.map((a) => a.Time))
      

        //Draw median value 
        const minDrawTime = Math.trunc(medianTime*0.2)
        let maxDrawTime = maxTime

        maxDrawTime = (maxTime > 5 * medianTime) ? (medianTime*5) : maxDrawTime

        const pointsAroundTheMedianTime  = timeSpectrum.filter((a) => a.Time >= minDrawTime && a.Time <= maxDrawTime)

        let countAtMedianTime = timeSpectrum.filter((a) => a.Time == medianTime)[0].Count
        
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
      
        drawLine(x, height/2-offsetY, x, offsetY, 'orange')
        drawText(x - 5, offsetY - 5, 'rgb(89, 89, 89)', "avgTime: "+ avgTime.toFixed() + " s")


        //Define plot name
        ctx.save();
        ctx.translate(offsetX/2, height*0.35);
        ctx.rotate(-Math.PI / 2);
        ctx.font =  "10px Arial";
        ctx.fillStyle = '#0099cc'
        ctx.fillText("Play time vs Count - all data", 0, 0);
        ctx.restore();

        //State max count  + max/max time
        drawText(offsetX, offsetY - 10, 'rgb(89, 89, 89)', "maxCount: "+maxCount)
        drawText(offsetX, offsetY - 25, 'rgb(89, 89, 89)', "maxTime: "+maxTime + " s")
        drawText(offsetX, offsetY - 40, 'rgb(89, 89, 89)', "minTime: "+minTime + " s")
    }

    //Function to draw points correctly answered
    const drawCorrectDataPoints = () => {
        const {width, height} = style

        const {
            TimeSpectrumCorrect: timeSpectrumCorrect,
            TimeSpectrum: TimeSpectrum,
            MedianPlayTime: medianTime,
            MedianPlayTimeCorrect: medianTimeCorrect,
            AvgPlayTimeCorrect:avgTimeCorrect,
           
        } = spectrum


        if(!timeSpectrumCorrect.length) return;

        const maxCount = Math.max(...TimeSpectrum.map((a) => a.Count))
        const maxCountCorrect = Math.max(...timeSpectrumCorrect.map((a) => a.Count))

        const minTime = Math.min(...timeSpectrumCorrect.map((a) => a.Time))

        const maxTime = Math.max(...TimeSpectrum.map((a) => a.Time))

        //Draw median value 
        const minDrawTime = Math.trunc(medianTime*0.2)
        let maxDrawTime = maxTime

        maxDrawTime = (maxTime > 5 * medianTime) ? (medianTime*5) : maxDrawTime

        const pointsAroundTheMedianTime  = timeSpectrumCorrect.filter((a) => a.Time >= minDrawTime && a.Time <= maxDrawTime && a.Time != medianTimeCorrect)

        let countAtMedianTime = timeSpectrumCorrect.filter((a) => a.Time == medianTimeCorrect)[0].Count
        
        let x = 0
        let y = (countAtMedianTime)/maxCount
       
        y = (1 - y)*(height/2 - 2*offsetY) + offsetY + height/2

        if(medianTimeCorrect <= medianTime){
                
            x = (medianTimeCorrect - minDrawTime)/(medianTime - minDrawTime)
            x = offsetX + (x) * (0.5*width-offsetX)
           
        }
        else if(medianTimeCorrect>medianTime) {
            x = (medianTimeCorrect - medianTime)/(maxDrawTime - medianTime)
            x = width/2 + (x) * (width*0.5-offsetX)
        }
      
        drawPoint(x, y, 'red')
        drawText(x - 5, height/2 -15 + offsetY, 'rgb(89, 89, 89)', "medianTime: "+ medianTimeCorrect.toFixed() + " s")
        drawLine(x, height/2 + offsetY, x, height-offsetY, 'rgba(140, 140, 140, 0.25)')

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

            y = (1 - y)*(height/2 - 2*offsetY) + offsetY + height/2


            if(!dynamicRendering){
                drawPoint(x, y, 'green')
            }
            else{
                const isIncluded = x <= dynamicLineX
                drawPoint(x, y, isIncluded ? 'green' : '#cccccc')
            }

        }

        //Draw the average line 
        x = 0
       
        if(avgTimeCorrect <= medianTime){
                
            x = (avgTimeCorrect - minDrawTime)/(medianTime - minDrawTime)
            x = offsetX + (x) * (0.5*width-offsetX)
           
        }
        else if(avgTimeCorrect>medianTime) {
            x = (avgTimeCorrect - medianTime)/(maxDrawTime - medianTime)
            x = width/2 + (x) * (width*0.5-offsetX)
        }
      
        drawLine(x, height-offsetY, x, height/2 + offsetY, 'orange')
        drawText(x - 5, height/2 + offsetY - 5, 'rgb(89, 89, 89)', "avgTime: "+ avgTimeCorrect.toFixed() + " s")

        //Define plot name
        ctx.save();
        ctx.translate(offsetX/2, height*0.825);
        ctx.rotate(-Math.PI / 2);
        ctx.font =  "10px Arial";
        ctx.fillStyle = 'green'
        ctx.fillText("Play time vs Count - correct play data", 0, 0);
        ctx.restore();

        //State max count 
        drawText(offsetX, height/2+ offsetY - 10, 'rgb(89, 89, 89)', "maxCount: "+maxCountCorrect)
        drawText(offsetX,  height/2+offsetY - 25, 'rgb(89, 89, 89)', "maxTime: "+maxTime + " s")
        drawText(offsetX,  height/2+offsetY - 40, 'rgb(89, 89, 89)', "minTime: "+minTime + " s")
    }

    //Function to draw time stamps
    const drawTimeStamps = () => {
        const {width, height} = style

        const {TimeSpectrum: timeSpectrum, MedianPlayTime: medianTime, AvgPlayTime: avgTime} = spectrum

        let drawColor = "blue"
        const drawColorLight = "#cccccc"

        if(!timeSpectrum.length) return;

        const maxTime = Math.max(...timeSpectrum.map((a) => a.Time))

        //Draw median value 
        const minDrawTime = Math.trunc(medianTime*0.2)
        let maxDrawTime = maxTime

        maxDrawTime = (maxTime > 5 * medianTime) ? (medianTime*5) : maxDrawTime

        drawText(width/2 - 5, height/2-offsetY + 15, 'blue', medianTime)
        drawLine(width/2, offsetY, width/2, height/2-offsetY + 5, 'rgba(140, 140, 140, 0.25)')
        
        //Lower graph
        drawLine(width/2, height-offsetY, width/2, height-offsetY + 5, 'rgba(140, 140, 140, 0.25)')

        const beforeMedianTimeStep =  (medianTime-minDrawTime)/5
        for(let i = 0; i < 5; i++){
            let pTime = Math.trunc((i * beforeMedianTimeStep) + minDrawTime)
           

            let x = (pTime - minDrawTime)/(medianTime - minDrawTime)
            x = offsetX + (x) * (0.5*width-offsetX)

            drawColor = (dynamicRendering && (dynamicLineX < x)) ? drawColorLight : drawColor

            drawLine(x, height/2-offsetY, x, height/2-offsetY + 5, '#cccccc')
            drawText(x - 5, height/2-offsetY + 15, drawColor, pTime)

            //Lower graph
            drawLine(x, height-offsetY, x, height-offsetY + 5, '#cccccc')
            drawText(x - 5, height-offsetY + 15, drawColor, pTime)

        }

        const afterMedianTimeStep =  (maxDrawTime-medianTime)/5
        for(let i = 0; i < 6; i++){
            let pTime = Math.trunc((i * afterMedianTimeStep) + medianTime)

            let x = (pTime - medianTime)/(maxDrawTime - medianTime)
            x = width/2 + (x) * (width*0.5-offsetX)

            drawColor = (dynamicRendering && (dynamicLineX < x)) ? drawColorLight : drawColor

            drawLine(x, height/2-offsetY, x, height/2-offsetY + 5, '#cccccc')
            drawText(x - 5, height/2-offsetY + 15, drawColor, pTime)

            drawLine(x, height-offsetY, x, height-offsetY + 5, '#cccccc')
            drawText(x - 5, height-offsetY + 15, drawColor, pTime)

        }

        //Word seconds
        drawText(width - offsetX - 15, height/2-offsetY + 25, 'blue', "seconds")
        drawText(width - offsetX - 15, height-offsetY + 25, 'blue', "seconds")

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

    //Function to draw frequency percentages
    const drawPercentageStampsNormal = () => {

        const {width, height} = style

        const {TimeSpectrum: timeSpectrum, MedianPlayTime: medianTime} = spectrum

        let drawColor = "#737373"
        const drawColorLight = "#cccccc"
        const drawColorWhite = "#cccccc"

        const totalTimeSpectrumCount = timeSpectrum.reduce((r,c) => r += c.Count, 0)

        if(!timeSpectrum.length) return;

        const maxTime = Math.max(...timeSpectrum.map((a) => a.Time))

        //Draw median value 
        const minDrawTime = Math.trunc(medianTime*0.2)
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

        //Info below minDrawTime
        countForAccumulatedRange = 
        timeSpectrum
        .filter((a) => a.Time < Ts[0])
        .reduce((r,c) => r += c.Count, 0)

        percentageAcc = (100*(countForAccumulatedRange/totalTimeSpectrumCount)).toFixed(2) + "%"

        drawText(-10+ (offsetX)/2, height/2-offsetY + 55, drawColor, percentageAcc)
        drawText(-10+ (offsetX)/2, height/2-offsetY + 70, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

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

            drawText(-10+ (x+x_next)/2, height/2-offsetY + 25, drawColor, percentage)
            drawText(-10+ (x+x_next)/2, height/2-offsetY + 40, drawColor, "("+beautifyNumber(countForTimeRange) + ")")
            drawText(-10+ (x+x_next)/2, height/2-offsetY + 55, drawColor, percentageAcc)
            drawText(-10+ (x+x_next)/2, height/2-offsetY + 70, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

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

        drawText(-10+ (x+x_next)/2, height/2-offsetY + 25, drawColor, percentage)
        drawText(-10+ (x+x_next)/2, height/2-offsetY + 40, drawColor, "("+beautifyNumber(countForTimeRange) + ")")

        drawText(-10+ (x+x_next)/2, height/2-offsetY + 55, drawColor, percentageAcc)
        drawText(-10+ (x+x_next)/2, height/2-offsetY + 70, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

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

            drawText(-10+ (x+x_next)/2, height/2-offsetY + 25, drawColor, percentage)
            drawText(-10+ (x+x_next)/2, height/2-offsetY + 40, drawColor, "("+beautifyNumber(countForTimeRange) + ")")
            drawText(-10+ (x+x_next)/2, height/2-offsetY + 55, drawColor, percentageAcc)
            drawText(-10+ (x+x_next)/2, height/2-offsetY + 70, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

        }

        x =  width - offsetX
        pTime = pTime_next

        x_next = width
        pTime_next = maxTime

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

        drawText(-10+ (x+x_next)/2, height/2-offsetY + 25, drawColor, percentage)
        drawText(-10+ (x+x_next)/2, height/2-offsetY + 40, drawColor, "("+beautifyNumber(countForTimeRange) + ")")
        drawText(-10+ (x+x_next)/2, height/2-offsetY + 55, drawColor, percentageAcc)
        drawText(-10+ (x+x_next)/2, height/2-offsetY + 70, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")


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

            percentageAcc = (100*(countForAccumulatedRange/totalTimeSpectrumCount)).toFixed(2) + "%"

            drawText(2+ dynamicLineX, height/2, "#737373", percentageAcc)
            drawText(2+ dynamicLineX, height/2 + 15, "#737373", "("+beautifyNumber(countForAccumulatedRange) + ")")
        
            let hitPoint = timeSpectrum.filter((a) => a.Time.toFixed(0) == lineTime.toFixed(0))
            if (hitPoint.length){
                hitPoint = hitPoint[0]

                drawText(2+ dynamicLineX, height/2 + 30, "#737373", "("+lineTime.toFixed(0)+" seconds,"+hitPoint.Count+" plays)")
        
            }
        }
    }

    //Function to draw frequency percentages for correctly played games
    const drawPercentageStampsCorrect = () => {
        const {width, height} = style
        const {TimeSpectrumCorrect: timeSpectrum, MedianPlayTime: medianTime} = spectrum

        let drawColor = "#737373"
        const drawColorLight = "#cccccc"
        const drawColorWhite = "#cccccc"

        const totalTimeSpectrumCount = timeSpectrum.reduce((r,c) => r += c.Count, 0)

        if(!timeSpectrum.length) return;

        const maxTime = Math.max(...timeSpectrum.map((a) => a.Time))

        //Draw median value 
        const minDrawTime = Math.trunc(medianTime*0.2)
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

        //Info below minDrawTime
        countForAccumulatedRange = 
        timeSpectrum
        .filter((a) => a.Time < Ts[0])
        .reduce((r,c) => r += c.Count, 0)

        percentageAcc = (100*(countForAccumulatedRange/totalTimeSpectrumCount)).toFixed(2) + "%"

        drawText(-10+ (offsetX)/2, height-offsetY + 55, drawColor, percentageAcc)
        drawText(-10+ (offsetX)/2, height-offsetY + 70, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

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

            drawText(-10+ (x+x_next)/2, height-offsetY + 25, drawColor, percentage)
            drawText(-10+ (x+x_next)/2, height-offsetY + 40, drawColor, "("+beautifyNumber(countForTimeRange) + ")")
            drawText(-10+ (x+x_next)/2, height-offsetY + 55, drawColor, percentageAcc)
            drawText(-10+ (x+x_next)/2, height-offsetY + 70, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

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

        drawText(-10+ (x+x_next)/2, height-offsetY + 25, drawColor, percentage)
        drawText(-10+ (x+x_next)/2, height-offsetY + 40, drawColor, "("+beautifyNumber(countForTimeRange) + ")")

        drawText(-10+ (x+x_next)/2, height-offsetY + 55, drawColor, percentageAcc)
        drawText(-10+ (x+x_next)/2, height-offsetY + 70, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

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

            drawText(-10+ (x+x_next)/2, height-offsetY + 25, drawColor, percentage)
            drawText(-10+ (x+x_next)/2, height-offsetY + 40, drawColor, "("+beautifyNumber(countForTimeRange) + ")")
            drawText(-10+ (x+x_next)/2, height-offsetY + 55, drawColor, percentageAcc)
            drawText(-10+ (x+x_next)/2, height-offsetY + 70, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

        }

        x =  width - offsetX
        pTime = pTime_next

        x_next = width
        pTime_next = maxTime

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

        drawText(-10+ (x+x_next)/2, height-offsetY + 25, drawColor, percentage)
        drawText(-10+ (x+x_next)/2, height-offsetY + 40, drawColor, "("+beautifyNumber(countForTimeRange) + ")")
        drawText(-10+ (x+x_next)/2, height-offsetY + 55, drawColor, percentageAcc)
        drawText(-10+ (x+x_next)/2, height-offsetY + 70, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

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

            percentageAcc = (100*(countForAccumulatedRange/totalTimeSpectrumCount)).toFixed(2) + "%"

            drawText(2+ dynamicLineX, height, "#737373", percentageAcc)
            drawText(2+ dynamicLineX, height + 15, "#737373", "("+beautifyNumber(countForAccumulatedRange) + ")")
            
            let hitPoint = timeSpectrum.filter((a) => a.Time.toFixed(0) == lineTime.toFixed(0))
            if (hitPoint.length){
                hitPoint = hitPoint[0]

                drawText(2+ dynamicLineX, height + 30, "#737373", "("+lineTime.toFixed(0)+" seconds,"+hitPoint.Count+" plays)")
            }
        }
    }

    const drawPlot1 = () => {
        if(!ctx) return;

        const {width, height} = style

        ctx.clearRect(0,0,width,height*1.1)

        const {TotalPlay, TotalPlaySuccess} = spectrum


        const successRate = TotalPlay ? ((100*(TotalPlaySuccess/TotalPlay)).toFixed(2) + "%") : ""

        drawRefLines()

        drawNormalDataPoints()
        drawCorrectDataPoints()

        drawTimeStamps()
        drawPercentageStampsNormal()
        drawPercentageStampsCorrect()

        drawText(
            15, 15,
            'rgb(89, 89, 89)',
            "Play stats: " + beautifyNumber(TotalPlaySuccess) + " / " + beautifyNumber(TotalPlay) + ", " + successRate + " (success rate)", 
            '11px Arial')

         if(dynamicRendering){
            drawLine(dynamicLineX, 0, dynamicLineX, height*1.1, '#0099cc')
        }
    }

    //Function to draw frequency data all points
    const drawNormalData = () => {
        const {width, height} = style

        const {TimeSpectrum: timeSpectrum, MedianPlayTime: medianTime, AvgPlayTime: avgTime} = spectrum

        const minTime = Math.min(...timeSpectrum.map((a) => a.Time))


        //Draw median value 
        const minDrawTime = 0
        let maxDrawTime = maxTime
        maxDrawTime = (maxTime > 5 * medianTime) ? (medianTime*5) : maxDrawTime

        const pointsAroundTheMedianTime  = timeSpectrum.filter((a) => a.Time >= minDrawTime && a.Time <= maxDrawTime)

        let frequencyAtMedianTime = proccessedData[medianTime]

        let y = (frequencyAtMedianTime)/maxAccCount
       
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

            let y = (proccessedData[pTime])/maxAccCount

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
      
        drawLine(x, height/2-offsetY, x, offsetY, 'orange')
        drawText(x - 5, offsetY - 5, 'rgb(89, 89, 89)', "avgTime: "+ avgTime.toFixed() + " s")


        //Define plot name
        ctx.save();
        ctx.translate(offsetX/2, height*0.35);
        ctx.rotate(-Math.PI / 2);
        ctx.font =  "10px Arial";
        ctx.fillStyle = '#0099cc'
        ctx.fillText("Play time vs Accumulated frequency - all data", 0, 0);
        ctx.restore();

        //Draw 50%,  100% lines
        drawLine(
            offsetX, offsetY + (height/2 - offsetY*2)*0.5,
            width - offsetX, offsetY + (height/2 - offsetY*2)*0.5,
            'rgba(0, 0, 0, 0.1)'
        )

        drawLine(
            offsetX, offsetY,
            width - offsetX, offsetY,
            'rgba(0, 0, 0, 0.1)'
        )

         //State max/max time
         drawText(offsetX, offsetY - 25, 'rgb(89, 89, 89)', "maxTime: "+maxTime + " s")
         drawText(offsetX, offsetY - 40, 'rgb(89, 89, 89)', "minTime: "+minTime + " s")
     
    }

    //Function to draw frequency data correctly played points
    const drawCorrectData = () => {
        const {TimeSpectrumCorrect: timeSpectrumCorrect, MedianPlayTimeCorrect:medianTimeCorrect,  MedianPlayTime: medianTime, AvgPlayTimeCorrect: avgTimeCorrect} = spectrum

        const {width, height} = style
      
        //Draw median value 
        const minDrawTime = 0
        let maxDrawTime = maxTimeCorrect
        maxDrawTime = (maxDrawTime > 5 * medianTime) ? (medianTime*5) : maxDrawTime

        const pointsAroundTheMedianTime  = timeSpectrumCorrect.filter((a) => a.Time >= minDrawTime && a.Time <= maxDrawTime)

        let frequencyAtMedianTime = proccessedDataCorrect[medianTimeCorrect]

        let y = (frequencyAtMedianTime)/maxAccCountCorrect
       
        y = (1 - y)*(height/2 - 2*offsetY) + offsetY + height/2
        
        if(medianTimeCorrect <= medianTime){
                
            x = (medianTimeCorrect - minDrawTime)/(medianTime - minDrawTime)
            x = offsetX + (x) * (0.5*width-offsetX)
           
        }
        else if(medianTimeCorrect>medianTime) {
            x = (medianTimeCorrect - medianTime)/(maxDrawTime - medianTime)
            x = width/2 + (x) * (width*0.5-offsetX)
        }

        drawPoint(x, y, 'red')
        drawText(x - 5, height/2 -15 + offsetY, 'rgb(89, 89, 89)', "medianTime: "+ medianTimeCorrect.toFixed() + " s")
        drawLine(x, height/2 + offsetY, x, height-offsetY, 'rgba(140, 140, 140, 0.25)')

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

            let y = (proccessedDataCorrect[pTime])/maxAccCountCorrect

            y = (1 - y)*(height/2 - 2*offsetY) + offsetY + height/2

            if(!dynamicRendering){
                drawPoint(x, y, 'green')
            }
            else{
                const isIncluded = x <= dynamicLineX

                drawPoint(x, y, isIncluded ? 'green' : '#cccccc')
            }

        }

        //Draw the average line 
        let x = 0
       
        if(avgTimeCorrect <= medianTime){
                
            x = (avgTimeCorrect - minDrawTime)/(medianTime - minDrawTime)
            x = offsetX + (x) * (0.5*width-offsetX)
           
        }
        else if(avgTimeCorrect>medianTime) {
            x = (avgTimeCorrect - medianTime)/(maxDrawTime - medianTime)
            x = width/2 + (x) * (width*0.5-offsetX)
        }
      
        drawLine(x, height-offsetY, x, height/2 + offsetY, 'orange')
        drawText(x - 5, height/2 + offsetY - 5, 'rgb(89, 89, 89)', "avgTime: "+ avgTimeCorrect.toFixed() + " s")


        //Define plot name
        ctx.save();
        ctx.translate(offsetX/2, height*0.825);
        ctx.rotate(-Math.PI / 2);
        ctx.font =  "10px Arial";
        ctx.fillStyle = 'green'
        ctx.fillText("Play time vs Accumulated frequency - correct data", 0, 0);
        ctx.restore();

        //Draw 50%,  100% lines
        drawLine(
            offsetX, offsetY + (height*0.75 - offsetY),
            width - offsetX, offsetY + (height*0.75 - offsetY),
            'rgba(0, 0, 0, 0.1)'
        )

        drawLine(
            offsetX, offsetY + height/2,
            width - offsetX, offsetY + height/2,
            'rgba(0, 0, 0, 0.1)'
        )
    }

    //Function to draw time stamps 
    const drawTimeStamps2 = () => {

        const {width, height} = style

        const {MedianPlayTime: medianTime} = spectrum

        let drawColor = "blue"
        const drawColorLight = "#cccccc"

        //Draw median value 
        const minDrawTime = 0
        let maxDrawTime = maxTime
        maxDrawTime = (maxTime > 5 * medianTime) ? (medianTime*5) : maxDrawTime


        drawText(width/2 - 5, height/2-offsetY + 15, 'blue', medianTime)
        drawLine(width/2, offsetY, width/2, height/2-offsetY + 5, 'rgba(140, 140, 140, 0.25)')
        
        //Lower graph
        drawLine(width/2, height-offsetY, width/2, height-offsetY + 5, 'rgba(140, 140, 140, 0.25)')

        const beforeMedianTimeStep =  (medianTime-minDrawTime)/5
        for(let i = 0; i < 5; i++){
            let pTime = Math.trunc((i * beforeMedianTimeStep) + minDrawTime)
           

            let x = (pTime - minDrawTime)/(medianTime - minDrawTime)
            x = offsetX + (x) * (0.5*width-offsetX)

            drawColor = (dynamicRendering && (dynamicLineX < x)) ? drawColorLight : drawColor

            drawLine(x, height/2-offsetY, x, height/2-offsetY + 5, '#cccccc')
            drawText(x - 5, height/2-offsetY + 15, drawColor, pTime)

            //Lower graph
            drawLine(x, height-offsetY, x, height-offsetY + 5, '#cccccc')
            drawText(x - 5, height-offsetY + 15, drawColor, pTime)

        }

        const afterMedianTimeStep =  (maxDrawTime-medianTime)/5
        for(let i = 0; i < 6; i++){
            let pTime = Math.trunc((i * afterMedianTimeStep) + medianTime)

            let x = (pTime - medianTime)/(maxDrawTime - medianTime)
            x = width/2 + (x) * (width*0.5-offsetX)

            drawColor = (dynamicRendering && (dynamicLineX < x)) ? drawColorLight : drawColor

            drawLine(x, height/2-offsetY, x, height/2-offsetY + 5, '#cccccc')
            drawText(x - 5, height/2-offsetY + 15, drawColor, pTime)

            drawLine(x, height-offsetY, x, height-offsetY + 5, '#cccccc')
            drawText(x - 5, height-offsetY + 15, drawColor, pTime)

        }

        //Word seconds
        drawText(width - offsetX + 15, height/2-offsetY+5 , 'blue', "seconds")
        drawText(width - offsetX + 15, height-offsetY+5, 'blue', "seconds")

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

    const drawPercentageStampsNormal2 = () => {
        const {width, height} = style
        const {TimeSpectrum: timeSpectrum, MedianPlayTime: medianTime} = spectrum

        let drawColor = "#737373"
        const drawColorLight = "#cccccc"
        const drawColorWhite = "#cccccc"

        const totalTimeSpectrumCount = timeSpectrum.reduce((r,c) => r += c.Count, 0)

        const maxTime = Math.max(...timeSpectrum.map((a) => a.Time))

        //Draw median value 
        const minDrawTime = 0
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

            let lineY = offsetY + (1-percentageAcc) * (height/2-2*offsetY)

            drawLine(offsetX,  lineY, dynamicLineX, lineY, 'rgba(0, 0, 0, 0.1)')

            percentageAcc = (100*percentageAcc).toFixed(2) + "%"

            drawText(offsetX, lineY - 5, "blue", percentageAcc + " ("+beautifyNumber(countForAccumulatedRange) + ")")
        
        }
    }

    const drawPercentageStampsCorrect2 = () => {
        const {TimeSpectrumCorrect: timeSpectrum,  MedianPlayTime: medianTime} = spectrum

        const {width, height} = style

        let drawColor = "#737373"
        const drawColorLight = "#cccccc"
        const drawColorWhite = "#cccccc"

        const totalTimeSpectrumCount = timeSpectrum.reduce((r,c) => r += c.Count, 0)

        const maxTime = Math.max(...timeSpectrum.map((a) => a.Time))

        //Draw median value 

        const minDrawTime = 0
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

            drawText(-10+ x_next, height-offsetY + 25, drawColor, percentageAcc)
            drawText(-10+ x_next, height-offsetY + 40, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

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

    
        drawText(-10+ x_next, height-offsetY + 25, drawColor, percentageAcc)
        drawText(-10+ x_next, height-offsetY + 40, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

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

            drawText(-10+ x_next, height-offsetY + 25, drawColor, percentageAcc)
            drawText(-10+ x_next, height-offsetY + 40, drawColor, "("+beautifyNumber(countForAccumulatedRange) + ")")

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
        
        }
    }

    const drawPlot2 = () => {
        if(!ctx) return;

        const {width, height} = style

        ctx.clearRect(0,0,width,height*1.1)

        const {TotalPlay, TotalPlaySuccess} = spectrum

        const successRate = TotalPlay ? ((100*(TotalPlaySuccess/TotalPlay)).toFixed(2) + "%") : ""

        drawText(15, 15, 'rgb(89, 89, 89)',
         "Play stats: " + beautifyNumber(TotalPlaySuccess) + " / " + beautifyNumber(TotalPlay) + ", " + successRate + " (success rate)", 
         '11px Arial')

         drawRefLines()

         drawNormalData()
         drawCorrectData()

         drawTimeStamps2()
         drawPercentageStampsNormal2()
         drawPercentageStampsCorrect2()

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
            <Space direction="vertical" align="center" className="hq-full-width">
                <Button 
                    onClick={() => setShowNoramlPlot(!showNoramlPlot)}
                    size="small"
                > 
                    {showNoramlPlot ? "Switch to frequency plot" : "Switch to normal plot"}
                </Button>
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
                        <p className="hq-normal-font-weight">Median time spectrum for question</p>

                        <p className="default-title hq-normal-font-weight">{question.Code}</p>
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
                    onReload={() => getQuestionMedianTime(question.Id)}
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