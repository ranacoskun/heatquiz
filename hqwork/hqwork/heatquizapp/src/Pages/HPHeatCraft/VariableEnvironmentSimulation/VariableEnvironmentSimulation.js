import { Button, Col, Divider, Input, Row, Slider, Space, Tooltip, Tour } from "antd";
import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
 
import pump from'./pump.png';
import outsidePump from'./outside_heatpump.png';

import waterhose from'./waterhose.png';
import wall from'./wall.jpg';
import houseFull from'./houseFull.jpg';
import painting1 from'./painting_1.png';
import painting2 from'./painting_2.png';

import radiator1 from'./radiator 1.png';
import radiator1_start from'./radiator 1 start.png';
import radiator1_middle from'./radiator 1 middle.png';
import radiator1_end from'./radiator 1 end.png';

import radiator3 from'./radiator 3.png';
import radiator3_start from'./radiator 3 start.png';
import radiator3_middle from'./radiator 3 middle.png';
import radiator3_end from'./radiator 3 end.png';

import heatcraftHPlogo from'./HEATCRAFTHP-Logo.png';

import MoneyCounter from'./MoneyCounter.png';
import CostPerMeter from'./CostPerMeter.png';

import controlVolumeImage1 from'./controlVolume_1.png';

import heatpumpOverallImage from'./heatpumpOverall.jpg';
import condensorInternalImage from'./condensorInternal.png';
import lengthArrowImage from'./lengthArrow.png';
import externalUnitOverall from'./externalUnitOverall.png';

import OutsideTemperatureMeterImage from'./OutsideTemperatureMeter.png';

import radiatorsRays from'./radiatorsRays.png';
import Icon, {PauseOutlined, BorderOuterOutlined, ReadOutlined, BuildOutlined, BoxPlotOutlined, InsertRowRightOutlined, CaretRightOutlined, SwapOutlined, RedoOutlined, HomeOutlined, PlusOutlined,FilePdfOutlined, MinusOutlined, FastForwardOutlined} from '@ant-design/icons';
import { CP_R_134_A, CP_WATER, C_C, C_KW, C_T1, C_T2, D_WATER, ITS_MAX_POWER, ITS_MIN_HEIGHT, ITS_REQ_HEIGHT, MAX_RAD_N_1, MIN_RAD_N_1, Q_12, Q_L_1, Q_L_2, Q_RAD_1, Q_RAD_2, SPEED_1, SPEED_10, SPEED_100, SPEED_2, SPEED_5, SPEED_4 } from "./Constants";
import ButtonGroup from "antd/es/button/button-group";

import insulationDoc from "./Effect of Insulation on System Performance.pdf"
import copDoc from "./Effect of External Temperature on System Performance.pdf"
import { createRef } from "react";
import { LatexRenderer } from "../../../Components/LatexRenderer";

var timer;

export function VariableEnvironmentSimulation(){
    
    const svgRef = React.createRef()
    const [speed, setSpeed] = useState(SPEED_1)
    const [cp, setCP] = useState(CP_WATER)

    const [Toutside, setToutside] = useState(5)

    const [T1, setT1] = useState(22)
    const [Tr1, setTr1] = useState([20])
    const [Tin1, setTin1] = useState([0])
    const [Tout1, setTout1] = useState([20])
    const [v1, setV1] = useState([0])
    const [r1, setR1] = useState(1)
    const [p1, setP1] = useState([0])

    const [radN1, setRadN1] = useState(6)

    const [ql1, setQL1] = useState([0])
    const [ql2, setQL2] = useState([0])
    const [qf12, setQF12] = useState([0])
    const [qrad1, setqrad1] = useState([0])
    const [qrad2, setqrad2] = useState([0])

    const [T2, setT2] = useState(22)
    const [Tr2, setTr2] = useState([15])
    const [Tin2, setTin2] = useState([0])
    const [Tout2, setTout2] = useState([20])
    const [v2, setV2] = useState([0])
    const [r2, setR2] = useState(1)
    const [p2, setP2] = useState([0])

    const [radN2, setRadN2] = useState(6)

    const [isFirstTHigher, setIsFirstTHigher] = useState(false)

    const [p, setP] = useState([0])

    const [cop, setCOP] = useState([0])

    const [kWhCost, setkWhCost] = useState(0.383)
    const [cost, setCost] = useState(0)

    const [outsideHeight, setOutsideHeight] = useState(630)
    const [isMovingOutsideTemperature, setIsMovingOutsideTemperature] = useState(false)
    const [showTemperatureMeter, setShowTemperatureMeter] = useState(false)

    const [requiredHeight, setRequiredHeight] = useState(ITS_REQ_HEIGHT)
    const [isMovingRequiredTemperature, setIsMovingRequiredTemperature] = useState(false)

    const [firstTemperature, setFirstTemperature] = useState([600])
    const [firstLoss, setFirstLoss] = useState([0])
    const [firstPower, setFirstPower] = useState([0])

    const [secondTemperature, setSecondTemperature] = useState([600])
    const [secondLoss, setSecondLoss] = useState([0])
    const [secondPower, setSecondPower] = useState([0])

    const [firstFlowrate, setFirstFlowRate] = useState(0)

    const [animationRunning, setAnimationRunning] = useState(true)

    const [isLargerRoom, setIsLargerRoom] = useState(false)
    const [isNewRadiator, setIsNewRadiator] = useState(false)
    const [isNewRadiatorSecond, setIsNewRadiatorSecond] = useState(false)
    const [addSecondRadiator, setAddSecondRadiator] = useState(false)
    const [isInsolation, setIsInsolation] = useState(false)

    const [isLargerRoomArray, setIsLargerRoomArray] = useState([false])
    const [isNewRadiatorArray, setIsNewRadiatorArray] = useState([false])
    const [isInsolationArray, setIsInsolationArray] = useState([false])
    const [insulationWidth, setInsulationWidth] = useState(25)

    const [showMouseLine, setShowMouseLine] = useState(false)
    const [clickIndex, setClickIndex] = useState(null)
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)

    const [hoveredArrayName, setHoveredArrayName] = useState(null)

    const [costMeterTourOpen, setCostMeterTourOpen] = useState(false)
    const powerMeterRef = createRef()
    const costMeterRef = createRef()
    const costMeterRef2 = createRef()

    const [controlVolumeTourOpen, setControlVolumeTourOpen] = useState(false)
    const controlVolumeRef = createRef()
    const controlVolumeRef2 = createRef()

    const [systemTourOpen, setSystemTourOpen] = useState(false)
    const systemRef = createRef()
    const radiatorRef = createRef()
    const radiatorRefStatus = createRef()
    const radiatorSizeRef = createRef()

    const [insulationTourOpen, setInsulationTourOpen] = useState(false)
    const insulationRef = createRef()
    const insulationWidthRef = createRef()

    const [outsideTemperatureTourOpen, setOutsideTemperatureTourOpen] = useState(false)
    const outsideTemperatureRef = createRef()
    const outsideTemperaturePotentiometerRef = createRef()

    useEffect(() => {
        let _showMouseLine = false

        if(mouseX >= 160 && mouseX <= 300 && mouseY >= 40 && mouseY <= 130 ){
            _showMouseLine = true
        }
        else if(mouseX >= 340 && mouseX <= 480 && mouseY >= 40 && mouseY <= 130 ){
            _showMouseLine = true
        }
        else{
            _showMouseLine = false
        }

        setShowMouseLine(_showMouseLine)

        if(_showMouseLine){
            const x0 = mouseX
            const x1 = (x0 - 160)
            const x2 = (x0 - 340)

            let index = parseInt(Math.trunc((x1 >= 0 && x1 <= 140) ? x1 : x2))
                        
            setClickIndex(index)
        }
        else{
            setClickIndex(null)
        }

    }, [mouseX, mouseY])

    useEffect(() => {
        const _p1 = p1.at(-1)
        const _p2 = p2.at(-1)
        
        const _Tin1 = Tin1.at(-1)
        const _Tin2 = Tin2.at(-1)

        const _T = 5 + Math.max(_Tin1, _Tin2)

        const comprEffeciency = 0.75

        const _cop = comprEffeciency * (_T + 273)/(_T - (Toutside - 5)) 

        updateArray(_cop, cop, (l) => setCOP(l))

        const qRad = qrad1.at(-1) + (addSecondRadiator ?  qrad2.at(-1) : 0)

        const _p = qRad/_cop

        updateArray(_p, p, (l) => setP(l))

        const totalCost = _p * 0.001 * kWhCost * 1

        setCost(totalCost)

    }, [p1, p2])

    const resetAnimation = () => {
        setT1(22)
        setTr1([20])
        setTr2([15])
        setOutsideHeight(5)
        setSpeed(SPEED_1)

        setIsInsolation(false)
        setIsLargerRoom(false)
        setIsNewRadiator(false)
        setIsNewRadiatorSecond(false)
        setAddSecondRadiator(false)
    }

    useEffect(() => {
        timer = setInterval(() => {
            if(isLargerRoom){
                doCalculations3()
            }
            else{
                doCalculations2()
            }
        }, (speed))

        return () => clearInterval(timer)
    }, [Tr1, Tr2, animationRunning, speed])


const resolveControlVolume = (Qrad, kA, Tr = 0) => {
    const dT = 5

    const dVdT = Qrad / (dT * CP_WATER * D_WATER)

    const Tavg = (Qrad / (kA)) + Tr

    const Tin = Tavg + 2.5
    const Tout = Tavg - 2.5

    return ({Tin, Tout, dVdT})
}

const resolveControlVolume2rads = (Qrad1, kA1, Tr1, Qrad2, kA2, Tr2) => {

    const dT = 5
    
    if(Object.is(Qrad2, 0)){
        setIsFirstTHigher(false)
        const dVdT = Qrad1 / (dT * CP_WATER * D_WATER)

        const Tavg = (Qrad1 / (kA1)) + Tr1

        const Tin = Tavg + 2.5
        const Tout = Tavg - 2.5

        return ({Tin1: Tin, Tout1: Tout, dVdT1:dVdT, Tin2: 0, Tout2: 0, dVdT2:0})
    }

    const Tavg1 = (Qrad1 / (kA1)) + Tr1
    const Tavg2 = (Qrad2 / (kA2)) + Tr2

    let _Tin1 = 0
    let _Tout1 = 0
    let _Tin2 = 0
    let _Tout2 = 0

    let dVdT1 = 0
    let dVdT2 = 0

    if(Tavg1 >= Tavg2){
        _Tin1 = Tavg1 + 2.5
        _Tin2 = _Tin1

        _Tout1 = Tavg1 - 2.5

        _Tout2 = Tavg2*2 - _Tin2
        
        dVdT1 = Qrad1 / (dT * CP_WATER * D_WATER)

        dVdT2 = Qrad2 / ((_Tin2 - _Tout2) * CP_WATER * D_WATER)
        setIsFirstTHigher(true)
    }
    else{
        _Tin2 = Tavg2 + 2.5
        _Tin1 = _Tin2

        _Tout1 = Tavg1*2 - _Tin1
        _Tout2 = Tavg2 - 2.5
        
        dVdT2 = Qrad2 / (dT * CP_WATER * D_WATER)

        dVdT1 = Qrad1 / ((_Tin1 - _Tout1) * CP_WATER * D_WATER)
        setIsFirstTHigher(false)
    }

    return ({Tin1: _Tin1, Tout1: _Tout1, dVdT1, Tin2: _Tin2, Tout2: _Tout2, dVdT2})

}


