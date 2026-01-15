import {Button, Empty, Input, Select, Slider, Space, Tooltip, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { CP_AIR, CP_WATER, D_AIR, D_WATER, MAX_RAD_N_1, MIN_RAD_N_1, ROOM_HEIGHT, ROOM_WIDTH } from "./Constants";
import {UploadOutlined, DownloadOutlined, PauseOutlined, CaretRightOutlined, FullscreenOutlined, OrderedListOutlined, NodeIndexOutlined, DeleteOutlined, InsertRowLeftOutlined} from '@ant-design/icons';

import radiator3_start from'./radiator 3 start.png';
import radiator3_middle from'./radiator 3 middle.png';
import radiator3_end from'./radiator 3 end.png';

import thermostat from'./thermostatRadiator.png';

import externalUnitHeatPump from'./externalUnitHeatPump.png';
import externalUnitHeatPumpFan from'./externalUnitHeatPumpFan.gif';
import flowrateIcon from'./flowrate.png';
import presetValveIcon from'./prefixedValve.png';
import outdoorWeatherIcon from'./outdoorWeather.png';

import HeatCraftHPLogo from'./HeatCraftHPLogo.png';

import "./index.css"
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { downloadFile, dummyRequest, getBase64 } from "../../../services/Auxillary";

var timer;

export function HydraulicBalancingSimulation(){
    const [Toutside, setToutside] = useState(5)
    const [Tsupply, setTsupply] = useState(55)
    const [Uroom_room, setUroom_room] = useState(0.15)
    const [dpGloabl, setdpGlobal] = useState(0.3)
    const [Kvmax, setKvmax] = useState(0.5)
    const [Krad, setKrad] = useState(8)
    const [Lpipe, setLpipe] = useState(5)
    const [dpipe, setDpipe] = useState(15)

    const [animationRunning, setAnimationRunning] = useState(false)
    const [showQRadRating, setShowQRadRating] = useState(false)
    const [showRoomTemperatureRating, setShowRoomTemperatureRating] = useState(false)
    const [showHeatFlux, setShowHeatFlux] = useState(false)
    const [showRValueRating, setShowRValueRating] = useState(false)

    const [rooms, setRooms] = useState([[{
        nRad:5,
        Treq:20,
        valve:0.6,
        Tc:[15],
        kThermostat:1,
        mFlow:[0],
        qrad:[0],
        Uout:0.3,
        Tout:0
    },{
        nRad:10,
        Treq:20,
        valve:0.6,
        Tc:[20],
        kThermostat:1,
        mFlow:[0],
        qrad:[0],
        Uout:0.3,
        Tout:0
    }, undefined]])

    const [selectedRoomIndex, setSelectedRoomIndex] = useState([0,0])

    const [loadingData, setLoadingData] = useState(false)

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        timer = setInterval(() => {
            if(!animationRunning) return;

            for(const [i,g] of rooms.entries()){
                for(const [j,r] of g.entries()){
                    if(!r) continue;
                    calculatePerRoom(i,j)
                }
            }
        }, (200))

        return () => clearInterval(timer)
    }, [animationRunning, rooms, Toutside, Tsupply, dpGloabl, Kvmax, Krad, Uroom_room])

    const calculateTMix = () => {
        const A = rooms.map((g) => g.map((r) => r ? (r.Tout * r.mFlow) : 0)).flat().reduce((r, c) => r += c, 0)
        const B = rooms.map((g) => g.map((r) => r ? r.mFlow : 0)).flat().reduce((r, c) => r += c, 0)

        const T = A/(B + 0.0000001)

        return T
    }

    const calculateCOP = () => {
        const comprEffeciency = 0.75

        const _T = 5 + Tsupply

        const _cop = comprEffeciency * (_T + 273)/(_T - (Toutside - 5)) 

        return _cop
    }

    
    function RoomUnit({rKey, state, x, y, i, j}){
        const {Treq, mFlow, Tc, nRad, kThermostat, valve} = state
        const _Tc = Tc.at(-1)

        const colorStrength = 0.2 + kThermostat*0.3

        const isSelected = Object.is(selectedRoomIndex[0], i) && Object.is(selectedRoomIndex[1], j)

        return(
            <svg key={rKey} x={x} y={y} width={ROOM_WIDTH} height={ROOM_HEIGHT} >
                
                <text x={10} y={20} fill={isSelected ?  "#0B75BD": "gray"} fontSize={isSelected ?  15: 12} fontWeight={isSelected ?  'bold': 'normal'}>{rKey + 1}</text>
                {isSelected && <rect x={5} y={5} width={rKey > 8 ? 26 : 18} height={20} fill="rgba(11, 117, 189,0.25)" stroke="rgba(11, 117, 189,0.5)"/>}
                <text x={150} y={20} fill="red">{_Tc.toFixed(1)}</text>
                <text x={157} y={30} fill="gray" fontSize={10}>{Treq.toFixed(1)}</text>
                <text x={180} y={20} fill="red" fontSize={14}> °C</text>

                <rect x={0} y={0} width={ROOM_WIDTH} height={ROOM_HEIGHT} 
                className="room-box" 
                
                onClick={() => setSelectedRoomIndex([i,j])}/>
                <svg x={ROOM_WIDTH*0.1} y={ROOM_HEIGHT*0.6}>
                    <image 
                        href={radiator3_start}
                        x={0}
                        y={0}
                        width={14.5}                            
                    />
                    {Array(nRad).fill(0).map((c, ci) => 
                        <image 
                            href={radiator3_middle}
                            x={14.5 + 7*ci}
                            y={0}
                            width={7}
                            key={ci}
                    />)}
                    <image 
                        href={radiator3_end}
                        x={14.5+7*nRad}
                        y={0}
                        width={14.5}                            
                    />
                </svg>

                {/* Thermostat */}
               
                <Tooltip
                    color="white"
                    title={<p>Thermostat</p>}
                >
                <image 
                    href={thermostat}
                    width={25}
                    x={150} y={ROOM_HEIGHT*0.55}
                />
                </Tooltip>

                <rect x={178} y={100 - kThermostat*15} height={kThermostat*15} width={5} fill="rgba(256,165,0,0.5)" stroke="transparent"/>
                <rect x={177} y={84} height={17} width={7} fill="transparent" stroke="rgba(256,165,0,1)"/>
                <line x1={178} x2={183} y1={100 - kThermostat*15} y2={100 - kThermostat*15} stroke="orange"  strokeWidth={2}/>

                {/* lines */}
                {/* in */}
                <rect x={167} y={125} height={4} width={33} fill={"rgba(255,0,0," + colorStrength +")"} stroke="transparent"/>
                <rect x={163} y={122} height={7} width={4} fill={"rgba(255,0,0," + colorStrength +")"} stroke="transparent"/>
                <rect x={42 +7*nRad} y={111} height={4} width={109 - 7*nRad} fill={"rgba(255,0,0," + colorStrength +")"} stroke="transparent"/>

                {/* out */}
                <rect x={42 +7*nRad} y={120} height={4} width={30} fill={"rgba(70, 130, 180,"+ colorStrength +")"} stroke="transparent"/>
                <rect x={72 +7*nRad} y={120} height={45} width={4} fill={"rgba(70, 130, 180,"+ colorStrength +")"} stroke="transparent"/>
            
                {/* flow rate */}
                <image 
                    href={flowrateIcon}
                    width={17}
                    x={8} y={40}
                />
                <text x={28} y={51} fill={"rgba(255,0,0," + colorStrength*2 +")"}>{(mFlow * 60 *1000).toFixed(2)} </text>
                <text x={28} y={61} fill="gray" fontSize={10}>lpm</text>
                
                {/* preset valve */}
                <Tooltip
                    color="white"
                    title={<p>Preset valve value</p>}
                >
                <image 
                    href={presetValveIcon}
                    width={20}
                    x={31} y={93}
                    opacity={0.75}
                />
                </Tooltip>

                <text x={53} y={107} fill="black" fontSize={11}>{valve}</text>
            </svg>
        )
    }

    const checkBoxIsPlaceable = (i, j) => {
        const isAlreadyOccupied = !Object.is(rooms.at(i), undefined) && !Object.is(rooms.at(i).at(j), undefined)
        if(isAlreadyOccupied) return false;

        const isBottomFilled = !i || (!Object.is(rooms.at(i-1), undefined) && !Object.is(rooms.at(i-1).at(j), undefined))

        const isLeftRightFilled = 
        (!Object.is(rooms.at(i), undefined) && !Object.is(rooms.at(i).at(j+1), undefined)) 
        || 
        (!Object.is(rooms.at(i), undefined) && !Object.is(rooms.at(i).at(j-1), undefined))

        if(!(isLeftRightFilled || isBottomFilled)) return false;

        return true
    }

    const renderHouseEdge = () => {
        return(
            <svg>
                {rooms.map((g, i) => (g.map((r, j) => {
                    if(!r) return;

                    const drawWest =  !rooms[i][j-1]
                    const drawEast =  !rooms[i][j+1]
                    const drawSouth = !rooms[i-1] || !rooms[i-1][j]
                    const drawNorth =  !rooms[i+1] || !rooms[i+1][j]

                    return(
                        <svg key={3*i+j}>
                            {drawWest && <line x1={100 + 200*j} x2={100 + 200*j} y1={680-150*(i+1)} y2={680-150*(i+1) + ROOM_HEIGHT} stroke="#0B75BD" strokeWidth={1} />}
                            {drawEast && <line x1={100 + 200*j + ROOM_WIDTH} x2={100 + 200*j + ROOM_WIDTH} y1={680-150*(i+1)} y2={680-150*(i+1) + ROOM_HEIGHT} stroke="#0B75BD" strokeWidth={1} />}
                            {drawSouth && <line x1={100 + 200*j} x2={100 + 200*j + ROOM_WIDTH} y1={680-150*(i+1)+ ROOM_HEIGHT} y2={680-150*(i+1) + ROOM_HEIGHT} stroke="#0B75BD" strokeWidth={1} />}
                            {drawNorth && <line x1={100 + 200*j} x2={100 + 200*j + ROOM_WIDTH} y1={680-150*(i+1)} y2={680-150*(i+1)} stroke="#0B75BD" strokeWidth={1} />}
                        </svg>
                    )
                }).filter(a => a)).flat())}
            </svg>
        )
    }

    const checkRoomIsStable = (j, floor, floorUnder) => {
        let isStable = false 

        switch(j){
            case 0:{
                isStable = (floor[1] && (floorUnder[1] || (floor[2] && floorUnder[2])))
                break;
            }

            case 1:{
                isStable = (floor[0] && floorUnder[0]) || (floor[2] && floorUnder[2])
                break;
            }

            case 2:{
                isStable = (floor[1] && (floorUnder[1] || (floor[0] && floorUnder[0])))
                break;
            }
        }

        return isStable
    }

    const checkNeighboursAreStable = (j, floor, floorUnder) => {
        let isStable = false 

        switch(j){
            case 0:{
                isStable = true
                break;
            }

            case 1:{
                isStable = (floor[0] ? floorUnder[0] : true) && (floor[2] ? floorUnder[2] : true)
                break;
            }

            case 2:{
                isStable = true
                break;
            }
        }

        return isStable
    }

    const renderRoomsList = () => {
        const _options = rooms.map((g,i) => (g.map((r, j) => r ? [i,j]: null))).flat().filter(a => a)

        const rowIndex = selectedRoomIndex[0]
        const columnIndex = selectedRoomIndex[1]

        const selectedRoom = rooms[rowIndex][columnIndex]
        const A = 7 //m^2
        const {Tc, Tout, Treq, mFlow, nRad, valve, kThermostat, Uout} = selectedRoom

        const _Tc = Tc.at(-1)

        const K_v = 0.04 * dpipe*dpipe*0.7

        const valveLPM = ((valve) * K_v * Math.sqrt(0.1) * 16.6).toFixed(2)
        const {hasWest, hasEast, hasNorth, hasSouth} = getRoomLosses(rowIndex, columnIndex)

        let nRooms = 2;
        if(!hasWest) nRooms += 1;
        if(!hasEast) nRooms += 1;
        if(!hasNorth) nRooms += 1;
        if(!hasSouth) nRooms += 1;

        const R_value = calculateRValue(rowIndex, columnIndex).toFixed(2)

        const roomAbove = rooms[rowIndex + 1] ? rooms[rowIndex+1][columnIndex]  : null

        const _Krad = nRad * Krad 
        const pNominal = (0.001 * _Krad * Math.pow(Math.max(70 - 20, 0), 1.3)).toFixed(2)

        let isDeletable = (rooms.map((g) => g.map(a => a)).flat().filter(x =>x).length > 1) && !roomAbove

        if(roomAbove){
            const isRoomAboveStable = checkRoomIsStable(columnIndex, rooms[rowIndex+1], rooms[rowIndex])

            isDeletable = isDeletable || isRoomAboveStable
        }

        const checkNeighboursStable = Object.is(rowIndex,0) || checkNeighboursAreStable(columnIndex, rooms[rowIndex], rooms[rowIndex-1])

        isDeletable = isDeletable && checkNeighboursStable

        return(
            <div className="hq-full-width">
                <Space direction="vertical">
                    <small className="default-gray">Select room</small>
                    <div align="center" size="large" className="hq-opposite-arrangement" style={{width:'50vw'}}>
                    <Space size="large" align="center">
                        <Select 
                            value={"Room #" + (3*rowIndex + columnIndex + 1)}
                            style={{width:250}}
                            onChange={(v) => {
                                let index = v.split(",").map(a => parseInt(a))
                                index = [index[0], index[1]]
                                setSelectedRoomIndex(index)
                            }}
                            options={_options.map(a => ({label:"Room #" + (3*a[0]+a[1]+1), value:""+a[0]+","+a[1]}))}
                        />
                        <p className="room-number">{3*rowIndex + columnIndex + 1}</p>
                        <p className="default-red default-large">{_Tc.toFixed(1)} °C</p>
                    </Space>
                    {isDeletable ? 
                        <Tooltip color="white" title={<p>Delete room #{(3*rowIndex + columnIndex + 1)}</p>}>
                            <DeleteOutlined className="default-x-larger default-red hq-clickable" onClick={() => {
                                let _rooms = [...rooms]
                                _rooms[rowIndex][columnIndex] = undefined

                                const jIndex = rooms[0].findIndex(a => a)

                                setSelectedRoomIndex([0, jIndex])

                                setRooms(_rooms)                              

                            }}/>
                        </Tooltip>
                        :
                        <Tooltip color="white" title={<p>Cannot delete room</p>}>
                            <DeleteOutlined className="default-x-larger default-gray hq-clickable"/>
                        </Tooltip>}
                    </div>
                </Space>
                <br/>
                <br/>
                <Space direction="vertical">
                    <small className="default-gray">Desired room temperature</small>
                    <Input 
                        type="number"

                        min={10}
                        max={30}

                        value={Treq}                         
                        style={{width:250}}
                        
                        suffix="°C"

                        onChange={(v) => {
                            let n = v.target.value;

                            n = Math.max(10, Math.min(30, n))

                            let _rooms = [...rooms]
                            _rooms[rowIndex][columnIndex].Treq = n

                            setRooms(_rooms)
                        }} 
                    />
                    
                    <small className="default-gray">Radiator size</small>
                    <Space align="center" size="large">
                        <Input 
                            type="number"

                            min={MIN_RAD_N_1}
                            max={MAX_RAD_N_1}

                            value={nRad}                         
                            style={{width:250}}
                            suffix="sections"
                            onChange={(v) => {
                                let n = v.target.value;

                                n = Math.max(MIN_RAD_N_1, Math.min(MAX_RAD_N_1, n))

                                let _rooms = [...rooms]
                                _rooms[rowIndex][columnIndex].nRad = n

                                setRooms(_rooms)
                            }} 
                        />
                       
                        <Space>
                            <small className="default-gray">P-nominal</small>
                            <LatexRenderer latex={"$\\small{" + pNominal + "}$"}/>
                            <LatexRenderer latex={"$\\small{kW}$"}/>
                        </Space>

                    </Space>
                    <small className="default-gray">U-value: thermal resistance (room-outdoor)</small>
                    
                    <Space size="large" align="center">
                        <Input 
                            type="number"

                            min={0.1}
                            max={5}
                            step={0.1}
                            value={Uout}                         
                            style={{width:250}}
                            suffix={<LatexRenderer latex="$ \frac{K \cdot m^2 }{W} $"/>}
                            onChange={(v) => {
                                let n = v.target.value;

                                n = Math.max(0.1, Math.min(5, n))

                                let _rooms = [...rooms]
                                _rooms[rowIndex][columnIndex].Uout = n

                                setRooms(_rooms)
                            }} 
                        />
                        <Space>
                            <small className="default-gray">R-value</small>
                            <LatexRenderer latex={"$\\small{" + R_value + "}$"}/>
                            <LatexRenderer latex={"$\\small{\\frac{W}{K}}$"}/>
                        </Space>
                    </Space>
                    <small className="default-gray">Thermostat valve opening</small>
                    <p>{kThermostat.toFixed(5)}</p>

                    <small className="default-gray">Preset valve opening</small>
                    <Space align="end" size="large">
                        <Slider
                            min={0}
                            max={1}
                            step={0.05}
                            value={valve}
                            style={{width:250}}
                            marks={{[valve]:valve}}
                            onChange={(v) => {
                                let _rooms = [...rooms]
                                _rooms[rowIndex][columnIndex].valve = v

                                setRooms(_rooms)
                            }}
                        />
                        <small className="default-gray">{valveLPM} lpm (100 mBar)</small>
                    </Space>
                    <small className="default-gray">Operating temperature</small>
                    <p>{Tsupply}-{Tout.toFixed(1)} °C</p>
                    <small className="default-gray">Flow rate</small>
                    <p>{(mFlow * 1000 * 60).toFixed(2)} lpm</p>

                    
                </Space>
            </div>
        )
    }

    const renderGeneralParameters = () => {
        return(
            <div className="hq-full-width parameters-panel">
                <Space align="start">
                <Space direction="vertical">
                    <small className="default-gray">Supply temperature</small>
                    <Input 
                        type="number"

                        min={20}
                        max={100}

                        value={Tsupply}                         
                        style={{width:250}}
                        
                        suffix="°C"

                        onChange={(v) => {
                            let n = v.target.value;

                            n = Math.max(20, Math.min(100, n))

                            setTsupply(n)
                        }} 
                    />
                    
                    <small className="default-gray">Outdoor temperature</small>
                    <Input 
                        type="number"

                        min={-10}
                        max={20}

                        value={Toutside}                         
                        style={{width:250}}
                        
                        suffix="°C"

                        onChange={(v) => {
                            let n = v.target.value;

                            n = Math.max(-10, Math.min(20, n))

                           setToutside(n)
                        }} 
                    />
                </Space>
                <Space direction="vertical">
                    <small className="default-gray">Thermal resistance (room-room)</small>
                    <Input 
                        type="number"

                        min={0.05}
                        max={1}
                        step={0.05}
                        value={Uroom_room}                         
                        style={{width:250}}
                        suffix={<LatexRenderer latex="$ \frac{K \cdot m^2 }{W} $"/>}
                        onChange={(v) => {
                            let n = v.target.value;

                            n = Math.max(0.05, Math.min(1, n))
                            
                            setUroom_room(n)
                        }} 
                    />

                    

                    <small className="default-gray">System pressure difference</small>
                    <Input 
                        type="number"

                        min={0}
                        max={20}
                        step={0.1}
                        value={dpGloabl}                         
                        style={{width:250}}
                        
                        suffix="bar"

                        onChange={(v) => {
                            let n = v.target.value;

                            n = Math.max(0, Math.min(20, n))

                           setdpGlobal(n)
                        }} 
                    />
                </Space>
                <Space direction="vertical">
                    <small className="default-gray">Valve flow coeffecient (Kv-max)</small>
                    <Input 
                        type="number"

                        min={0.3}
                        max={1.5}
                        step={0.1}
                        value={Kvmax}                         
                        style={{width:250}}
                        
                        suffix={<LatexRenderer latex="$ \frac{m^3}{h} - 1bar $" />}

                        onChange={(v) => {
                            let n = v.target.value;

                            n = Math.max(0.3, Math.min(1.5, n))

                           setKvmax(n)
                        }} 
                    />
                    <small className="default-gray">Radiator heat emission coeffecient (per section)</small>
                    <Input 
                        type="number"

                        min={1}
                        max={20}
                        step={1}
                        value={Krad}                         
                        style={{width:250}}
                        
                        suffix={<LatexRenderer latex="$ \frac{W}{k^{n}} $" />}

                        onChange={(v) => {
                            let n = v.target.value;

                            n = Math.max(1, Math.min(20, n))

                           setKrad(n)
                        }} 
                    />
                </Space>
                <Space direction="vertical">
                    <small className="default-gray">Pipe length</small>
                    <Input 
                        type="number"

                        min={3}
                        max={10}
                        step={0.5}
                        value={Lpipe}                         
                        style={{width:150}}
                        
                        suffix={"m"}

                        onChange={(v) => {
                            let n = v.target.value;

                            n = Math.max(3, Math.min(10, n))

                           setLpipe(n)
                        }} 
                    />
                    <small className="default-gray">Pipe diameter</small>
                    <Input 
                        type="number"

                        min={10}
                        max={20}
                        step={1}
                        value={dpipe}                         
                        style={{width:150}}
                        
                        suffix={"mm"}

                        onChange={(v) => {
                            let n = v.target.value;

                            n = Math.max(10, Math.min(20, n))

                           setDpipe(n)
                        }} 
                    />
                </Space>
                
                </Space>
        </div>
        )
    }

    const calculateRValue = (i, j) => {
        const A = 7 //m^2
        
        const room = rooms[i][j]

        const {Uout} = room

        const hasWest =  rooms[i][j-1]
        const hasEast =  rooms[i][j+1]
        const hasSouth = (rooms[i-1] && rooms[i-1][j])
        const hasNorth =  (rooms[i+1] && rooms[i+1][j])

        let nRooms = 2;
        if(!hasWest) nRooms += 1;
        if(!hasEast) nRooms += 1;
        if(!hasNorth) nRooms += 1;
        if(!hasSouth) nRooms += 1;

        const R_value = (nRooms * A * (1/Uout))

        return R_value
    }

    const getRoomLosses = (i,j) => {
        const A = 7 //m^2
       
        const selectedRoom = rooms[i][j]
        const {Tc, Uout} = selectedRoom

        const _Tc = Tc.at(-1)

        let qLoss_outside =  (1/Uout) * 2 * A * (_Tc - Toutside)    
        let qLoss_rooms = 0

        let qWest = 0
        let qEast = 0
        let qNorth = 0
        let qSouth = 0

        let qLossWest = 0
        let qLossEast = 0
        let qLossNorth = 0
        let qLossSouth = 0

        const hasWest =  rooms[i][j-1]
        const hasEast =  rooms[i][j+1]
        const hasSouth = (rooms[i-1] && rooms[i-1][j])
        const hasNorth =  (rooms[i+1] && rooms[i+1][j])

        if(hasWest){
            const T_outher = hasWest.Tc.at(-1)
            qWest = (1/Uroom_room) * A * (_Tc - T_outher)
            qLoss_rooms += qWest
        }
        else{
            qLossWest =  (1/Uout) * A * (_Tc - Toutside)    
            qLoss_outside +=  qLossWest
        }

        if(hasEast){
            const T_outher = hasEast.Tc.at(-1)
            qEast = (1/Uroom_room) * A * (_Tc - T_outher)
            qLoss_rooms += qEast
        }
        else{
            qLossEast = (1/Uout) * A * (_Tc - Toutside) 
            qLoss_outside += qLossEast    
        }

       
        if(hasNorth){
            const T_outher = hasNorth.Tc.at(-1)
            qNorth = (1/Uroom_room) * A * (_Tc - T_outher)
            qLoss_rooms += qNorth
        }
        else{
            qLossNorth = (1/Uout) * A * (_Tc - Toutside) 
            qLoss_outside += qLossNorth       
        }

        
        if(hasSouth){
            const T_outher = hasSouth.Tc.at(-1)
            qSouth = (1/Uroom_room) * A * (_Tc - T_outher)
            qLoss_rooms += qSouth
        }
        else if(i){
            {/* No external loss to earth if on ground*/}
            qLossSouth = (1/Uout) * A * (_Tc - Toutside) 
            qLoss_outside += qLossSouth     
        }

        const qAirVentilation = calculateAirCirculationLossPerRoom(i,j)

        return ({qLoss_outside, qLoss_rooms, qAirVentilation, qWest, qEast, qNorth, qSouth, qLossWest, qLossEast, qLossNorth, qLossSouth, hasWest, hasEast, hasNorth, hasSouth})
    }

    const calculateVdot = (i,j) => {
        const friction = 0.03

        const Leff = 10*i + (Lpipe*(j+1))
        const pressure = dpGloabl * 100 * 1000
        const _dpipe = dpipe*0.001

        const Vdot = (Math.PI * _dpipe * _dpipe * 0.25) * Math.sqrt((2*_dpipe) * (1/(friction*Leff*D_WATER)) * pressure)

        return Vdot
    }

    const calculateAirCirculationLossPerRoom = (i, j) => {
        const airCirculationPeriod = 2 // hrs
        const room = rooms[i][j]

        const {Tc} = room
        const _Tc = Tc.at(-1)

        const tStep = 0.2
        const V = 19 // m^3

        const loss = D_AIR * V * CP_AIR * (_Tc - Toutside) * (1/3600) * (1/airCirculationPeriod)

        return loss
    }

    const calculatePerRoom = (i,j) => {
        const n = 1.3
        const A = 7 //m^2
        const C_room = 2 * Math.pow(10,4) // J/K

        const selectedRoom = rooms[i][j]
        const {Tc, Treq, nRad, valve, kThermostat} = selectedRoom

        const _Tc = Tc.at(-1)

        const Keff = Kvmax * valve * kThermostat
        const Vdot = calculateVdot(i,j) * valve * kThermostat//Keff * Math.sqrt((dpGloabl * Math.pow(10,5)))

        const mdot = D_WATER * Vdot 

        const Tin = Tsupply
        let Tmean = Tsupply-5
        let _Tout = Tin - 5

        const _Krad = nRad * Krad 

        for(let f=0; f<3;f++){
            const _q1 = mdot * CP_WATER * (Tin - _Tout)

            Tmean = (Tin+_Tout)*0.5

            const _q2 = _Krad * Math.pow(Math.max(Tmean - _Tc, 0), n)

            const denom = mdot*CP_WATER + 0.0000001

            _Tout = Tin - (_q2/denom)
        }

        _Tout = Math.max(_Tout, _Tc)

        const _q1 = mdot * CP_WATER * (Tin - _Tout)
        const _q2 = _Krad * Math.pow(Math.max(Tmean - _Tc, 0), n)

        const _q = _q1//Math.min(_q1, _q2)

        const {qLoss_outside, qLoss_rooms} = getRoomLosses(i,j)

        const dT = (_q - qLoss_outside - qLoss_rooms)/C_room

        let T_new = _Tc+dT

        let _rooms = [...rooms]
        let room = _rooms[i][j]

        let _T = room.Tc
        if(_T.length>20) _T.shift();
        _T.push(T_new)

        let _qrad = room.qrad
        if(_qrad.length>20) _qrad.shift();
        _qrad.push(_q)

        _rooms[i][j].Tc = _T
        _rooms[i][j].qrad = _qrad
        _rooms[i][j].mFlow = Vdot
        _rooms[i][j].Tout = _Tout

        const thermostat_error = (Treq - T_new)
        const _kThermostat = room.kThermostat

        _rooms[i][j].kThermostat = Math.max(0, Math.min(1, _kThermostat + 0.1 * thermostat_error))

        setRooms(_rooms)
    }

    const renderQradRating = () => {
        const maxQ = Math.max(...rooms.map((g) => g.map((r) => r ? (r.kThermostat * r.qrad.at(-1)) : 0)).flat())

        return(<svg>
                {rooms.map((g, i) => (g.map((r, j) => 
                {
                    if(!r) return <circle cx={0} cy={0} r={0}/>;

                    const {qrad, nRad, Tout} = r
                    const _q = qrad.at(-1)

                    const _qMin = Math.min(...qrad)
                    const _qMax = Math.max(...qrad)

                    const showRanges = (Math.abs(_qMax - _qMin) > 100)

                    const rating = _q/5000

                    const _x = 100 + 200*j
                    const _y = 680-150*(i+1)

                    const startX = 29 + 3.5 * nRad

                    return(<svg x={_x} y={_y}>
                            <rect width={ROOM_WIDTH} height={ROOM_HEIGHT} fill="rgba(255,255,255,0.5)" />

                            <rect x={5} y={5} width={100} height={20} fill="rgba(255,255,255,1)" />

                            <text x={10} y={20} fill="green">{(_q/1000).toFixed(2)} kW</text>
                            {showRanges && <text x={10} y={30} fill="gray" fontSize={10}>[{(_qMin/1000).toFixed(2)} - </text>}
                            {showRanges && <text x={40} y={30} fill="gray" fontSize={10}>{(_qMax/1000).toFixed(2)}]</text>}

                            <path
                                fill={rating ? "green" : "gray"}
                            
                                d={`M${startX} ${90} L${(startX+5)} ${90} L${(startX+5)} ${90 - rating*40} L${(startX+10)} ${90 - rating*40} L${(startX)} ${80 - rating*40} L${(startX-10)} ${90 - rating*40} L${(startX-5)} ${90 - rating*40} L${(startX-5)} ${90}z`}
                            />
                            <rect x={25} y={ROOM_HEIGHT*0.6 +2} width={19+7*nRad} height={50} fill="rgba(255,255,255,1)" stroke="rgba(0,0,0,0.3)" strokeWidth={1}/>
                            <text x={30} y={ROOM_HEIGHT*0.75+20} fill="rgba(0, 130, 255, 1)">{Tout.toFixed(1)}°C</text>
                            <text x={30} y={ROOM_HEIGHT*0.75} fill="red">{Tsupply}°C</text>
                    </svg>)
                })
                
                )).flat()}
            </svg>)
    }

    const renderRoomTemperatureRating = () => {
        const maxT = Math.max(...rooms.map((g) => g.map((r) => r ? r.Tc.at(-1) : 0)).flat())

        return(maxT ? 
            <svg>
                {rooms.map((g, i) => (g.map((r, j) => 
                {
                    if(!r) return <circle cx={0} cy={0} r={0}/>;

                    const {Tc} = r
                    const _Tc = Tc.at(-1)
                    const rating = _Tc/maxT

                    const _x = 100 + 200*j
                    const _y = 680-150*(i+1)

                    return(<svg x={_x+1} y={_y+1}>
                            <rect width={ROOM_WIDTH-2} height={ROOM_HEIGHT-2} fill={"rgba(255,0,0," + rating + ")"} />
                            <text fontSize={20} x={ROOM_WIDTH*0.35} y={ROOM_HEIGHT*0.5} fill="white">{_Tc.toFixed(1)} °C</text> 
                        </svg>)
                })
                
                )).flat()}
            </svg> 
            : <circle cx={0} cy={0} r={0}/>
        )
    }

    const renderHeatFlux = () => {

        return(<svg>
            {rooms.map((g, i) => (g.map((r, j) => 
                {
                    if(!r) return <circle cx={0} cy={0} r={0}/>;

                    const _x = 100 + 200*j
                    const _y = 680-150*(i+1)


                    return(<svg x={_x} y={_y}>
                            <rect width={ROOM_WIDTH-2} height={ROOM_HEIGHT-2} fill={"rgba(255, 255, 255, 0.6)"}/>
                        </svg>)
                })
                
                )).flat()}
                {rooms.map((g, i) => (g.map((r, j) => 
                {
                    if(!r) return <circle cx={0} cy={0} r={0}/>;

                    const _x = 100 + 200*j
                    const _y = 680-150*(i+1)

                    const {Tc, nRad, qrad} = r
                    const _Tc = Tc.at(-1)
                    const _qrad = qrad.at(-1)

                    const {qEast, qNorth, qSouth, qWest, qLossWest, qLossEast, qLossNorth, qLossSouth, qLoss_outside, qLoss_rooms, qAirVentilation} = getRoomLosses(i , j)

                    const qWestRating = (qWest/1000)
                    const qEastRating = (qEast/1000)
                    const qNorthRating = (qNorth/1000)
                    const qSouthRating = (qSouth/1000)

                    const qLossWestRating = Math.abs(qLossWest/1000)
                    const qLossEastRating = Math.abs(qLossEast/1000)
                    const qLossNorthRating = Math.abs(qLossNorth/1000)
                    const qLossSouthRating = Math.abs(qLossSouth/1000)

                    const _qTotal = _qrad - qLoss_outside - qLoss_rooms

                    return(<svg x={0} y={0}>
                            <text fontSize={20} x={_x + ROOM_WIDTH*0.35} y={_y + ROOM_HEIGHT*0.5} fill="red">{_Tc.toFixed(1)} °C</text> 
                            <rect x={_x+ROOM_WIDTH-100} y={_y+5} width={99} height={30} fill="white" />
                       
                            <text x={_x + ROOM_WIDTH-75} y={_y + 15} fontSize={10} fill="green">+{(_qrad/1000).toFixed(2)}</text>
                            <text x={_x + ROOM_WIDTH-75} y={_y + 25} fontSize={10} fill={qLoss_rooms > 0 ? "red" : "green"}>{(qLoss_rooms > 0 ? "-" : "+")+(Math.abs(qLoss_rooms)/1000).toFixed(2)}</text>
                            <text x={_x + ROOM_WIDTH-75} y={_y + 35} fontSize={10} fill={qLoss_outside > 0 ? "red" : "green"}>{(qLoss_outside > 0 ? "-" : "+")+(Math.abs(qLoss_outside)/1000).toFixed(2)}</text>
                            <text x={_x + ROOM_WIDTH-75} y={_y + 45} fontSize={10} fill={qAirVentilation > 0 ? "red" : "green"}>{(qAirVentilation > 0 ? "-" : "+")+(Math.abs(qAirVentilation)/1000).toFixed(2)}</text>

                            <text x={_x + ROOM_WIDTH-45} y={_y + 30} fontSize={10} fill={_qTotal > 0 ? "green" : "red"}>{(_qTotal > 0 ? "+" : "-")+(Math.abs(_qTotal)/1000).toFixed(2)} kW</text>


                            {qWest && (qWest > 1) && <path fill="green" d={`M${_x+10} ${ROOM_HEIGHT*0.5-5 + _y} L${_x+10} ${ROOM_HEIGHT*0.5+5 + _y} L${_x-(50*qWestRating)} ${ROOM_HEIGHT*0.5+5 + _y} L${_x-(50*qWestRating)} ${ROOM_HEIGHT*0.5+10 + _y} L${_x-(50*qWestRating+10)} ${ROOM_HEIGHT*0.5 + _y} L${_x-(50*qWestRating)} ${ROOM_HEIGHT*0.5-10 + _y} L${_x-(50*qWestRating)} ${ROOM_HEIGHT*0.5-5 + _y} L${_x+10} ${ROOM_HEIGHT*0.5-5 + _y} z`}/>}
                            {qEast && (qEast > 1) && <path fill="green" d={`M${ROOM_WIDTH + _x - 10} ${ROOM_HEIGHT*0.5-5 + _y} L${ROOM_WIDTH + _x - 10} ${ROOM_HEIGHT*0.5+5 + _y} L${ROOM_WIDTH+_x+(50*qEastRating)} ${ROOM_HEIGHT*0.5+5 + _y} L${ROOM_WIDTH+_x+(50*qEastRating)} ${ROOM_HEIGHT*0.5+10 + _y} L${ROOM_WIDTH+_x+(50*qEastRating+10)} ${ROOM_HEIGHT*0.5 + _y} L${ROOM_WIDTH+_x+(50*qEastRating)} ${ROOM_HEIGHT*0.5-10 + _y} L${ROOM_WIDTH+_x+(50*qEastRating)} ${ROOM_HEIGHT*0.5-5 + _y} L${ROOM_WIDTH+_x-10} ${ROOM_HEIGHT*0.5-5 + _y} z`}/>}
                            
                            {qNorth && (qNorth > 1) && <path fill="green" d={`M${ROOM_WIDTH*0.5 + _x - 5} ${10+ _y} L${ROOM_WIDTH*0.5 + _x + 5} ${10 + _y} L${ROOM_WIDTH*0.5 + _x + 5} ${_y - (50 *qNorthRating)} L${ROOM_WIDTH*0.5 + _x + 10} ${_y - (50 *qNorthRating)} L${ROOM_WIDTH*0.5 + _x} ${_y - (50 *qNorthRating) - 10} L${ROOM_WIDTH*0.5 + _x - 10} ${_y - (50 *qNorthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${_y - (50 *qNorthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${_y + 10} z`}/>}
                            {qSouth && (qSouth > 1) && <path fill="green" d={`M${ROOM_WIDTH*0.5 + _x - 5} ${ROOM_HEIGHT+ _y - 10} L${ROOM_WIDTH*0.5 + _x + 5} ${ROOM_HEIGHT+ _y - 10} L${ROOM_WIDTH*0.5 + _x + 5} ${ROOM_HEIGHT+ _y + (50 *qSouthRating)} L${ROOM_WIDTH*0.5 + _x + 10} ${ROOM_HEIGHT+ _y + (50 *qSouthRating)} L${ROOM_WIDTH*0.5 + _x} ${ROOM_HEIGHT + _y + (50 *qSouthRating) + 10} L${ROOM_WIDTH*0.5 + _x - 10} ${ROOM_HEIGHT+ _y + (50 *qSouthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${ROOM_HEIGHT+ _y + (50 *qSouthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${ROOM_HEIGHT+ _y - 10} z`}/>}
                           
                            {qLossWest && (Math.abs(qLossWest) > 1) && 
                            (qLossWest>0 ? 
                            <path fill="#0B75BD" d={`M${_x+10} ${ROOM_HEIGHT*0.5-5 + _y} L${_x+10} ${ROOM_HEIGHT*0.5+5 + _y} L${_x-(50*qLossWestRating)} ${ROOM_HEIGHT*0.5+5 + _y} L${_x-(50*qLossWestRating)} ${ROOM_HEIGHT*0.5+10 + _y} L${_x-(50*qLossWestRating+10)} ${ROOM_HEIGHT*0.5 + _y} L${_x-(50*qLossWestRating)} ${ROOM_HEIGHT*0.5-10 + _y} L${_x-(50*qLossWestRating)} ${ROOM_HEIGHT*0.5-5 + _y} L${_x+10} ${ROOM_HEIGHT*0.5-5 + _y} z`}/>
                            :
                            <path fill="#0B75BD" d={`M${_x - 10} ${ROOM_HEIGHT*0.5-5 + _y} L${_x - 10} ${ROOM_HEIGHT*0.5+5 + _y} L${_x+(50*qLossWestRating)} ${ROOM_HEIGHT*0.5+5 + _y} L${_x+(50*qLossWestRating)} ${ROOM_HEIGHT*0.5+10 + _y} L${_x+(50*qLossWestRating+10)} ${ROOM_HEIGHT*0.5 + _y} L${_x+(50*qLossWestRating)} ${ROOM_HEIGHT*0.5-10 + _y} L${_x+(50*qLossWestRating)} ${ROOM_HEIGHT*0.5-5 + _y} L${_x-10} ${ROOM_HEIGHT*0.5-5 + _y} z`}/>
                            )}
                            
                            {qLossEast && (Math.abs(qLossEast) > 1) && 
                            (qLossEast > 0 ?
                            <path fill="#0B75BD" d={`M${ROOM_WIDTH + _x - 10} ${ROOM_HEIGHT*0.5-5 + _y} L${ROOM_WIDTH + _x - 10} ${ROOM_HEIGHT*0.5+5 + _y} L${ROOM_WIDTH+_x+(50*qLossEastRating)} ${ROOM_HEIGHT*0.5+5 + _y} L${ROOM_WIDTH+_x+(50*qLossEastRating)} ${ROOM_HEIGHT*0.5+10 + _y} L${ROOM_WIDTH+_x+(50*qLossEastRating+10)} ${ROOM_HEIGHT*0.5 + _y} L${ROOM_WIDTH+_x+(50*qLossEastRating)} ${ROOM_HEIGHT*0.5-10 + _y} L${ROOM_WIDTH+_x+(50*qLossEastRating)} ${ROOM_HEIGHT*0.5-5 + _y} L${ROOM_WIDTH+_x-10} ${ROOM_HEIGHT*0.5-5 + _y} z`}/>
                            :
                            <path fill="#0B75BD" d={`M${ROOM_WIDTH +_x+10} ${ROOM_HEIGHT*0.5-5 + _y} L${ROOM_WIDTH +_x+10} ${ROOM_HEIGHT*0.5+5 + _y} L${ROOM_WIDTH +_x-(50*qLossEastRating)} ${ROOM_HEIGHT*0.5+5 + _y} L${ROOM_WIDTH +_x-(50*qLossEastRating)} ${ROOM_HEIGHT*0.5+10 + _y} L${ROOM_WIDTH +_x-(50*qLossEastRating+10)} ${ROOM_HEIGHT*0.5 + _y} L${ROOM_WIDTH +_x-(50*qLossEastRating)} ${ROOM_HEIGHT*0.5-10 + _y} L${ROOM_WIDTH +_x-(50*qLossEastRating)} ${ROOM_HEIGHT*0.5-5 + _y} L${ROOM_WIDTH +_x+10} ${ROOM_HEIGHT*0.5-5 + _y} z`}/>)}
                            
                            {qLossNorth && (Math.abs(qLossNorth) > 1) && 
                            (qLossNorth>0 ?
                            <path fill="#0B75BD" d={`M${ROOM_WIDTH*0.5 + _x - 5} ${10+ _y} L${ROOM_WIDTH*0.5 + _x + 5} ${10 + _y} L${ROOM_WIDTH*0.5 + _x + 5} ${_y - (50 *qLossNorthRating)} L${ROOM_WIDTH*0.5 + _x + 10} ${_y - (50 *qLossNorthRating)} L${ROOM_WIDTH*0.5 + _x} ${_y - (50 *qLossNorthRating) - 10} L${ROOM_WIDTH*0.5 + _x - 10} ${_y - (50 *qLossNorthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${_y - (50 *qLossNorthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${_y + 10} z`}/> 
                            :
                            <path fill="#0B75BD" d={`M${ROOM_WIDTH*0.5 + _x - 5} ${_y - 10} L${ROOM_WIDTH*0.5 + _x + 5} ${_y - 10} L${ROOM_WIDTH*0.5 + _x + 5} ${_y + (50 *qLossNorthRating)} L${ROOM_WIDTH*0.5 + _x + 10} ${_y + (50 *qLossNorthRating)} L${ROOM_WIDTH*0.5 + _x} ${_y + (50 *qLossNorthRating) + 10} L${ROOM_WIDTH*0.5 + _x - 10} ${_y + (50 *qLossNorthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${_y + (50 *qLossNorthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${_y - 10} z`}/>
                            )}

                            {qLossSouth && (Math.abs(qLossSouth) > 1) && 
                            (qLossSouth>0?
                            <path fill="#0B75BD" d={`M${ROOM_WIDTH*0.5 + _x - 5} ${ROOM_HEIGHT+ _y - 10} L${ROOM_WIDTH*0.5 + _x + 5} ${ROOM_HEIGHT+ _y - 10} L${ROOM_WIDTH*0.5 + _x + 5} ${ROOM_HEIGHT+ _y + (50 *qLossSouthRating)} L${ROOM_WIDTH*0.5 + _x + 10} ${ROOM_HEIGHT+ _y + (50 *qLossSouthRating)} L${ROOM_WIDTH*0.5 + _x} ${ROOM_HEIGHT + _y + (50 *qLossSouthRating) + 10} L${ROOM_WIDTH*0.5 + _x - 10} ${ROOM_HEIGHT+ _y + (50 *qLossSouthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${ROOM_HEIGHT+ _y + (50 *qLossSouthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${ROOM_HEIGHT+ _y - 10} z`}/>
                            :
                            <path fill="#0B75BD" d={`M${ROOM_WIDTH*0.5 + _x - 5} ${ROOM_HEIGHT+ 10+ _y} L${ROOM_WIDTH*0.5 + _x + 5} ${ROOM_HEIGHT+ 10 + _y} L${ROOM_WIDTH*0.5 + _x + 5} ${ROOM_HEIGHT+ _y - (50 *qLossSouthRating)} L${ROOM_WIDTH*0.5 + _x + 10} ${ROOM_HEIGHT+ _y - (50 *qLossSouthRating)} L${ROOM_WIDTH*0.5 + _x} ${ROOM_HEIGHT+ _y - (50 *qLossSouthRating) - 10} L${ROOM_WIDTH*0.5 + _x - 10} ${ROOM_HEIGHT+ _y - (50 *qLossSouthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${ROOM_HEIGHT+ _y - (50 *qLossSouthRating)} L${ROOM_WIDTH*0.5 + _x - 5} ${ROOM_HEIGHT+ _y + 10} z`}/> 
                            )}
                           
                        </svg>)
                })
                
                )).flat()}
            </svg>)
    }
    
    const renderRValueRating = () => {
        const RValues = rooms.map((g, i) => g.map((r, j) => r ? calculateRValue(i, j) : 0)).flat()
        const maxR = Math.max(...RValues)

        return(maxR ? 
            <svg>
                {rooms.map((g, i) => (g.map((r, j) => 
                {
                    if(!r) return <circle cx={0} cy={0} r={0}/>;

                    const {Tc} = r
                    const _Tc = Tc.at(-1)
                    const _r = calculateRValue(i, j)
                    const {qLoss_outside} = getRoomLosses(i, j)
                    const _q = (qLoss_outside * 0.001).toFixed(2)

                    const rating = _r/maxR

                    const _x = 100 + 200*j
                    const _y = 680-150*(i+1)

                    return(<svg x={_x+1} y={_y+1}>
                            <rect width={ROOM_WIDTH-2} height={ROOM_HEIGHT-2} fill={"rgba(255,255,255,1)"} />
                            <text fontSize={15} x={ROOM_WIDTH*0.35+30} y={ROOM_HEIGHT*0.5-30} fill={"blue"}>{_r.toFixed(2)} W/°K</text> 
                            <text fontSize={15} x={ROOM_WIDTH*0.35+30} y={ROOM_HEIGHT*0.5+0} fill="red">{_Tc.toFixed(1)} °C</text> 
                            <text fontSize={15} x={ROOM_WIDTH*0.35+30} y={ROOM_HEIGHT*0.5+30} fill={_q < 0 ? "green" : "red"}>{Math.abs(_q)} kW</text> 

                            <text fontSize={12} x={ROOM_WIDTH*0.35-50} y={ROOM_HEIGHT*0.5-30} fill="gray">R-value</text> 
                            <text fontSize={12} x={ROOM_WIDTH*0.35-50} y={ROOM_HEIGHT*0.5+0} fill="gray">T room</text> 
                            <text fontSize={12} x={ROOM_WIDTH*0.35-50} y={ROOM_HEIGHT*0.5+30} fill="gray">Q outside</text> 

                        </svg>)
                })
                
                )).flat()}
            </svg> 
            : <circle cx={0} cy={0} r={0}/>
        )
    }

    const handleFileChange = (info) => {
        if (info.file.status === 'uploading') {
          setLoadingData(true);
          return;
        }
    
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setLoadingData(false);
                const reader = new FileReader();
                
                reader.onload = function () {
                    try{
                        const _configuration = JSON.parse(reader.result)

                        const {
                            Toutside = 5,
                            Tsupply = 50,
                            Uroom_room = 0.15,
                            dpGloabl = 0.3,
                            Kvmax = 0.5,
                            Krad = 8,
                            Lpipe = 5,
                            dpipe = 15,
                            rooms = [[{
                                nRad:5,
                                Treq:20,
                                valve:0.6,
                                Tc:[15],
                                kThermostat:1,
                                mFlow:[0],
                                qrad:[0],
                                Uout:0.3,
                                Tout:0
                            },{
                                nRad:10,
                                Treq:20,
                                valve:0.6,
                                Tc:[20],
                                kThermostat:1,
                                mFlow:[0],
                                qrad:[0],
                                Uout:0.3,
                                Tout:0
                            }, undefined]]
                        } = _configuration;

                        setToutside(Toutside);
                        setTsupply(Tsupply);
                        setUroom_room(Uroom_room);
                        setdpGlobal(dpGloabl);
                        setKvmax(Kvmax);
                        setKrad(Krad);
                        setLpipe(Lpipe);
                        setDpipe(dpipe);
                        setRooms(rooms);

                        const jIndex = rooms[0].findIndex(a => a)

                        setSelectedRoomIndex([0, jIndex])

                        api.destroy()
                        api.success("File read successfully. in case some variables are missing, values are set to default", 4)
                    }
                    catch{
                        api.destroy()
                        api.warning("Failed to read file")
                    }
                };

                fetch(url).then(r => r.blob()).then(b => {
                    reader.readAsText(b);
                });         
            });
        }

        if (info.file.status === 'error') {
            api.destroy()
            api.warning("Failed to load file")
        }
    };

    const combinedKValve = rooms.map((g) => g.map((r) => r ? r.kThermostat : 0)).flat().reduce((r, c) => r += c, 0)

    return(
        <PagesWrapper>
            {contextHolder}
            <Space direction="vertical">
            <Space>
                <p className="default-title">Hydraulic Balancing</p>
                <Tooltip
                    color="white"
                    title={<p>{animationRunning ? "Stop" : "Start "} animation</p>}
                >
                    <Button size="small" type="default" icon={animationRunning ? <PauseOutlined className="default-title"/> : <CaretRightOutlined className="default-title"/>}
                        onClick={() => setAnimationRunning(!animationRunning)}
                    />
                </Tooltip>
                &nbsp;
                &nbsp;
                <Tooltip
                    color="white"
                    title={<p>Rating radiator output</p>}
                >
                        <Button 
                            onClick={() => {
                                setShowQRadRating(!showQRadRating)
                                setShowHeatFlux(false)
                                setShowRoomTemperatureRating(false)
                                setShowRValueRating(false)
                            }}
                            type={showQRadRating ? "primary" : "default"}
                        >
                        <FullscreenOutlined />
                    </Button>
                </Tooltip>
                <Tooltip
                    color="white"
                    title={<p>Heat flux</p>}
                >
                        <Button 
                            onClick={() => {
                                setShowQRadRating(false)
                                setShowHeatFlux(!showHeatFlux)
                                setShowRoomTemperatureRating(false)
                                setShowRValueRating(false)
                            }}
                            type={showHeatFlux ? "primary" : "default"}
                        >
                        <NodeIndexOutlined/>
                    </Button>
                </Tooltip>
                <Tooltip
                    color="white"
                    title={<p>Rating room temperature</p>}
                >
                        <Button 
                            onClick={() => {
                                setShowQRadRating(false)
                                setShowHeatFlux(false)
                                setShowRoomTemperatureRating(!showRoomTemperatureRating)
                                setShowRValueRating(false)
                            }}
                            type={showRoomTemperatureRating ? "primary" : "default"}
                        >
                            <OrderedListOutlined/>
                        </Button>
                </Tooltip>
                <Tooltip
                    color="white"
                    title={<p>Rating room R-value</p>}
                >
                        <Button 
                            onClick={() => {
                                setShowQRadRating(false)
                                setShowHeatFlux(false)
                                setShowRoomTemperatureRating(false)
                                setShowRValueRating(!showRValueRating)
                            }}
                            type={showRValueRating ? "primary" : "default"}
                        >
                            <InsertRowLeftOutlined />
                        </Button>
                </Tooltip>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <Tooltip
                    color="white"
                    title={<p>Export system configuration</p>}
                >
                        <Button 
                            onClick={() => {
                                setAnimationRunning(false)

                                const _json = ({
                                    Toutside,
                                    Tsupply,
                                    Uroom_room,
                                    dpGloabl, 
                                    Kvmax, 
                                    Krad, 
                                    Lpipe, 
                                    dpipe,
                                    rooms
                                })

                                downloadFile(JSON.stringify(_json), 'HBSConfiguration')
                            }}

                            size="small"
                        >
                            <DownloadOutlined className="default-title"/>
                        </Button>
                </Tooltip>
                <Tooltip
                    color="white"
                    title={<p>Import system configuration</p>}
                >
                        <Upload 
                        type="select" 
                        accept=".txt" 
                        onChange={(i) => handleFileChange(i)}
                        customRequest={dummyRequest}
                        showUploadList={false}
                        >
                            <Button 
                                size="small"

                                loading={loadingData}
                            >
                                <UploadOutlined className="default-title"/>
                            </Button>
                        </Upload>
                </Tooltip>
            </Space>
            <Space size="large" align="start">
            <svg width={800} height={750} style={{border:'1px solid #D7D8D9', borderRadius:8}}>

                {/* Base */}
                <rect x={15} width={735} y={680} height={10} fill="rgba(0,0,0,0.3)" stroke="transparent" />

                {/* Logo */}
                <image 
                    href={HeatCraftHPLogo}
                    x={15}
                    y={705}
                    width={200}                            
                />
                {/* External unit */}
                <image 
                    href={externalUnitHeatPump}
                    width={65}
                    x={20} y={628}
                />

                {animationRunning && combinedKValve &&
                <image 
                    href={externalUnitHeatPumpFan}
                    width={31}
                    x={25} y={633}
                />}

                <rect x={35} y={580} height={48} width={8} fill="rgba(70, 130, 180,0.5)" stroke="transparent"/>
                <rect x={37} y={560} height={5} width={3} fill="rgba(70, 130, 180,0.5)" stroke="transparent"/>
                <rect x={37} y={570} height={5} width={3} fill="rgba(70, 130, 180,0.5)" stroke="transparent"/>

                <rect x={60} y={580} height={48} width={8} fill="rgba(255,0,0,0.5)" stroke="transparent"/>
                <rect x={62} y={560} height={5} width={3} fill="rgba(255,0,0,0.5)" stroke="transparent"/>
                <rect x={62} y={570} height={5} width={3} fill="rgba(255,0,0,0.5)" stroke="transparent"/>

                <text x={32} y={555} fill="rgba(0,0,0,0.8)">{combinedKValve ? dpGloabl : 0} bar</text>
                <text x={20} y={540} fill="red">{Tsupply}</text>
                <text x={40} y={540} fill="rgba(70, 130, 180,1)">{calculateTMix().toFixed(1)} °C</text>
                <text x={720} y={28} fill="green" fontSize={16}>COP {calculateCOP().toFixed(1)}</text>

                {/* Outdoor temperature */}
                <text x={40} y={28} fill="red" fontSize={16}>{Toutside} °C</text>
                
                <image 
                    href={outdoorWeatherIcon}
                    width={25}
                    x={10} y={10}
                />

                {/* fill boxes */}
                {Array(4).fill(0).map((a, i) => (Array(3).fill(0).map((r, j) => 
                {
                    const canFill = checkBoxIsPlaceable(i, j)
                    return(
                        <svg  
                        key={3*i+j}

                        x ={100 + 200*j} y={680-150*(i+1)}
                        width={ROOM_WIDTH} height={ROOM_HEIGHT}

                        className={canFill ? "room-add-box" : "room-add-box-none"} 
                        
                        onClick={() => {
                            if(!canFill) return;

                            let _rooms = [...rooms]

                            if(!_rooms.at(i)){
                                _rooms[i] = Array(3).fill(undefined)
                                _rooms[i][j] = ({nRad:4,
                                    Treq:20,
                                    valve:0.6,
                                    Tc:[15],
                                    kThermostat:1,
                                    mFlow:[0],
                                    Uout:0.3,
                                    Tout:0,
                                    qrad:[0],})

                                setRooms(_rooms)
                            }else{
                                let _empty = Array(3).fill(undefined)

                                _empty = _empty.map((e, ei) => _rooms[i][ei]? _rooms[i][ei] : e)

                                _empty[j] = ({
                                    nRad:4,
                                    Treq:20,
                                    valve:0.6,
                                    Tc:[15],
                                    kThermostat:1,
                                    mFlow:[0],
                                    Uout:0.3,
                                    Tout:0,
                                    qrad:[0],})
                                _rooms[i] = _empty

                                setRooms(_rooms)
                            }
                            
                            
                        }}
                        >
                            <path className="room-add-box-inside" d="M95 50 L95 70 L75 70 L75 80 L95 80 L95 100 L105 100 L105 80 L125 80 L125 70 L105 70 L105 50 z" />
                            <rect x={0} y={0} width={ROOM_WIDTH} height={ROOM_HEIGHT} fill="transparent" strokeWidth={3} className="room-add-box-border"/>
                        </svg>

                    )
                })))}

                {/* Rooms */}
                {rooms.map((g, i) => (g.map((r, j) => !r ? <circle cx={0} cy={0} r={0}/> : <RoomUnit rKey={3*i+j} i={i} j={j} x ={100 + 200*j} y={680-150*(i+1)} state={r}/>))).flat()}

                {/* Edge */}
                {renderHouseEdge()}

                {/* Q radiator rating */}
                {showQRadRating && renderQradRating()}

                {/* Room Temperature rating */}
                {showRoomTemperatureRating && renderRoomTemperatureRating()}

                {/* Heat flux */}
                {showHeatFlux && renderHeatFlux()}

                {/* R value rating */}
                {showRValueRating && renderRValueRating()}
            </svg>
            <div>
            {renderGeneralParameters()}
            <br/>
            {renderRoomsList()}
            </div>
            </Space>
            </Space>
            
        </PagesWrapper>
    )
}