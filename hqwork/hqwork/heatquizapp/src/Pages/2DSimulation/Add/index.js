import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { Button, Form, Input, Space, Steps, Tooltip, message } from "antd";
import {ScheduleTwoTone, ProjectTwoTone, FrownTwoTone, CheckCircleFilled, CloseCircleTwoTone, PictureTwoTone, PlusOutlined, SmileTwoTone} from '@ant-design/icons';
import { MAX_QUESTION_CODE } from "../../Questions/Shared/Constants";
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { UploadImage } from "../../../Components/UploadImage";
import Board from "../Shared/Board";
import AppComponentList from "../Shared/AppComponentList";

export function Add2DSimulation(){

    const svgRef = React.createRef()

    const [currentTab, setCurrentTab] = useState(0)
    const onChange = (value) => setCurrentTab(value);

    const [code, setCode] = useState("")
    const [body, setBody] = useState("")

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const [newImageWidth, setNewImageWidth] = useState(0)
    const [newImageHeight, setNewImageHeight] = useState(0)

    const [mousePosition, setMousePosition] = useState({x:0, y:0})
    const [isAdding, setIsAdding] = useState(false)
    const [isAddingSecond, setIsAddingSecond] = useState(false)
    const [rects, setRects] = useState([])

    const [radiators, setRadiators] = useState([])

    const [isAddingRadiator, setIsAddingRadiator] = useState(false)
    
    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        

    }, [mousePosition])

    const computePointInCanvas = (e) => {
        const {clientX, clientY} = e
        const boundingRect = svgRef.current.getBoundingClientRect();

        return {
            x: Math.floor(clientX - boundingRect.left),
            y: Math.floor(clientY - boundingRect.top)
        }
    }

    

    const renderInfo = () => {
        return(
            <Space align="start" size="large">
            <Form>
                <Form.Item>
                    <p>Code</p>
                    <Input 
                        className="question-form-sheet-input"
                        placeholder="Unique question code"
                        value={code}
                        onChange={(v) => {
                            const value = v.target.value
                            setCode(value)
                        }}
                        maxLength={MAX_QUESTION_CODE}
                        showCount
                    />
                </Form.Item>
            </Form>
            <Form>
            <Form.Item>
                    <p>Body (optional)</p>
                    <TextArea
                        value={body}
                        rows={4} 
                        onChange={(v) => {
                            const value = v.target.value

                            setBody(value)
                        }}  

                        className="add-questionnaire-body"
                    />

                    <LatexRenderer latex={body || "-"} />
                </Form.Item>
            </Form>
        </Space>
        )
    }

    const renderAddImage = () => {
        return(
            <div>
                <UploadImage 
                    onSetImage={(url, img) => {
                        setNewImageURL(url)
                        setNewImage(img)
                        setRects([])

                    }}

                    imageURL={newImageURL}

                    className="clickable-question-add-image-container"
                    classNameImage="clickable-question-add-image-inside"
                />
                <small className="default-title">Changing image leads to removal of added Simulation view content</small>
                {newImageURL &&
                <img 
                    style={{width:0, height:0}}
                    src={newImageURL}
                    onLoad={(img) => {

                        img.persist()

                        const w = img.target.naturalWidth
                        const h = img.target.naturalHeight

                        const imageWidth = 0.45*window.innerWidth
                        const imageHeight = ((h*imageWidth)/w)
                        setNewImageWidth(imageWidth)
                        setNewImageHeight(imageHeight)

                    }}
                />
                }
            </div>
        )
    }

    const CartoonRadiator = ({ width = 200, height = 300 }) => {
        const mainColor = '#e0e0e0';
        const shadowColor = '#b0b0b0';
        const highlightColor = '#ffffff';
        const strapColor = '#a0a0a0';
      
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Main body */}
            <rect x="10" y="10" width={width - 20} height={height - 20} fill={mainColor} rx="10" ry="10" />
            
            {/* Left shadow */}
            <rect x="10" y="10" width="20" height={height - 20} fill={shadowColor} rx="10" ry="10" />
            
            {/* Top shadow */}
            <rect x="10" y="10" width={width - 20} height="20" fill={shadowColor} rx="10" ry="10" />
            
            {/* Right highlight */}
            <rect x={width - 30} y="10" width="20" height={height - 20} fill={highlightColor} rx="10" ry="10" opacity="0.5" />
            
            {/* Bottom highlight */}
            <rect x="10" y={height - 30} width={width - 20} height="20" fill={highlightColor} rx="10" ry="10" opacity="0.5" />
      
            {/* Vertical fins */}
            {[...Array(8)].map((_, i) => (
              <rect
                key={i}
                x={30 + i * ((width - 60) / 8)}
                y="30"
                width="10"
                height={height - 60}
                fill={shadowColor}
                rx="5"
                ry="5"
              />
            ))}
      
            {/* Top strap */}
            <rect x="0" y="40" width={width} height="20" fill={strapColor} rx="5" ry="5" />
            
            {/* Bottom strap */}
            <rect x="0" y={height - 60} width={width} height="20" fill={strapColor} rx="5" ry="5" />
      
            {/* Strap highlights */}
            <rect x="0" y="40" width={width} height="5" fill={highlightColor} opacity="0.3" rx="5" ry="5" />
            <rect x="0" y={height - 60} width={width} height="5" fill={highlightColor} opacity="0.3" rx="5" ry="5" />
          </svg>
        );
      };


    const checkAreaOverlap = (a, others) => {
        const {x:x1, y:y1, w, h} = a

        const x2 = x1 + w
        const y2 = y1 + h

        for(const A of others){
            const {x:ox1, y:oy1, w:ow, h:oh} = A
            const ox2 = ox1 + ow
            const oy2 = oy1 + oh

            const condition1 = ((x1 <= ox1 && ox1 <= x2) || (x1 <= ox2 && ox2 <= x2))
            const condition2 = ((y1 <= oy1 && oy1 <= y2) || (y1 <= oy2 && oy2 <= y2))

            const overlap = condition1&&condition2

            if(overlap) return true;
        }

        return false;
    }

    const renderContent = () => {
        //if(!newImageURL) return <div><p className="default-red">Please add image</p></div>;

        // Example component data
        const components = [
            {
            id: 'component1',
            name: 'Component A',
            svg: '',
            width: 80,
            height: 60,
            inputPoints: [{ id: 'in1', x: 10, y: 25 }],
            outputPoints: [{ id: 'out1', x: 90, y: 25 }],
            }
        ];
        
        // Example area data
        const areas = [
            {
            id: 'area1',
            x: 50,
            y: 50,
            width: 300,
            height: 200,
            },
        ];

        return(
            <div>
                <AppComponentList 
                    components={components}
                />
                <Board 
                    width={newImageWidth}
                    height={newImageHeight}
                    //backgroundImage={newImageURL}
                    areas={areas}
                />
                
                
            </div>
        )
    }

    const selectContent = () => {
        const map = {
            0: () => renderInfo(),
            1: () => renderAddImage(),
            2: () => renderContent(),
            3: () => <div/>,
        }

        return map[currentTab]()
    }

    const validateAddInfo = () => {
        if(!code.trim()) return "Please add code";
    }

    const validateAddImage = () => {
        if(!newImage) return "Please add image";
    }

    const infoValidation = validateAddInfo()
    const imageValidation = validateAddImage()

    const canAdd = !(infoValidation || imageValidation)

    return(
        <PagesWrapper>
            {contextHolder}
            <Steps
                onChange={onChange}
                current={currentTab}
                items={[
                        {
                            title: 
                            <Space className={infoValidation ? "highlighted" : "hoverable"}>
                                <p>Meta data{' '}</p>

                                {(!infoValidation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip
                                    color="white"
                                    title={<p>{infoValidation}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                            </Space>,
                            icon:<ScheduleTwoTone />
                        },
                        {
                            title:
                            <Space className={(!infoValidation && imageValidation) ? "highlighted" : "hoverable"}>
                                <p>Add image{' '}</p>
                                {(!imageValidation? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{imageValidation}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                           </Space>,
                            icon:<PictureTwoTone />
                        },
                        {
                            title:
                            <Space className={true ? "highlighted" : "hoverable"}>
                                <p>Simulation view</p>
                                {(true ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                           </Space>,
                            icon:<ProjectTwoTone />
                        },
                        {
                            title: 'Final',
                            icon: canAdd ? <SmileTwoTone /> : <FrownTwoTone />
                        },
                ]}
            />
            <br/>
            {selectContent()}
        </PagesWrapper>
    )
}