const doCalculations2 = () => {
    if(!animationRunning) return; 
    const W1 = isInsolation ? (0.3 + (insulationWidth/25) * 2) : 0.3 // m^2 K W^-1
    const W12 = 0.025 // m^2 K W^-1

    const A = 25 // m^2
    const V = 30 // m^3
    const A12 = 7.5 // m^2

    const k = 878.62 // J m^-3 K^-1

    const Aradiator1 = isNewRadiator ?(3.75 + (radN1/10)) : (2.6 + (radN1/10)) // m^2
    const k1 = isNewRadiator ? 35 : 20 //

    const Aradiator2 = isNewRadiatorSecond ?(3.75 + (radN2/10)): (2.6 + (radN2/10)) // m^2
    const k2 = isNewRadiatorSecond ? 35 : 20 //

    const fRad = isNewRadiator ? 1.0 : 1.0

    const comprEffeciency = 0.75

    //Calculate losses
    const cTr1 = Tr1.at(-1) // latest value
    const cTr2 = Tr2.at(-1) // latest value
    const QLoss1_outside = (cTr1 - Toutside) * A * (1 / W1)
    const QLoss2_outside = (cTr2 - Toutside) * A * (1 / W1)
    const QFlow_1_2 = (cTr1 - cTr2) * A12 * (1 / W12)

    updateArray(QLoss1_outside, ql1, (a) => setQL1(a))
    updateArray(QLoss2_outside, ql2, (a) => setQL2(a))
    updateArray(QFlow_1_2, qf12, (a) => setQF12(a))

    //Calculate required heat room #1
    const dT1_req = (T1 - cTr1) // K
    const dU1 = k * V * dT1_req  // J
    const dU1_partial = dU1 * 0.0075 // J
    const dU1_dt_partial = dU1_partial/(1) // J/s W
    const Qrad1 = dU1_dt_partial + QLoss1_outside + QFlow_1_2 // W


    const Qrad1_real = r1 * Qrad1 // W, r (0-1)
    updateArray(Qrad1_real, qrad1, (a) => setqrad1(a))

    const dU1_new = Qrad1_real - (QLoss1_outside + QFlow_1_2)
    const dT1_new = dU1_new / ( k * V)

    const _Tr1 = cTr1 + dT1_new

    updateArray(_Tr1, Tr1, (a) => setTr1(a))
    
    //Second radiator 
    const dT2_req = (T1 - cTr2) // K
    const dU2 = k * V * dT2_req  // J
    const dU2_partial = dU2 * 0.0075 // J
    const dU2_dt_partial = dU2_partial/(1) // J/s W
    const Qrad2 = addSecondRadiator ? dU2_dt_partial + QLoss2_outside - QFlow_1_2  : 0// W

    const Qrad2_real = r2 * Qrad2 // W, r (0-1)
    updateArray(Qrad2_real, qrad2, (a) => setqrad2(a))
    
    const {Tin1: _Tin1, Tout1: _Tout1, dVdT1: Vflowrate1, Tin2: _Tin2, Tout2: _Tout2, dVdT2: Vflowrate2} 
    = resolveControlVolume2rads(
        Qrad1, k1 * Aradiator1, cTr1,
        Qrad2, k2 * Aradiator2, cTr2)

    updateArray(_Tin1, Tin1, (a) => setTin1(a))
    updateArray(_Tout1, Tout1, (a) => setTout1(a))
    updateArray(Vflowrate1 * r1, v1, (a) => setV1(a))

    updateArray(_Tin2, Tin2, (a) => setTin2(a))
    updateArray(_Tout2, Tout2, (a) => setTout2(a))
    updateArray(Vflowrate2 * r2 , v2, (a) => setV2(a))

    const dU2_new = Qrad2_real - (QLoss2_outside - QFlow_1_2)
    const dT2_new = dU2_new / ( k * V)

    const _Tr2 = cTr2 + dT2_new

    updateArray(_Tr2, Tr2, (a) => setTr2(a))
    
    const _P2 = (_Tin2 - _Tout2) * CP_WATER * D_WATER * Vflowrate2 * r2 * (1/comprEffeciency) // W

    updateArray(_P2, p2, (a) => setP2(a))

    const _P1 = (_Tin1 - _Tout1) * CP_WATER * D_WATER * Vflowrate1 * r1 * (1/comprEffeciency)  // W
    updateArray(_P1, p1, (a) => setP1(a))
}

const doCalculations3 = () => {
    if(!animationRunning) return; 
    const W1 = isInsolation ? (0.17 + (insulationWidth/25) * 4) : 0.3 // m^2 K W^-1
    const W12 = 0.15 // m^2 K W^-1

    const A = 25 // m^2
    const V = 30 // m^3
    const A12 = 7.5 // m^2

    const k = 878.62 // J m^-3 K^-1

    const Aradiator1 = isNewRadiator ? (3.75 + (radN1/10)) : (2.6 + (radN1/10)) // m^2
    const k1 = isNewRadiator ? 35 : 20 //

    const Aradiator2 = isNewRadiatorSecond ? (3.75 + (radN2/10)): (2.6 + (radN2/10)) // m^2
    const k2 = isNewRadiatorSecond ? 35 : 20 //

    const comprEffeciency = 0.75

    //Calculate losses
    const cTr1 = Tr1.at(-1) // latest value
    const QLoss1_outside = (cTr1 - Toutside) * A * 2 * (1 / W1)

    updateArray(QLoss1_outside, ql1, (a) => setQL1(a))
    updateArray(0, ql2, (a) => setQL2(a))
    updateArray(0, qf12, (a) => setQF12(a))

    //Calculate required heat room #1
    const dT1_req = (T1 - cTr1) // K
    const dU1 = k * V * 2 * dT1_req  // J
    const dU1_partial = dU1 * 0.0075 // J
    const dU1_dt_partial = dU1_partial/(1) // J/s W
    const Qrad = (dU1_dt_partial + QLoss1_outside)


    const {Tin: _Tin, Tout: _Tout} = resolveControlVolume(Qrad, k1 * Aradiator1 + (addSecondRadiator ?  k2 * Aradiator2 : 0), cTr1)

    const Qrad1 = k1 * Aradiator1 * (0.5 *(_Tin + _Tout) - cTr1) // W
    const Qrad1_real = r1 * Qrad1 // W, r (0-1)
    updateArray(Qrad1_real, qrad1, (a) => setqrad1(a))

    const Qrad2 = addSecondRadiator ? k2 * Aradiator2 * (0.5 *(_Tin + _Tout) - cTr1) : 0// W
    const Qrad2_real = r2 * Qrad2 // W, r (0-1)
    updateArray(Qrad2_real, qrad2, (a) => setqrad2(a))

    const {dVdT: Vflowrate1} = resolveControlVolume(Qrad1, k1 * Aradiator1, cTr1)
    const {dVdT: Vflowrate2} = resolveControlVolume(Qrad2, k2 * Aradiator2, cTr1)

    updateArray(_Tin, Tin1, (a) => setTin1(a))
    updateArray(_Tout, Tout1, (a) => setTout1(a))
    updateArray(Vflowrate1 * r1, v1, (a) => setV1(a))
    
    const _P1 = (_Tin - _Tout) * CP_WATER * D_WATER * Vflowrate1 * r1 * (1/comprEffeciency)  // W
    updateArray(_P1, p1, (a) => setP1(a))

    updateArray(_Tin, Tin2, (a) => setTin2(a))
    updateArray(_Tout, Tout2, (a) => setTout2(a))
    updateArray(Vflowrate2 * r2 , v2, (a) => setV2(a))

    const _P2 = (_Tin - _Tout) * CP_WATER * D_WATER * Vflowrate2 * r2 * (1/comprEffeciency) // W
    updateArray(_P2, p2, (a) => setP2(a))

    const dU1_new = Qrad1_real + Qrad2_real - (QLoss1_outside)
    const dT1_new = dU1_new / ( k * V)

    const _Tr1 = cTr1 + dT1_new

    updateArray(_Tr1, Tr1, (a) => setTr1(a))
    updateArray(_Tr1, Tr2, (a) => setTr2(a))
}

const doCalculations = () => {
        if(!animationRunning) return; 

        const cFirstHeight = firstTemperature.at(-1)

        const percentageFirst = 100 * ((outsideHeight - cFirstHeight)/100) 
        const cLossFirst = percentageFirst * 0.01 * (isLargerRoom ? 1.15 : 1) * (isInsolation ? 0.5 : 1)

        const pFirst = cLossFirst * 5 * (isLargerRoom ? 1.4 : 1) * (isNewRadiator ? 0.75 : 1)  + (cFirstHeight - requiredHeight) * 0.01

        const newT1 = cFirstHeight - (pFirst) + cLossFirst * 5 * (isLargerRoom ? 1.4 : 1) * (isNewRadiator ? 0.75 : 1) 


        let t1Array = [...firstTemperature]
        if(t1Array.length > 139){
            t1Array.shift()
        }
        t1Array.push(newT1)

        setFirstTemperature(t1Array)

        let l1Array = [...firstLoss]
        if(l1Array.length > 139){
            l1Array.shift()
        }
        l1Array.push(cLossFirst)

        setFirstLoss(l1Array)

        let p1Array = [...firstPower]
        if(p1Array.length > 139){
            p1Array.shift()
        }
        p1Array.push(pFirst)

        setFirstPower(p1Array)

        let lrArray = [...isLargerRoomArray]
        if(lrArray.length > 139){
            lrArray.shift()
        }
        lrArray.push(isLargerRoom)

        setIsLargerRoomArray(lrArray)

        let nrArray = [...isNewRadiatorArray]
        if(nrArray.length > 139){
            nrArray.shift()
        }
        nrArray.push(isNewRadiator)

        setIsNewRadiatorArray(nrArray)

        let insArray = [...isInsolationArray]
        if(insArray.length > 139){
            insArray.shift()
        }
        insArray.push(isInsolation)

        setIsInsolationArray(insArray)
    }

    const getValues = () => {
        const cFirstHeight = firstTemperature.at(-1)
        
        const cLossFirst = firstLoss.at(-1)

        const pFirst = firstPower.at(-1)

        let isLargerRoomLines = [0]

        for(const [ci, c] of isLargerRoomArray.entries()){
            const nextC = isLargerRoomArray[ci + 1]

            if(!Object.is(nextC, undefined) && !Object.is(c, nextC)){

                isLargerRoomLines.push(ci)
            }
        }      
        
        let isNewRadiatorLines = [0]

        for(const [ci, c] of isNewRadiatorArray.entries()){
            const nextC = isNewRadiatorArray[ci + 1]

            if(!Object.is(nextC, undefined) && !Object.is(c, nextC)){

                isNewRadiatorLines.push(ci)
            }
        }

        let isInsulationLines = [0]

        for(const [ci, c] of isInsolationArray.entries()){
            const nextC = isInsolationArray[ci + 1]

            if(!Object.is(nextC, undefined) && !Object.is(c, nextC)){

                isInsulationLines.push(ci)
            }
        }

        const hRoomSize = isLargerRoomArray[clickIndex]
        const hRadiatorType = isNewRadiatorArray[clickIndex]
        const hInsulation = isInsolationArray[clickIndex]

        return ({cFirstHeight, cLossFirst, pFirst, isLargerRoomLines, isNewRadiatorLines, isInsulationLines, hRoomSize, hRadiatorType, hInsulation})
    }

    const {cFirstHeight, cLossFirst, pFirst, isLargerRoomLines, isNewRadiatorLines, isInsulationLines, hRoomSize, hRadiatorType, hInsulation} = getValues()

    const convertToTemperature = (h) => parseFloat((24 - (24-18) * ((h-520)/(580-520))).toFixed(1))
    const dampenTemperature = (t) => 620 - (620 - t) * 0.38 
    const convertP = (p, factor = 8000) => (130 - (p/factor) * 90)
    const standarizeValue = (v, factor = 8000) =>  Math.trunc((10 *v)/factor)
    const matrix = [40, 55, 70, 85, 100, 115, 130];

    const getCurrentLines = (cP) => {

        for (let i = 0; i < matrix.length - 1; i++) {
            if (cP >= matrix[i] && cP <= matrix[i + 1]) {
              return [matrix[i], matrix[i + 1]];
            }
        }

        return []
    }

    const getSpeedMatrix = (v) => [...Array(standarizeValue(v, 17000)).keys()]
    
    const getSpeedColor = (l) => {
        const list = ['green', 'lightgreen', '#FFEA00 ', 'orange', 'tomato', 'red']

        return list[l]
    }


    const updateArray = (value, array, setFunction) => {
        let nrArray = [...array]
        if(nrArray.length > 139){
            nrArray.shift()
        }
        nrArray.push(value)

        setFunction(nrArray)
    }

    const borderLinesFirst = getCurrentLines(convertP(p.at(-1), 2000))
    const borderLinesSecond = getCurrentLines(convertP(cop.at(-1), 15))

    const renderLines = (x, y, lines, array, seperator = isLargerRoom, name1 = "L", name2 = "S", color1 = 'rgba(0,255,255,0.3)', color2 = "rgba(0,255,0,0.3)", height = 10) => {
        return(
            <svg x={x} y={y} >
                {lines.map((l, li) => {
                    const nextL = lines[li+1]
                    const _seperator = nextL && array[nextL + 1]

                        if(nextL){
                                return(<rect x={l} width={nextL - l} y={0} height={height} fill={_seperator ? color1 : color2} stroke="rgba(0,0,0,0.15)"/>)
                            }

                            
                            if(!nextL){
                                return(<rect x={l} width={array.length - l} y={0} height={height} fill={!seperator ? color1 : color2} stroke="rgba(0,0,0,0.15)"/>)
                            }
                           
                            return
                    })}

                        {lines.map((l, li) => {
                            const nextL = lines[li+1]
                            const _seperator = nextL && array[nextL + 1]
                           
                            if(nextL){
                                return(<text fill="rgba(0,0,0, 0.75)" x={(nextL + l) * 0.5} y={10 } fontSize="12px">{!_seperator ? name1 : name2}</text>)

                            }
                            
                             if(!nextL){
                                return(<text fill="rgba(0,0,0, 0.75)" x={0.5 * (array.length + l)} y={10 } fontSize="12px">{seperator ? name1 : name2}</text>)
                            }
                            
                            return
                        })}
            </svg>
        )
    }

    const convertToY = (T) => {
        const r = (T - 18)/(24-18);

        const h = 580 - r * (580-520);

        return h
    }

    const convertToYOutside = (T) => {
        const r = (T + 10)/(15 + 10);

        const h = 630 - r * (630-550);

        return h
    }

    const convertToTOutside = (h) => {
        const r = ((h-550)/(630-550))
        return parseFloat((15 - (15+10) * r).toFixed(1))
    }

    const getHoveredArray = () => {
        switch (hoveredArrayName){
            case Q_L_1:
                return ql1

            case Q_L_2:
                return ql2

            case Q_12:
                return qf12

            case Q_RAD_1:
                return qrad1

            case Q_RAD_2:
                return qrad2

            case C_T1:
                return Tr1

            case C_T2:
                return Tr2
            
            default:
                return []
        }
    }

    const getHoveredUnit = () => {
        switch (hoveredArrayName){
            case Q_L_1:
            case Q_L_2:
            case Q_12:
            case Q_RAD_1:
            case Q_RAD_2:
                return C_KW

            case C_T1:
            case C_T2:
                return C_C
            
            default:
                return ""
        }
    }

    const getHoveredFactor = () => {
        switch (hoveredArrayName){
            case Q_L_1:
            case Q_L_2:
                return 6000
            case Q_12:
                return 2000
            case Q_RAD_1:
            case Q_RAD_2:
                return 6000

            case C_T1:
            case C_T2:
                return 30
            
            default:
                return ""
        }
    }

    const hoveredArray = getHoveredArray()
    const hoveredUnit = getHoveredUnit()
    const HoveredFactor = getHoveredFactor()
    const Toutpump = (addSecondRadiator ? (v1.at(-1) * Tout1.at(-1) + v2.at(-1) * Tout2.at(-1)) * 1/(v1.at(-1) + v2.at(-1)) : Tout1.at(-1))
    const renderAnimation = () => {
        return(
            <div>

                    <svg 
                    ref={svgRef}
                    style={{width:780, height:700, border:'1px solid #D7D8D9', borderRadius:8, cursor: "default" /* showMouseLine ? "crosshair" : "default" */}}
                    onMouseMove={(e) => {
                        e.persist()
                        const {pageX, pageY} = e

                        if(svgRef && svgRef.current){
                            const {x, y} = svgRef.current.getBoundingClientRect()
                            setMouseX(pageX - x)
                            setMouseY(pageY - y)

                            if(isMovingOutsideTemperature){
                                let _y = pageY- y
                                _y = Math.max(550, Math.min(630, _y))

                                _y = convertToTOutside(_y)

                                setToutside(_y)
                            }

                            if(isMovingRequiredTemperature){
                                let _y = pageY- y
                                _y = Math.max(520, Math.min(580, _y))

                                _y = convertToTemperature(_y)

                                setT1(_y)
                            }
                        }                        
                    }}

                    onClick={(e) => {
                        if(isMovingOutsideTemperature) {
                            setIsMovingOutsideTemperature(!isMovingOutsideTemperature);
                            return
                        }

                        if(isMovingRequiredTemperature) {
                            setIsMovingRequiredTemperature(!isMovingRequiredTemperature);
                            return
                        }

                        if(!showMouseLine) return;
                        if(Object.is(clickIndex, null)) return;

                        e.persist()

                        const h = firstTemperature[clickIndex]

                        if(h){
                            const p = firstPower[clickIndex]
                            const c = firstLoss[clickIndex]
                            const rs = isLargerRoomArray[clickIndex]
                            const rad = isNewRadiatorArray[clickIndex]
                            const ins = isInsolationArray[clickIndex]
                                
                            updateArray(h, firstTemperature, (l) => setFirstTemperature(l))
                            updateArray(p, firstPower, (l) => setFirstPower(l))
                            updateArray(c, firstLoss, (l) => setFirstLoss(l))
                            updateArray(rs, isLargerRoomArray, (l) => setIsLargerRoomArray(l))
                            setIsLargerRoom(rs)
                            updateArray(rad, isNewRadiatorArray, (l) => setIsNewRadiatorArray(l))
                            setIsNewRadiator(rad)
                            updateArray(ins, isInsolationArray, (l) => setIsInsolationArray(l))
                            setIsInsolation(ins)
                        }

                    }}
                    >
                    {/*showMouseLine && <line x1={mouseX} x2={mouseX} y1={40} y2={130} stroke="orange" />*/}
                    <svg x={80}>
                        {/* Cost */}
                        <svg x={540} y={20} ref={costMeterRef} style={{cursor:'pointer'}} onClick={() => setCostMeterTourOpen(true)}>
                            <text x={51} y={17} fill="green" fontSize="20px">{cost.toFixed(2)} €</text>
                            <text x={51} y={30} fill="gray" fontSize="10px">per hour</text>
                            <image 
                                href={MoneyCounter}
                                width={50}
                                x={0}
                                y={0}
                            />
                        </svg>
                        

                        {/* Plot */}
                        <text fill="#0275D8" x={80} y={30} fontSize="14px" ref={powerMeterRef}>P (kW)  {(p.at(-1)/1000).toFixed(2)} </text>
                        <line x1={80} x2={80} y1={40} y2={138} stroke="rgba(0, 0, 0, 0.9)" strokeWidth={2}/>
                        <line x1={72} x2={220} y1={130} y2={130} stroke="rgba(0, 0, 0, 0.9)" strokeWidth={2}/>
                        {p.map((pp, pi) => {
                            const y = (130 - (pp/2000) * 90)

                            const lastPoint = Object.is(p.length - 1, pi) 

                            return(
                                <circle cx={80 + pi} cy={y} r={lastPoint ? 3 : 1} stroke="green" fill="green"/>
                            )
                            
                        })}

                        {matrix.map((m) => {
                            const isBetween = borderLinesFirst.includes(m)
                            return(<line x1={80} x2={220} y1={m} y2={m} stroke={isBetween ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"} />)
                        })}

                        {/* Plot */}
                        <text fill="#0275D8" x={280} y={30} fontSize="14px">COP  {(cop.at(-1)).toFixed(2)} </text>
                        <line x1={280} x2={280} y1={40} y2={138} stroke="rgba(0, 0, 0, 0.9)" strokeWidth={2}/>
                        <line x1={272} x2={420} y1={130} y2={130} stroke="rgba(0, 0, 0, 0.9)" strokeWidth={2}/>
                        {cop.map((p, pi) => {
                            const y = (130 - (p/15) * 90)

                            const lastPoint = Object.is(cop.length - 1, pi) 

                            return(
                                <circle cx={280 + pi} cy={y} r={lastPoint ? 3 : 1} stroke="green" fill="green"/>
                            )
                            
                        })}

                        {matrix.map((m) => {
                            const isBetween = borderLinesSecond.includes(m)
                            return(<line x1={280} x2={420} y1={m} y2={m} stroke={isBetween ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"} />)
                        })}

                        {hoveredArrayName&&
                        <svg x={480} y={0}>
                            <rect x={0} y={0} width={170} height={140} fill="white" />
                            <text fill="#0275D8" x={20} y={30} fontSize="14px">{hoveredArrayName} {hoveredUnit}</text>

                            <line x1={20} x2={20} y1={40} y2={138} stroke="rgba(0, 0, 0, 0.9)" strokeWidth={2}/>
                            <line x1={12} x2={160} y1={130} y2={130} stroke="rgba(0, 0, 0, 0.9)" strokeWidth={2}/>

                            {matrix.map((m) => {
                                return(<line x1={20} x2={160} y1={m} y2={m} stroke={"rgba(0, 0, 0, 0.1)"} />)
                            })}

                            {hoveredArray.map((p, pi) => {
                            const y = (130 - (Math.abs(p)/HoveredFactor) * 90)

                            const lastPoint = Object.is(hoveredArray.length - 1, pi) 

                            return(
                                <circle cx={20 + pi} cy={y} r={lastPoint ? 3 : 1} stroke="green" fill="green"/>
                            )
                            
                        })}
                        </svg>}
                        {/*clickIndex && <text fill="rgba(0,0,0, 0.75)" x={0} y={150} fontSize="12px">{hRoomSize ? "L" : "S"}</text>}
                        <text fill="#0275D8" x={15} y={150} fontSize="12px">Room size</text>

                        {clickIndex && <text fill="rgba(0,0,0, 0.75)" x={0} y={170} fontSize="12px">{hRadiatorType ? "N" : "O"}</text>}
                        <text fill="#0275D8" x={15} y={170} fontSize="12px">Radiator</text>

                        {clickIndex && <text fill="rgba(0,0,0, 0.75)" x={0} y={190} fontSize="12px">{hInsulation ? "Y" : "N"}</text>}
                        <text fill="#0275D8" x={15} y={190} fontSize="12px">Insulation</text>*/}

                        {/*renderLines(80,140,isLargerRoomLines,isLargerRoomArray, isLargerRoom, 'Large', 'Small', 'rgb(199, 252, 248)', 'rgb(217, 252, 199)')}
                        {renderLines(80,160,isNewRadiatorLines,isNewRadiatorArray, isNewRadiator,'New', 'Old', '#E4E7F0', '#E7F4FF')}
                    {renderLines(80,180,isInsulationLines,isInsolationArray, isInsolation,'Yes', 'No', 'rgba(0,0,0,0.05)', 'rgba(243,167,190,0.65)')*/}
                        

                        

                       
                        {/*renderLines(260,140,isLargerRoomLines,isLargerRoomArray, isLargerRoom, 'L', 'S', 'rgb(199, 252, 248)', 'rgb(217, 252, 199)')}
                        {renderLines(260,160,isNewRadiatorLines,isNewRadiatorArray, isNewRadiator,'N', 'O', '#E4E7F0', '#E7F4FF')}
                        {renderLines(260,180,isInsulationLines,isInsolationArray, isInsolation,'Y', 'N', 'rgba(0,0,0,0.05)', 'rgba(243,167,190,0.65)')*/}
                       

                        {/* Outside */}
                        <svg ref={outsideTemperatureRef}>
                        <text 
                            fill="red" x={612} y={convertToYOutside(Toutside)} 
                            fontSize="14px" style={{cursor:'pointer'}} 

                            onMouseEnter={() => setShowTemperatureMeter(true)}
                            onMouseLeave={() => setShowTemperatureMeter(false)}

                            onClick={() => setIsMovingOutsideTemperature(!isMovingOutsideTemperature)}
                        >
                            {Toutside} °C
                        </text>
                        {(isMovingOutsideTemperature || showTemperatureMeter) && 
                            <svg x={645} y={520}>
                                <rect x={20} y={10} width={10} height={120} fill="transparent" stroke="gray" />
                                <text fill="red" x={34} y={20}>°C</text>


                                <line x1={20} x2={30} y1={30} y2={30} stroke="rgb(192, 192, 192)" />
                                <line x1={20} x2={30} y1={50} y2={50} stroke="rgb(192, 192, 192)" />
                                <line x1={20} x2={30} y1={70} y2={70} stroke="rgb(192, 192, 192)" />
                                <line x1={20} x2={30} y1={90} y2={90} stroke="rgb(192, 192, 192)" />
                                <line x1={20} x2={30} y1={110} y2={110} stroke="rgb(192, 192, 192)" />
                                <line x1={20} x2={30} y1={130} y2={130} stroke="rgb(192, 192, 192)" />
                                <rect x={20} y={convertToYOutside(Toutside)-520} width={10} height={650-convertToYOutside(Toutside)} fill="rgba(255, 0, 0, 0.125)" stroke="transparent" />
                                <line x1={12} x2={30} y1={convertToYOutside(Toutside)-520} y2={convertToYOutside(Toutside)-520} stroke="red" />
                                
                            </svg>
                        }
                        </svg>
                        
                        <image 
                            href={houseFull}
                            x={35}
                            y={200}
                            width={500}
                        />  
                        <rect x={97} width={378} y={493} height={125} fill="rgba(255, 255, 255, 1)" />             
                        <rect x={97} width={198} y={493} height={125} fill="transparent" stroke="transparent" ref={controlVolumeRef2}/>             

                        <image 
                            href={heatcraftHPlogo}
                            x={210}
                            y={633}
                            width={160}
                        />

                        {/* pump */}

                        <svg 
                            ref={systemRef}  
                            style={{cursor:'pointer'}}
                            onClick={() => setSystemTourOpen(true)}
                        >
                            <image 
                                href={outsidePump}
                               
                                x={500}
                                y={440}
                                width={70}
                            />


                            <text x={501} y={430} fill="green">COP </text>
                            <text x={540} y={430} fill="gray">{cop.at(-1).toFixed(2)}</text>

                            <text x={501} y={410} fill="green">P</text>
                            <text x={540} y={410} fill="gray">{(p.at(-1)/1000).toFixed(2)} kW</text>

                            <text fill="red" x={580} y={460}>{((!addSecondRadiator || isFirstTHigher) ? Tin1.at(-1) : Tin2.at(-1)).toFixed(1)}</text>
                            <text fill="red" x={610} y={460}>°C</text>

                            <text fill="blue" x={580} y={480}>{(Toutpump).toFixed(1)}</text>
                            <text fill="blue" x={610} y={480}>°C</text>
                        </svg>
                        
                        {/* Room 1 */}
                        <image 
                            href={painting2}
                            width={28}
                            x={200}
                            y={498}
                        />
                        <svg
                        ref={radiatorRef}
                        >
                            {/* Radiator 1 */}
                        <Tooltip
                            color="white"
                            title={
                            <Space direction="vertical" align="center">
                            <p className="default-title">{!isNewRadiator ? "New radiator": "Old radiator"}</p>
                            <img 
                                src={!isNewRadiator ? radiator3: radiator1}
                                width={90}
                            /> 
                            </Space> 
                        }

                        >
                        {!isNewRadiator ?
                        <svg
                        style={{cursor:'pointer'}}
                        onClick={() => setIsNewRadiator(!isNewRadiator)}
                        x={100} y={560}>
                            <image 
                                href={radiator1_start}
                                x={0}
                                y={0}
                                width={23}                            
                            />
                            {Array(radN1).fill(0).map((c, ci) => 
                            <image 
                                href={radiator1_middle}
                                x={23 + 5.7*ci}
                                y={0}
                                width={5.7}
                                key={ci}
                            />)}
                            <image 
                                href={radiator1_end}
                                x={23+5.7*radN1}
                                y={0}
                                width={9.6}                            
                            />
                        </svg> 
                        : 
                        <svg
                        style={{cursor:'pointer'}}
                        onClick={() => setIsNewRadiator(!isNewRadiator)}
                        x={100} y={560}>
                            <image 
                                href={radiator3_start}
                                x={0}
                                y={0}
                                width={14.5}                            
                            />
                            {Array(radN1).fill(0).map((c, ci) => 
                            <image 
                                href={radiator3_middle}
                                x={14.5 + 7*ci}
                                y={0}
                                width={7}
                                key={ci}
                            />)}
                            <image 
                                href={radiator3_end}
                                x={14.5+7*radN1}
                                y={0}
                                width={14.5}                            
                            />
                        </svg> }
                        </Tooltip> 
                        
                        <image 
                            href={radiatorsRays}
                            x={105}
                            y={535}
                            width={30}
                        >
                            <animate
                                 attributeName="x"
                                 begin="0s"
                                 dur="4s"
                                 values="135;105;125;105;135;115;135"
                                 repeatCount="indefinite"
                            />
                        </image>
                        <line x1={isNewRadiator ? (127 + radN1*7) : (133 + radN1*5.7)} x2={isNewRadiator ? (152 + radN1*7) : (158 + radN1*5.7) } y1={585} y2={585} stroke="blue" strokeWidth={2}/>
                        <svg x={isNewRadiator ? (148 + radN1*7) : (151 + radN1*5.7)} y={575}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>
                        </svg>

                                                        
                        
                        {!isLargerRoom && 
                        <Tooltip
                            color="white"
                            title={
                                <Space size="small">
                                    <HomeOutlined className="default-title"/>
                                    <p>Enlarge heated space</p>
                                </Space>
                            }
                        >
                            <line x1={300} x2={300} y1={485} y2={619} stroke="#454545" strokeWidth={8} style={{cursor:'pointer'}} onClick={() => setIsLargerRoom(true)}/>
                        </Tooltip> }            

                        {/* Room 2 */}
                        <image 
                            href={painting1}
                            width={25}
                            x={330}
                            y={498}
                        />
                        {/* Additional radiator */}
                        {!addSecondRadiator &&
                        <Tooltip
                            color="white"
                            title={
                                <Space>
                                    <PlusOutlined className="default-green" />
                                    <p>Add radiator</p>
                                </Space>
                            }
                        >
                            <rect
                            onClick={() => setAddSecondRadiator(true)}
                            x={370} y={550} width={90} height={60} stroke={"rgba(0,0,0,0.8)"} strokeDasharray="5" fill="transparent" strokeWidth={1} style={{cursor:'pointer'}}/>
                        </Tooltip>}

                        {/* Radiator 2 */}
                        {addSecondRadiator && 
                        <Tooltip
                            color="white"
                            title={
                            <Space direction="vertical" align="center">
                            <p className="default-title">{!isNewRadiatorSecond ? "New radiator": "Old radiator"}</p>
                            <img 
                                src={!isNewRadiatorSecond ? radiator3: radiator1}
                                width={90}
                            /> 
                            </Space> 
                        }
                        >
                        {!isNewRadiatorSecond?
                        <svg
                        style={{cursor:'pointer'}}
                        onClick={() => setIsNewRadiatorSecond(!isNewRadiatorSecond)}
                        x={430 - radN2*5.7} y={560} >
                            <image 
                                href={radiator1_start}
                                x={0}
                                y={0}
                                width={23}                            
                            />
                            {Array(radN2).fill(0).map((c, ci) => 
                            <image 
                                href={radiator1_middle}
                                x={23 + 5.7*ci}
                                y={0}
                                width={5.7}
                                key={ci}
                            />)}
                            <image 
                                href={radiator1_end}
                                x={23+5.7*radN2}
                                y={0}
                                width={9.6}                            
                            />
                        </svg> 
                        : 
                        <svg
                        style={{cursor:'pointer'}}
                        onClick={() => setIsNewRadiatorSecond(!isNewRadiatorSecond)}
                        x={440 - radN2*7} y={560}>
                            <image 
                                href={radiator3_start}
                                x={0}
                                y={0}
                                width={14.5}                            
                            />
                            {Array(radN2).fill(0).map((c, ci) => 
                            <image 
                                href={radiator3_middle}
                                x={14.5 + 7*ci}
                                y={0}
                                width={7}
                                key={ci}
                            />)}
                            <image 
                                href={radiator3_end}
                                x={14.5+7*radN2}
                                y={0}
                                width={14.5}                            
                            />
                            
                        </svg>} 
                        </Tooltip>}
                        {addSecondRadiator && 
                        <image 
                            href={radiatorsRays}
                            x={396}
                            y={535}
                            width={30}
                        >
                            <animate
                                 attributeName="x"
                                 begin="0s"
                                 dur="4s"
                                 values="395;410;420;410;420;410;395"
                                 repeatCount="indefinite"
                            />
                        </image>}

                        {addSecondRadiator && 
                        <line x1={isNewRadiatorSecond ? (445 - 7*radN2) : (430 - 5.7*radN2)} x2={isNewRadiatorSecond ? (420 - 7*radN2) : (400 - 5.7*radN2)} y1={585} y2={585} stroke="blue" strokeWidth={2}/>}

                        {addSecondRadiator &&
                        <svg x={!isNewRadiatorSecond ? (395 - 5.7*radN2) : (405 - 7*radN2)} y={575}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>}
                        
                       {cLossFirst && 
                       <svg x={isLargerRoom ? 500 : 290} y={560}>
                            <line x1={0} y1={5} x2={30 * cLossFirst} y2={5} stroke="red" strokeWidth={3}/>
                            <svg x={30 * cLossFirst} y={0}>
                                <path d="M 0 0 L 10 5 L 0 10 z"  stroke="red" fill="red"/>
                            </svg>
                        </svg>}

                        {cLossFirst && 
                       <svg x={20} y={560} transform="rotate(180deg)">
                            <line x1={60} y1={5} x2={60 - 30 * cLossFirst} y2={5} stroke="red" strokeWidth={3}/>
                            <svg x={50 - 30 * cLossFirst} y={0}>
                                <path d="M 10 0 L 10 10 L 0 5 z"  stroke="red" fill="red"/>
                            </svg>
                        </svg>}

                        {Tr1.at(-1) > 14 && 
                        <line x1={97} x2={isLargerRoom ? 476 : 298} y1={convertToY(Tr1.at(-1))} y2={convertToY(Tr1.at(-1))} stroke="rgba(255, 0, 0, 0.35)" strokeWidth={2}/> }
                        <text fill="red" x={110} y={515} fontSize="14px">{Tr1.at(-1).toFixed(1)} °C</text>
                        
                        {!isLargerRoom&&  Tr2.at(-1) > 14 && 
                        <line x1={303} x2={476} y1={convertToY(Tr2.at(-1))} y2={convertToY(Tr2.at(-1))} stroke="rgba(255, 0, 0, 0.35)" strokeWidth={2}/>}
                        {!isLargerRoom && <text fill="red" x={415} y={515} fontSize="14px">{Tr2.at(-1).toFixed(1)} °C</text>}
                        
                       
                        
                        <text fill={isMovingRequiredTemperature? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.55)"} x={20} y={convertToY(T1)+4} fontSize="12px">{T1} °C</text>
                        
                        <line 
                            x1={60} y1={convertToY(T1)} 
                            x2={515} y2={convertToY(T1)} 
                            stroke="rgba(0, 0, 0, 0.2)" strokeWidth={4} 
                            style={{cursor:'pointer'}}
                            onClick={() => setIsMovingRequiredTemperature(!isMovingRequiredTemperature)}
                        />
                        
                        </svg>
                        
                        <svg ref={insulationRef} >
                        {isInsolation ?
                        <Tooltip
                            color="white"
                            title={
                            <Space size="small">
                                <MinusOutlined className="default-red"/>
                                <p>Remove insulation</p>
                            </Space>
                        }
                        >
                            <rect x={555} width={8 * (insulationWidth/25)} y={493} height={125} stroke="transparent" fill={"#F990AC"} style={{cursor:'pointer'}} onClick={() => setIsInsolation(false)}/>
                        </Tooltip>
                        :
                        <Tooltip
                            color="white"
                            title={
                            <Space size="small">
                                <PlusOutlined className="default-green"/>
                                <p>Add insulation</p>
                            </Space>}
                        >
                        <svg x={553} y={493} style={{cursor:'pointer'}} onClick={() => setIsInsolation(true)}>
                            <rect x={0} y={0} width={13} height={128} stroke="rgba(0,0,0,0)" fill="rgba(0,0,0,0)"/>
                        </svg>
                        </Tooltip>}
                        </svg>
                            {isInsolation ?
                            <Tooltip
                                color="white"
                                title={<p>Remove insulation</p>}
                            >
                            <rect x={177 - 8 * (insulationWidth/25)} width={8 * (insulationWidth/25)} y={493} height={125} stroke="transparent" fill={"#F990AC"} style={{cursor:'pointer'}} onClick={() => setIsInsolation(false)}/>                          
                        </Tooltip>
                        :
                        <Tooltip
                            color="white"
                            title={<p>Add insulation</p>}
                        >
                        <svg x={168} y={493} style={{cursor:'pointer'}} onClick={() => setIsInsolation(true)}>
                            <rect x={0} y={0} width={13} height={128} stroke="rgba(0,0,0,0)" fill="rgba(0,0,0,0)"/>
                        </svg>
                        </Tooltip>}
                       
                    </svg>
                    {renderRadiatorsStatus()}
                </div>
        )
    }

    const renderControlVolumes = () => {
        const qloss1 = ql1.at(-1)
        const _qrad1 = qrad1.at(-1)
        const Tr1Change =  parseFloat((Tr1.at(-1) - Tr1.at(-2)).toFixed(3))
        const qLoss1Change = parseFloat((ql1.at(-1) - ql1.at(-2)).toFixed(1))
        const qRad1Change = parseFloat((qrad1.at(-1) - qrad1.at(-2)).toFixed(1))
        const q12Change = parseFloat((Math.abs(qf12.at(-1)) - Math.abs(qf12.at(-2))).toFixed(1))

        const _qrad2 = qrad2.at(-1)
        const qloss2 = ql2.at(-1)
        const Tr2Change =  parseFloat((Tr2.at(-1) - Tr2.at(-2)).toFixed(3))
        const qLoss2Change = parseFloat((ql2.at(-1) - ql2.at(-2)).toFixed(1))
        const qRad2Change = parseFloat((qrad2.at(-1) - qrad2.at(-2)).toFixed(1))

        const q12 = qf12.at(-1)

        if(!isLargerRoom){
            const wLoss1 = 75 * ((qloss1/1000) * (1/3))
            const wLoss12 = 75 * ((Math.abs(q12)/1000) * (1/3))
            const wRad1= 75 * ((_qrad1/1000) * (1/3))

            const wLoss2 = 75 * ((qloss2/1000) * (1/3))
            const wRad2= 75 * ((_qrad2/1000) * (1/3))

            return(
                <Space direction="vertical" size="small">
                    <svg width={400} height={360}>
                        <image 
                            href={painting2}
                            width={28}
                            x={110}
                            y={50}
                        />
                        <rect x={100} y={40} width={200} height={200} fill="transparent" stroke="gray" strokeDasharray={2} ref={controlVolumeRef} style={{cursor:'pointer'}} onClick={() => setControlVolumeTourOpen(true)}/>
                        
                        {isInsolation && 
                            <rect x={100} width={4 * (insulationWidth/25)} y={40} height={200} stroke="transparent" fill={"#F990AC"} style={{cursor:'pointer'}} onClick={() => setIsInsolation(false)}/>
                        }

                        <text fill="gray" x={170} y={30} fontSize="14px">Room #1</text>                        

                        <text fill="gray" x={10} y={280} fontSize="14px" style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_L_1)} onMouseLeave={() => setHoveredArrayName(null)}>QL outside</text>
                        <text fill="gray" x={100} y={280} fontSize="14px">{(qloss1/1000).toFixed(3)} kW</text>

                        <text fill="gray" x={10} y={310} fontSize="14px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_12)} onMouseLeave={() => setHoveredArrayName(null)}>QL 1-2</text>
                        <text fill="gray" x={100} y={310} fontSize="14px">{(Math.abs(q12)/1000).toFixed(3)} kW</text>

                        <text fill="gray" x={10} y={340} fontSize="14px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_RAD_1)} onMouseLeave={() => setHoveredArrayName(null)}>Q rad </text>
                        <text fill="gray" x={100} y={340} fontSize="14px">{(_qrad1/1000).toFixed(3)} kW</text>
                        
                        <text fill="gray" x={30} y={120} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_L_1)} onMouseLeave={() => setHoveredArrayName(null)}>QL outside</text>
                        <path d={`M 110 135 L 110 145 L 100 145 L ${100-wLoss1} 145 L ${100-wLoss1} 150 L ${85-wLoss1} 140 L ${100-wLoss1} 130 ${100-wLoss1} 135 L 100 135 L 110 135 z`} fill="red" stroke="red"/>
                    
                        <text fill="gray" x={310} y={120} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_12)} onMouseLeave={() => setHoveredArrayName(null)}>QL 1-2</text>
                        
                        {q12 > 0 ?
                        <path d={`M 290 135 L 290 145 L 300 145 L ${300+wLoss12} 145 L ${300+wLoss12} 150 L ${315+wLoss12} 140 L ${300+wLoss12} 130 ${300+wLoss12} 135 L 300 135 L 290 135 z`} fill={Math.trunc(q12) ? "red" : "gray"} stroke={Math.trunc(q12) ? "red" : "gray"}/>:
                        <path d={`M 310 135 L 310 145 L 300 145 L ${300-wLoss12} 145 L ${300-wLoss12} 150 L ${285-wLoss12} 140 L ${300-wLoss12} 130 ${300-wLoss12} 135 L 300 135 L 310 135 z`} fill={Math.trunc(q12) ? "green" : "gray"} stroke={Math.trunc(q12) ? "green" : "gray"}/>}

                        <text fill="gray" x={215} y={255} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_RAD_1)} onMouseLeave={() => setHoveredArrayName(null)}>Q rad</text>
                        <path d={`M 195 250 L 205 250 L 205 240 L 205 ${240-wRad1} L 210 ${240-wRad1} L 200 ${225-wRad1} L 190 ${240-wRad1} L 195 ${240-wRad1} L 195 240 L 195 250 z`} fill={Math.trunc(_qrad1) ? "green" : "gray"} stroke={Math.trunc(_qrad1) ? "green" : "gray"}/>

                        <text fill="red" x={180} y={70} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(C_T1)} onMouseLeave={() => setHoveredArrayName(null)}>{Tr1.at(-1).toFixed(1)} °C</text>

                        {Tr1Change && <text fill={Tr1Change > 0 ? "green" : "red"} x={163} y={70} fontSize="12px">
                            {Tr1Change > 0 ? '⇈' : '⇊'}
                        </text>}

                        {qLoss1Change && <text fill={qLoss1Change > 0 ? "green" : "red"} x={13} y={120} fontSize="12px">
                            {qLoss1Change > 0 ? '⇈' : '⇊'}
                        </text>}

                        {qRad1Change && <text fill={qRad1Change > 0 ? "green" : "red"} x={255} y={255} fontSize="12px">
                            {qRad1Change > 0 ? '⇈' : '⇊'}
                        </text>}

                        {q12Change && <text fill={q12Change > 0 ? "green" : "red"} x={350} y={120} fontSize="12px">
                            {q12Change > 0 ? '⇈' : '⇊'}
                        </text>}
                    </svg>
                    <svg width={400} height={500} >
                        <image 
                            href={painting1}
                            width={28}
                            x={110}
                            y={50}
                        />
                        <rect x={100} y={40} width={200} height={200} fill="transparent" stroke="gray" strokeDasharray={2} />
                        {isInsolation && 
                            <rect x={300-4 * (insulationWidth/25)} width={4 * (insulationWidth/25)} y={40} height={200} stroke="transparent" fill={"#F990AC"} style={{cursor:'pointer'}} onClick={() => setIsInsolation(false)}/>
                        }
                        <text fill="gray" x={170} y={30} fontSize="14px">Room #2</text>

                        <text fill="gray" x={10} y={280} fontSize="14px" style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_L_2)} onMouseLeave={() => setHoveredArrayName(null)}>QL outside</text>
                        <text fill="gray" x={100} y={280} fontSize="14px">{(qloss2/1000).toFixed(3)} kW</text>

                        <text fill="gray" x={10} y={310} fontSize="14px" style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_12)} onMouseLeave={() => setHoveredArrayName(null)}>QL 1-2</text>
                        <text fill="gray" x={100} y={310} fontSize="14px">{(Math.abs(q12)/1000).toFixed(3)} kW</text>

                        <text fill="gray" x={10} y={340} fontSize="14px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_RAD_2)} onMouseLeave={() => setHoveredArrayName(null)}>Q rad </text>
                        <text fill="gray" x={100} y={340} fontSize="14px">{(_qrad2/1000).toFixed(3)} kW</text>
                        
                        <text fill="gray" x={30} y={120} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_12)} onMouseLeave={() => setHoveredArrayName(null)}>QL 1-2</text>
                        {q12<0 ? 
                        <path d={`M 110 135 L 110 145 L 100 145 L ${100-wLoss12} 145 L ${100-wLoss12} 150 L ${85-wLoss12} 140 L ${100-wLoss12} 130 ${100-wLoss12} 135 L 100 135 L 110 135 z`}  fill={Math.trunc(q12) ? "red" : "gray"} stroke={Math.trunc(q12) ? "red" : "gray"}/> :
                        <path d={`M 90 135 L 90 145 L 100 145 L ${100+wLoss12} 145 L ${100+wLoss12} 150 L ${115+wLoss12} 140 L ${100+wLoss12} 130 ${100+wLoss12} 135 L 100 135 L 110 135 z`}  fill={Math.trunc(q12) ? "green" : "gray"} stroke={Math.trunc(q12) ? "green" : "gray"}/>}

                        <text fill="gray" x={310} y={120} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_L_2)} onMouseLeave={() => setHoveredArrayName(null)}>QL outside</text>
                        <path d={`M 290 135 L 290 145 L 300 145 L ${300+wLoss2} 145 L ${300+wLoss2} 150 L ${315+wLoss2} 140 L ${300+wLoss2} 130 ${300+wLoss2} 135 L 300 135 L 290 135 z`}  fill="red" stroke="red"/>

                        <text fill="gray" x={215} y={255} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_RAD_2)} onMouseLeave={() => setHoveredArrayName(null)}>Q rad</text>
                        <path d={`M 195 250 L 205 250 L 205 240 L 205 ${240-wRad2} L 210 ${240-wRad2} L 200 ${225-wRad2} L 190 ${240-wRad2} L 195 ${240-wRad2} L 195 240 L 195 250 z`} fill={Math.trunc(_qrad2) ? "green" : "gray"} stroke={Math.trunc(_qrad2) ? "green" : "gray"}/>

                        <text fill="red" x={180} y={70} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(C_T2)} onMouseLeave={() => setHoveredArrayName(null)}>{Tr2.at(-1).toFixed(1)} °C</text>

                        {Tr2Change && <text fill={Tr2Change > 0 ? "green" : "red"} x={163} y={70} fontSize="12px">
                            {Tr2Change > 0 ? '⇈' : '⇊'}
                        </text>}

                        {q12Change && <text fill={q12Change > 0 ? "green" : "red"} x={13} y={120} fontSize="12px">
                            {q12Change > 0 ? '⇈' : '⇊'}
                        </text>}

                        {qRad2Change && <text fill={qRad2Change > 0 ? "green" : "red"} x={255} y={255} fontSize="12px">
                            {qRad2Change > 0 ? '⇈' : '⇊'}
                        </text>}

                        {qLoss2Change && <text fill={qLoss2Change > 0 ? "green" : "red"} x={375} y={120} fontSize="12px">
                            {qLoss2Change > 0 ? '⇈' : '⇊'}
                        </text>}
                    </svg>
                    
                </Space>
            )
        }
        else{
            const wLoss1 = 75 * ((qloss1/2000) * (1/3))
            const wRad1= 75 * (((_qrad1 + _qrad2)/2000) * (1/3))

            return(
                <div style={{marginRight:50}}>
                    <svg width={400} height={370}>
                    {isInsolation && 
                            <rect x={100} width={4 * (insulationWidth/25)} y={40} height={200} stroke="transparent" fill={"#F990AC"} style={{cursor:'pointer'}} onClick={() => setIsInsolation(false)}/>
                        }
                        {isInsolation && 
                            <rect x={300 - 4 * (insulationWidth/25)} width={4 * (insulationWidth/25)} y={40} height={200} stroke="transparent" fill={"#F990AC"} style={{cursor:'pointer'}} onClick={() => setIsInsolation(false)}/>
                        }
                        <rect x={100} y={40} width={200} height={200} fill="transparent" stroke="gray" strokeDasharray={2} ref={controlVolumeRef} style={{cursor:'pointer'}} onClick={() => setControlVolumeTourOpen(true)}/>
                        <text fill="gray" x={170} y={30} fontSize="14px">Room</text>

                        <text fill="gray" x={10} y={280} fontSize="14px" style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_L_1)} onMouseLeave={() => setHoveredArrayName(null)}>QL outside</text>
                        <text fill="gray" x={100} y={280} fontSize="14px">{(qloss1/1000).toFixed(2)} kW</text>

                        <text fill="gray" x={10} y={310} fontSize="14px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_RAD_1)} onMouseLeave={() => setHoveredArrayName(null)}>Q rad </text>
                        <text fill="gray" x={100} y={310} fontSize="14px">{((_qrad1+_qrad2)/1000).toFixed(2)} kW</text>
                        
                        <text fill="gray" x={30} y={120} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_L_1)} onMouseLeave={() => setHoveredArrayName(null)}>QL outside</text>
                        <path d={`M 110 135 L 110 145 L 100 145 L ${100-wLoss1} 145 L ${100-wLoss1} 150 L ${85-wLoss1} 140 L ${100-wLoss1} 130 ${100-wLoss1} 135 L 100 135 L 110 135 z`} fill="red" stroke="red"/>
                    
                        <text fill="gray" x={215} y={255} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(Q_RAD_1)} onMouseLeave={() => setHoveredArrayName(null)}>Q rad</text>
                        <path d={`M 195 250 L 205 250 L 205 240 L 205 ${240-wRad1} L 210 ${240-wRad1} L 200 ${225-wRad1} L 190 ${240-wRad1} L 195 ${240-wRad1} L 195 240 L 195 250 z`} fill="green" stroke="green"/>

                        <text fill="red" x={180} y={70} fontSize="12px"  style={{cursor:'zoom-in'}} onMouseEnter={() => setHoveredArrayName(C_T1)} onMouseLeave={() => setHoveredArrayName(null)}>{Tr1.at(-1).toFixed(1)} °C</text>

                        {Tr1Change && <text fill={Tr1Change > 0 ? "green" : "red"} x={163} y={70} fontSize="12px">
                            {Tr1Change > 0 ? '⇈' : '⇊'}
                        </text>}

                        {qLoss1Change && <text fill={qLoss1Change > 0 ? "green" : "red"} x={13} y={120} fontSize="12px">
                            {qLoss1Change > 0 ? '⇈' : '⇊'}
                        </text>}

                        {qRad1Change && <text fill={qRad1Change > 0 ? "green" : "red"} x={255} y={255} fontSize="12px">
                            {qRad1Change > 0 ? '⇈' : '⇊'}
                        </text>}

                        
                    </svg>
                </div>
            )
        }
        
    }

    const renderControls = () => {
        return(
            <div>
                <Space direction="vertical">
                <small className="default-gray">Room size</small>
                <ButtonGroup>
                    <Button 
                    size="large" type="default" onClick={() => setIsLargerRoom(false)} className={isLargerRoom ? "default-gray" : "default-title"}
                    >
                        <HomeOutlined className={(isLargerRoom ? "default-gray" : "default-title")}/>
                    </Button>
                    <Button 
                    size="large" type="default" onClick={() => setIsLargerRoom(true)} className={(isLargerRoom ? "default-title" : "default-gray")}
                    >
                        <HomeOutlined className={"default-x-larger " + (isLargerRoom ? "default-title" : "default-gray")}/>
                    </Button>
                </ButtonGroup>

                <Space ref={radiatorSizeRef} direction="vertical" size="small">
                <small className="default-gray">Radiator size</small>
                <Input 
                    type="number"

                    min={MIN_RAD_N_1}
                    max={MAX_RAD_N_1}

                    value={radN1} 
                    prefix={<p className="default-gray default-small" style={{marginRight:20}}>N1</p>}
                    
                    style={{width:100}}

                    onChange={(v) => {
                        let n = v.target.value;

                        n = Math.max(MIN_RAD_N_1, Math.min(MAX_RAD_N_1, n))

                        setRadN1(n)

                    }} 
                />
                </Space>
                {addSecondRadiator && 
               <Input 
               type="number"

               min={MIN_RAD_N_1}
               max={MAX_RAD_N_1}

               value={radN2} 
               prefix={<p className="default-gray default-small" style={{marginRight:20}}>N2</p>}
               
               style={{width:100}}

               onChange={(v) => {
                   let n = v.target.value;

                   n = Math.max(MIN_RAD_N_1, Math.min(MAX_RAD_N_1, n))

                   setRadN2(n)

               }} 
           />}

                <small className="default-gray">Second radiator</small>
                <ButtonGroup>
                    <Button type="default" onClick={() => {
                            setAddSecondRadiator(false)
                            setIsFirstTHigher(false)
                        }} className={addSecondRadiator ? "default-gray" : "default-title"}>
                        No
                    </Button>
                    <Button type="default" onClick={() => setAddSecondRadiator(true)} className={(addSecondRadiator ? "default-title" : "default-gray")}>
                        Yes
                    </Button>
                </ButtonGroup>
                
               <Space direction="vertical" size="small" ref={insulationWidthRef}>
               <Space>
                <small className="default-gray">Insulation</small>
                <FilePdfOutlined className="default-red hq-clickable" onClick={() => window.open(insulationDoc)}/>
               </Space>
               <Space size="large">
               <ButtonGroup>
                    <Button type="default" onClick={() => setIsInsolation(false)} className={isInsolation ? "default-gray" : "default-title"}>
                        No
                    </Button>
                    <Button type="default" onClick={() => setIsInsolation(true)} className={(isInsolation ? "default-title" : "default-gray")}>
                        Yes
                    </Button>

                   
                </ButtonGroup>
                {isInsolation && 
                <Input 
                    type="number"

                    min={1}
                    max={25}

                    value={insulationWidth} 

                    prefix={<p className="default-gray default-small" style={{marginRight:20}}>Insulation width</p>}
                    suffix={<p className="default-gray default-small">cm</p>}
                    
                    style={{strokeWidth:40}}

                    onChange={(v) => {
                        let w = v.target.value;

                        w = Math.max(1, Math.min(25, w))

                        setInsulationWidth(w)

                    }} 
                />}
               </Space>
               </Space>

                <small className="default-gray">Required temperature</small>
                <ButtonGroup>
                    <Button 
                    icon={<PlusOutlined className="default-green"/>}
                    type="default" onClick={() => setT1(Math.max(18, Math.min(24, T1+1)))}>
                        Up
                    </Button>
                    <Button 
                    icon={<MinusOutlined className="default-red"/>}
                    type="default" onClick={() => setT1(Math.max(18, Math.min(24, T1-1)))}>
                        Down
                    </Button>
                </ButtonGroup>

                <Space direction="vertical" ref={outsideTemperaturePotentiometerRef}>
                <Space>
                <small className="default-gray">Outside temperature</small>
                <FilePdfOutlined className="default-red hq-clickable" onClick={() => window.open(copDoc)}/>
               </Space>
                <div 
                    onMouseEnter={() => setShowTemperatureMeter(true)}
                    onMouseLeave={() => setShowTemperatureMeter(false)}
                >
                <ButtonGroup >
                    <Button 
                    icon={<PlusOutlined className="default-green"/>}
                    type="default" onClick={() => setToutside(Math.max(-10, Math.min(15, Toutside+1)))}>
                        Up
                    </Button>
                    <Button 
                    icon={<MinusOutlined className="default-red"/>}
                    type="default" onClick={() => setToutside(Math.max(-10, Math.min(15, Toutside-1)))}>
                        Down
                    </Button>
                </ButtonGroup>
                </div>
                </Space>

                <div ref={costMeterRef2}>
                <small className="default-gray">kWh electricity price</small>
                <Input 
                    type="number"

                    value={kWhCost} 

                    suffix={<p className="default-green default-small">€</p>}
                    
                    onChange={(v) => {
                        let w = v.target.value;

                        setkWhCost(w)

                    }} 
                />
                </div>
                </Space>
            </div>
        )
    }

    const renderRadiatorsStatus = () => {
        const _v1 = v1.at(-1)
        const _v2 = v2.at(-1)

        let _r = addSecondRadiator ? _v2/_v1 : 1

        return(
            <Space size="large" className="hq-full-width hq-opposite-arrangement">
                <Space direction="vertical" ref={radiatorRefStatus}>
                    <small className="default-gray">Radiator #1</small>
                    <Space>
                        <p className="default-title">V <span className="default-gray">{(v1.at(-1) * 1000 * 60).toFixed(3) * r1} {' '} lpm</span></p>
                        <p className="default-title">Tin <span className={isFirstTHigher ? "default-red" : "default-gray"}>{Tin1.at(-1).toFixed(1)} °C</span> </p>
                        <p className="default-title">Tout <span className="default-gray">{Tout1.at(-1).toFixed(1)}  °C</span></p>
                    </Space>
                    <Space align="center">
                    <svg width={90} height={90}>
                        <image 
                            x={0} y={0}
                            href={isNewRadiator ? radiator3 : radiator1}
                            width={90}
                            alt="radiator"
                        />
                        <circle cx={ 49} cy={35} r={12} fill="rgba(255,255,255,0.85)" stroke="blue" />
                        <text stroke="blue" x={Object.is(radN1, 10) ? 41 :45} y={40}>{radN1}</text>
                    </svg>
                    &nbsp;
                    <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={_r <= 1 ? 100 : (100/_r)}
                        style={{width:150}}
                        marks={{[_r <= 1 ? 100 : 100/_r]:_r <= 1 ? "100%":((100/_r).toFixed(1) + "%")}}
                        
                    />
                    </Space>
                </Space>

                {addSecondRadiator && 
                <Space direction="vertical">
                <small className="default-gray">Radiator #2</small>
                <Space>
                    <p className="default-title">V <span className="default-gray">{(v2.at(-1) * 1000 * 60).toFixed(3) * r2} {' '} lpm</span></p>
                    <p className="default-title">Tin <span className={!isFirstTHigher ? "default-red" : "default-gray"}>{Tin2.at(-1).toFixed(1)} °C</span></p>
                    <p className="default-title">Tout <span className="default-gray">{Tout2.at(-1).toFixed(1)} °C</span></p>
                </Space>
                <Space>
                <svg width={90} height={90}>
                    <image 
                        x={0} y={0}
                        href={isNewRadiatorSecond ? radiator3 : radiator1}
                        width={90}
                        alt="radiator"
                    />
                        <circle cx={ 49} cy={35} r={12} fill="rgba(255,255,255,0.85)" stroke="blue" />
                        <text stroke="blue" x={Object.is(radN2, 10) ? 41 :45} y={40}>{radN2}</text>                
                    </svg>
                &nbsp;
                <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={_r > 1 ? (100) : (_r * 100)}
                    style={{width:150}}
                    marks={{[_r > 1 ?100 : 100*_r]:_r > 1 ? "100%":((100*_r).toFixed(1) + "%")}}
                    
                />
                </Space>
                
            </Space>
                }
            </Space>
        )
    }

    const renderCostMeterTour = () => {
        const steps = [ 
            {
            title: 'Heating costs meter',
            description: 'it calculates the cost of heating per hour in euros',
            cover: (
              <img
                alt="tour.png"
                src={CostPerMeter}
              />
            ),
            target: () => costMeterRef.current,
          },{
            title: 'Heating costs meter',
            description: 'this shows the cost of electricity as € per kWh',
            cover: (
              <img
                alt="tour.png"
                src={CostPerMeter}
              />
            ),
            target: () => costMeterRef2.current,
          },{
            title: 'Heating costs meter',
            description: 'Power meter',
            cover: (
                <img
                alt="tour.png"
                src={CostPerMeter}
              />
            ),
            target: () => powerMeterRef.current,
          },{
            title: 'Heating costs meter',
            cover: (
             <Space direction="vertical" align="start">
                <LatexRenderer latex={"$C_{total} = P  \\cdot 1h \\cdot C_{kWh}$"} />
                <LatexRenderer latex={"$C_{total} =" + ((p.at(-1) * 0.001).toFixed(2)) + "\\ kW" + " \\cdot 1h \\cdot" + kWhCost + "\\ \\frac{€}{kWh} = \\color{green}{" + (cost.toFixed(2)) + " \ €} $"} />
             </Space>
            ),
            target: () => costMeterRef.current,
          },];
        return(
            <Tour open={costMeterTourOpen} onClose={() => setCostMeterTourOpen(false)} steps={steps} />
        )
    }

    const renderControlVolumeTour = () => {
        const V = 30 // m^3
    
        const k = 878.62 // J m^-3 K^-1

        const kV = k*V
        const qdT = qrad1.at(-1) - ql1.at(-1) - (isLargerRoom ? 0 : qf12.at(-1))
        const dT = (qdT)/kV
        const cT = Tr1.at(-1)

        const steps = [ 
            {
            title: 'Room control volume',
            description: 'Control volume established to calculate thermodynamic changes in the room and heat pump',
            cover: (
              <img
                alt="tour.png"
                src={controlVolumeImage1}
              />
            ),
            target: () => controlVolumeRef.current,
          },
          {
            title: 'Room control volume',
            description: 'Control volume invloves heat lost to adjacent room, to the outside and that gained from the heating radiator as well as energy needed to increase the temperature if neccessary',
            cover: (
                <Space direction="vertical">
                    <img
                    alt="tour.png"
                    src={controlVolumeImage1}
                    style={{width:250}}
                />
                <LatexRenderer latex={"$ {\\large \\frac{dU}{dt} = kV \\cdot dT = Q_{dT}} $"}/>
                <LatexRenderer latex={"$ {\\large Q_{dT} = Q_{rad} - (Q_{outside} " + (isLargerRoom ? "" : " + Q_{rooms}") + ")}$"}/>
                </Space>
            ),
            target: () => controlVolumeRef2.current,
          },{
            title: 'Room control volume',
            description: 'Control volume established to calculate thermodynamic changes in the room and heat pump',
            cover: (
              <Space direction="vertical" align="start">
                
                <LatexRenderer latex={"$ \\frac{dU}{dt} = kV \\cdot dT = Q_{dT} $"}/>
                <LatexRenderer latex={"$ Q_{dT} = Q_{rad} - (Q_{outside} " + (isLargerRoom ? "" : " + Q_{rooms}") + ")$"}/>
                <LatexRenderer latex={"$---------------$"}/>
                <LatexRenderer latex={"$Q_{outside} = \\color{red}{" + ql1.at(-1).toFixed(0) + "} \\ Watt$"}/>
                {!isLargerRoom && <LatexRenderer latex={"$Q_{rooms} = \\color{red}{" + qf12.at(-1).toFixed(0) + "} \\ Watt$"}/>}
                <LatexRenderer latex={"$Q_{rad} = \\color{green}{" + qrad1.at(-1).toFixed(0) + "} \\ Watt$"}/>
                <LatexRenderer latex={"$---------------$"}/>
                <LatexRenderer latex={"$\\frac{dU}{dt} = Q_{dT} = \\color{" + (qdT > 0 ? "green" : "red") + "}{" + (qdT).toFixed(0) + "} \\ Watt$"}/>
                <LatexRenderer latex={"$dT = \\color{" + (dT > 0 ? "green" : "red") +"}{"+ dT.toFixed(4) + "}\\ °C$"}/>
                <LatexRenderer latex={"$T = " + cT.toFixed(4)  + "\\ °C  + \\color{" + (dT > 0 ? "green" : "red") +"}{"+ dT.toFixed(4) + "}\\ °C = " + (cT+dT).toFixed(4) + "\\ °C$"}/>
              </Space>
            ),
            target: () => controlVolumeRef.current,
          },];
        return(
            <Tour open={controlVolumeTourOpen} onClose={() => setControlVolumeTourOpen(false)} steps={steps} />
        )
    }

    const renderSystemTour = () => {
        const steps = [ 
            {
            title: 'Heat pump system',
            description: 'Heat pumps consist of different elements',
            cover: (
              <img
                alt="tour.png"
                src={heatpumpOverallImage}
              />
            ),
            placement:'top',
            target: () => systemRef.current,
          },
          {
            title: 'Radiator/Condensor',
            description: 
            <Space direction="vertical">
                <p>Condensor receives high temperature and pressure vapor and releases heat to the room. Vapor leaves as liquid with lower but still high pressure and temperature</p>
                <Space size="middle">
                <p className="default-gray"><u>Sources</u></p>
                <Tooltip
                    color="white"
                    title={<p>ehpa/ehi: Thermally driven heat pumps</p>}
                >
                    <FilePdfOutlined  className="hq-clickable default-red default-large" onClick={() => window.open("https://www.ehpa.org/wp-content/uploads/2022/10/220928_Thermally-Driven-Heat-Pumps_technology-report_online-1.pdf")}/>
                </Tooltip>
                </Space>
            
            </Space>,
            cover: (
              <img
                alt="tour.png"
                src={condensorInternalImage}
                style={{width:330}}
              />
            ),
            placement:'top',
            target: () => radiatorRef.current,
          },
          {
            title: 'Heat pump system',
            description: 'This shows the inlet and outlet temperatures and the operating flow rate of the running fluid',
            placement:'top',
            target: () => radiatorRefStatus.current,
          },
          {
            title: 'Heat pump system',
            description: 
            <Space direction="vertical">
                <p>Radiator size can be changed here by varying the number of the radiator sections.</p>
            </Space>,
            cover: (
              <Space align="start" direction="vertical">
                <Space align="center">
                <img 
                    src={lengthArrowImage}
                    alt="length"
                    style={{width:75}}
                />
                <p>Vary the number of the radiator sections <strong className="default-title">N</strong> [4,10]</p>
                </Space>
                <svg height={300}>
                <image 
                                href={radiator3_start}
                                x={0}
                                y={150}
                                width={35} 
                    />
                {Array(10).fill(0).map((c, ci) => 
                    <image 
                                href={radiator3_middle}
                                x={35 + 17*ci}
                                y={150}
                                width={17}
                                key={ci}
                    />)}
                    <image 
                    href={radiator3_end}
                    x={34 + 17*10}
                    y={150}
                    width={35}
                            
                    />
                    <image 
                                href={radiator3_start}
                                x={0}
                                y={0}
                                width={35}                            
                    />
                    {Array(4).fill(0).map((c, ci) => 
                    <image 
                                href={radiator3_middle}
                                x={35 + 17*ci}
                                y={0}
                                width={17}
                                key={ci}
                    />)}
                    <image 
                    href={radiator3_end}
                    x={34 + 17*4}
                    y={0}
                    width={35}                            
                    />
                    

                
                </svg> 
                </Space>
            ),
            placement:'top',
            target: () => radiatorSizeRef.current,
          },{
            title: 'Heat pump system',
            description:
            <Space direction="vertical">
                <p>You can change the type of the radiator by <strong>clicking on it</strong></p>
                <p>Newer radiators have higher heat exchange coeffecient and increased exposure area (kA)</p>
                <p>This means newer radiators can operate at lower operating temperatures</p>
            </Space>,
            cover: (
              <Space>
                <img
                    alt="tour.png"
                    src={radiator1}
                    style={{width:150}}
                />
                <SwapOutlined className="default-x-larger default-title"/>
                <img
                    alt="tour.png"
                    src={radiator3}
                    style={{width:150}}
                />
              </Space>
            ),
            placement:'top',
            target: () => radiatorRef.current,
          },{
            title: 'Heat pump system',
            description: 'The external unit usually includes a heat exchanger and a compressor',
            cover: (
              <img
                alt="tour.png"
                src={externalUnitOverall}
                style={{width:330}}
              />
            ),
            placement:'top',
            target: () => systemRef.current,
          },];
        return(
            <Tour open={systemTourOpen} onClose={() => setSystemTourOpen(false)} steps={steps} placement="top" />
        )
    }

    const renderInsulationTour = () => {

        const steps = [ 
            {
            title: 'Thermal insulation',
            description: 
            <Space direction="vertical" align="start">
                <p>Thermal insulation increases the resistance to heat transfer between the room and the outside.</p>
                <p>Higher resistance means lower heat leaks into or from the room, lowering the required power and increasing COP</p>
               
                <Space size="middle">
                <p className="default-gray"><u>Sources</u></p>
                <FilePdfOutlined  className="hq-clickable default-red default-large" onClick={() => window.open(insulationDoc)}/>
                </Space>
            </Space>,
           
            target: () => insulationRef.current,
          },
          {
            title: 'Thermal insulation',
            description: 'Here you can add/remove insulation and control the desired insulation width',
            
            target: () => insulationWidthRef.current,
          }];
        return(
            <Tour open={insulationTourOpen} onClose={() => setInsulationTourOpen(false)} steps={steps} />
        )
    }

    const renderOutsideTemperatureTour = () => {

        const steps = [ 
            {
            title: 'External temperature',
            description: 
            <Space direction="vertical" align="start">
                <p>Here you can decrease or increase outside temperature</p>
                <p>Lower external temperature leads to higher compressor loads thus lowering COP</p>
               
                <Space size="middle">
                <p className="default-gray"><u>Sources</u></p>
                <FilePdfOutlined  className="hq-clickable default-red default-large" onClick={() => window.open(copDoc)}/>

                </Space>
            </Space>,
            cover: (
              <img
                src={OutsideTemperatureMeterImage}
                alt="tour.png"
                style={{width:250}}
              />
            ),
            target: () => outsideTemperatureRef.current,
          },
          {
            title: 'External temperature',
            description: 
            <Space direction="vertical" align="start">
                <p>Here <strong>too</strong> you can decrease or increase outside temperature</p>
                <p>Lower external temperature leads to higher compressor loads thus lowering COP</p>
               
                <Space size="middle">
                <p className="default-gray"><u>Sources</u></p>
                <FilePdfOutlined  className="hq-clickable default-red default-large" onClick={() => window.open(copDoc)}/>

                </Space>
            </Space>,
            cover: (
            <img
                src={OutsideTemperatureMeterImage}
                alt="tour.png"
                style={{width:250}}
            />
            ),
            target: () => outsideTemperaturePotentiometerRef.current,
          }];
        return(
            <Tour open={outsideTemperatureTourOpen} onClose={() => setOutsideTemperatureTourOpen(false)} steps={steps} />
        )
    }

    return(
        <PagesWrapper>
            {renderCostMeterTour()}
            {renderControlVolumeTour()}
            {renderSystemTour()}
            {renderInsulationTour()}
            {renderOutsideTemperatureTour()}
            <Space direction="vertical">
            <Space>
                <p className="default-title default-large">Environment Setup Simulation</p>                   
        
                <Tooltip
                    color="white"
                    title={<p>Restart animation</p>}
                >
                    <Button size="small" type="default" icon={<RedoOutlined className="default-title"/>}
                        onClick={() => {
                            resetAnimation()
                        }}
                    />
                </Tooltip>
                
                <Tooltip
                    color="white"
                    title={<p>{animationRunning ? "Stop" : "Start "} animation</p>}
                >
                    <Button size="small" type="default" icon={animationRunning ? <PauseOutlined className="default-title"/> : <CaretRightOutlined className="default-title"/>}
                        onClick={() => setAnimationRunning(!animationRunning)}
                    />
                </Tooltip>

                <Tooltip
                    color="white"
                    title={<p>Normal animation speed</p>}
                >
                    <Button size="small" type={Object.is(speed, SPEED_1) ? "primary" : "default"}
                        onClick={() => setSpeed(SPEED_1)}
                        className={Object.is(speed, SPEED_1) ? "" : "default-gray"}
                    >
                        X 1
                    </Button>
                </Tooltip>

               

                <Tooltip
                    color="white"
                    title={<p>x5 animation speed</p>}
                >
                    <Button size="small" type={Object.is(speed, SPEED_5) ? "primary" : "default"}
                        onClick={() => setSpeed(SPEED_5)}
                        className={Object.is(speed, SPEED_5) ? "" : "default-gray"}
                    >
                        X 5
                    </Button>
                </Tooltip>
                <Tooltip
                    color="white"
                    title={<p>x10 animation speed</p>}
                >
                    <Button size="small" type={Object.is(speed, SPEED_10) ? "primary" : "default"}
                        onClick={() => setSpeed(SPEED_10)}
                        className={Object.is(speed, SPEED_10) ? "" : "default-gray"}
                    >
                        X 10
                    </Button>
                </Tooltip>
                <Divider type="vertical"/>
                <ReadOutlined className="default-title default-x-larger"/>
                <Tooltip
                    color="white"
                    title={<p>Cost calculation tutorial</p>}
                >
                    <Button size="small" type={"default"}
                        onClick={() => setCostMeterTourOpen(true)}
                    >
                       €
                    </Button>
                </Tooltip>
                <Tooltip
                    color="white"
                    title={<p>Control volume tutorial</p>}
                >
                    <Button size="small" type={"default"}
                        onClick={() => setControlVolumeTourOpen(true)}
                    >
                       <BorderOuterOutlined />
                    </Button>
                </Tooltip>
                <Tooltip
                    color="white"
                    title={<p>System components tutorial</p>}
                >
                    <Button size="small" type={"default"}
                        onClick={() => setSystemTourOpen(true)}
                    >
                       <BuildOutlined />
                    </Button>
                </Tooltip>
                <Tooltip
                    color="white"
                    title={<p>Thermal insulation tutorial</p>}
                >
                    <Button size="small" type={"default"}
                        onClick={() => setInsulationTourOpen(true)}
                    >
                       <InsertRowRightOutlined />
                    </Button>
                </Tooltip>
                <Tooltip
                    color="white"
                    title={<p>Outside temperature tutorial</p>}
                >
                    <Button size="small" type={"default"}
                        onClick={() => setOutsideTemperatureTourOpen(true)}
                    >
                       <BoxPlotOutlined />
                    </Button>
                </Tooltip>
            </Space>
            <Space size="large" align="start">
                {renderAnimation()}
                {renderControlVolumes()}
                {renderControls()}
            </Space>
            </Space>
        </PagesWrapper>
    )
}