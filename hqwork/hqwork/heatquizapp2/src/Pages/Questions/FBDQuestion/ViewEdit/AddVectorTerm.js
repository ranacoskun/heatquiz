import React, { useEffect, useState } from "react";
import {Button, Col, ColorPicker, Drawer, Form, Input, List, Row, Select, Space, Tabs, Tooltip, message } from "antd";
import {ArrowLeftOutlined, CloseCircleFilled } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { SelectKeyboardList } from "../../../Keyboards/Shared/SelectKeyboardList";
import { Keyboard } from "../../../../Components/Keyboard";
import { validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { FixURL, handleResponse } from "../../../../services/Auxillary";
import { FBD_VECTOR_LINEAR, FBD_VECTOR_ROTATIONAL } from "../Shared/Constants";
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";
import TextArea from "antd/es/input/TextArea";
import { calculateCPdimensions } from "./Functions";

export function AddVectorTerm({open, onClose, question, reloadQuestion}) {

    if(!open) return <div/>;

    const { isLoadingAddFBDQuestionVT, addFBDQuestionVT,} = useQuestions()

    const [newLatex, setNewLatex] = useState('')
    const [newCode, setNewCode] = useState('')
    const [newColor, setNewColor] = useState('green')
    const [newLatexText, setNewLatexText] = useState('')

    const [newType, setNewType] = useState(FBD_VECTOR_LINEAR)
    const [newAngle, setNewAngle] = useState(0)

    const [selectedOB, setSelectedOB] = useState(null)

    const [selectedKeyboard, setSelectedKeyboard] = useState(null)

    const [newList, setNewList] = useState([])

    const [selectedIndex, setSelectedIndex] = useState(0)

    const [currentTab, setCurrentTab] = useState(1)

    const [api, contextHolder] = message.useMessage()

    const renderSelectedKeyboard = () => {
        return(
            <div 
                className="hq-full-width"
            >
                <SelectKeyboardList 
                    onSelect={(k) => {
                        setSelectedKeyboard(k)

                        setNewList([{
                            List:[],
                            echoNumber:0
                        }])

                        setSelectedIndex(0)

                        setCurrentTab(3)
                    }}
                />
            </div>
        )
    }

    const renderAddAnswers = () => {
        if(!selectedKeyboard){
            return(
                <div>
                    <p className="default-red">Please select a keyboard</p>
                </div>
            )
        }

        return(
            <div className="hq-full-width">
            <p
                        className="default-green hq-clickable"
                        onClick={() => {
                            let _terms = [...newList]

                            _terms.push({
                                List:[],
                                echoNumber:0
                            })

                            setSelectedIndex(_terms.length - 1)

                            setNewList(_terms)
                        }}
                    >Add new line</p>

                    {newList.map((a, ai) => {

                        const {List} = a

                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                        const checkTerm = validateKeyboardAnswer(a)

                        const termSelected = (ai === selectedIndex)

                        return(
                            <Space
                                key={ai}
                                className="hq-full-width"
                                direction="vertical"
                            >
                                <Space>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove term</p>}
                                        color="white"
                                    >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                let _terms = [...newList]

                                                _terms = _terms.filter((t, ti) => ai !== ti)
                                                setNewList(_terms)

                                                setSelectedIndex(0)
                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <p 
                                    onClick={() => setSelectedIndex(ai)}
                                    className={"hoverable-plus " + (termSelected ? "default-title highlighted" : "default-gray")}>{ai+1}</p>
                                    &nbsp;
                                    <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                </Space>

                                <small className="default-red">{checkTerm}</small>
                            </Space>
                        )
                    })}

                    <br/>
                    <br/>
                    {newList.length ?
                    <Keyboard
                        Id={selectedKeyboard.Id}
                        List={newList[selectedIndex]}
                        onEnterKey={(l) => {
                            let _terms = [...newList]

                            _terms[selectedIndex] = l
                            setNewList(_terms)
                        }}
                    /> : <p className="default-red">Please add new line</p>}
            </div>
        )
    }

    const renderDefineData = () => {
        const {ObjectBodies, Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL} = question

        const smallImageWidth = window.innerWidth * 0.10
        const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth

        return(
            <div>
                <Form>
                    <Form.Item>
                        <small className="default-gray">LaTeX code</small>
                        <Input
                            placeholder="New LaTeX"
                            value={newLatex}
                            onChange={(v) => setNewLatex(v.target.value)}
                        />
                    </Form.Item>
                    <LatexRenderer latex={"$$" + newLatex + "$$"}/>
                    <Form.Item>
                        <small className="default-gray">Code</small>
                        <Input
                            placeholder="New Code"
                            value={newCode}
                            onChange={(v) => setNewCode(v.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space direction="vertical">
                            <small className="default-gray">Color</small>
                            <Space>
                                <ColorPicker
                                    value={newColor}

                                    defaultValue={newColor} 

                                    onChange={(c, h) => {
                                        setNewColor(h)
                                    }}

                                    showText = {true}
                                />
                                <p className="highlighted">{newColor}</p>
                            </Space>
                        </Space>
                    </Form.Item>
                    <Form.Item>
                        <Space direction="vertical">
                        <small className="default-gray">Latex text (optional)</small>
                        <TextArea
                            value={newLatexText}
                            onChange={(v) => {
                                const value = v.target.value

                                setNewLatexText(value)
                            }}

                            className="add-fbd-input"
                        />
                        <LatexRenderer latex={newLatexText || ""}/>
                        </Space>
                    </Form.Item>
                </Form> 
                <p className="default-gray">Type</p>
                <Space size={"large"} align="start">
                    <Select 
                        value={newType}
                        onChange={(v) => {setNewType(v)}}

                        className="add-fbd-vt-term-type"
                    >
                        <Select.Option value={FBD_VECTOR_LINEAR}>Linear</Select.Option>
                        <Select.Option value={FBD_VECTOR_ROTATIONAL}>Rotational</Select.Option>
                    </Select>

                    {newType === FBD_VECTOR_LINEAR ? 
                                
                    <VectorDirectionComponent
                        widthHeight={window.innerWidth * 0.025}
                        currentAngle={newAngle}
                        angleStep={5}
                        onUpdateAngle={(a) => {setNewAngle(a)}}
                        hasTextEditor={true}
                    /> : <div/>}
                </Space>
                <p className="default-gray">Association</p>
                <Row
                    gutter={24}
                >
                    {ObjectBodies.map((o, oi) => {
                        const {Id, Color} = o

                        const dimesions =  calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, o)

                        const isSelected = selectedOB && selectedOB.Id === Id
                        return(
                            <Col
                                key={Id}
                            >
                                <Space
                                    align="start"
                                    className={"edit-fbd-vt-term-association-ob clickable hoverable " + (isSelected ? "highlighted default-title" : "")}
                                    onClick={() => setSelectedOB(o)}
                                >
                                    <p className="default-gray">{oi+1}</p>

                                    <div 
                                        style = {{
                                            height:smallImageHeight,
                                            width: smallImageWidth,
                                            backgroundImage: `url(${FixURL(Base_ImageURL)})`,
                                            backgroundPosition:'center',
                                            backgroundRepeat:'no-repeat',
                                            backgroundSize:'contain',
                                            border:'1px solid gainsboro'
                                        }}
                                    >
                                        <div style={{...dimesions, position:'relative', border:'1px solid #28a745' }}>
                                            <div style={{width:'100%', height:'100%', backgroundColor:Color,}}></div>
                                        </div>    
                                    </div>
                                </Space>
                            </Col>
                        )
                    })}
                </Row>
                  
            </div>
        )
    }

    return(
        <Drawer
        title={
        <Space
            size={"large"}
        >
            <p>Add Vector term</p>
            <Button 
                size="small"
                type="primary"

                loading={isLoadingAddFBDQuestionVT}

                onClick={() => {
                    if(!newCode.trim() || !newLatex.trim()){
                        api.destroy()
                        api.warning("Please add code and LaTeX code")

                        return
                    }

                    if(!selectedOB){
                        api.destroy()
                        api.warning("Please selected an associated object")

                        return
                    }

                    if(!selectedKeyboard){
                        api.destroy()
                        api.warning("Please selected a keyboard")

                        return
                    }

                    if(!newList.length){
                        api.destroy()
                        api.warning("Please add answers")

                        return
                    }

                    const checkAnswers = newList.filter(a => validateKeyboardAnswer(a)).length

                    if(checkAnswers){
                        api.destroy()
                        api.warning("Please check added answers")

                        return
                    }

                    const data = new FormData()

                    data.append('QuestionId', question.Id)

                    data.append('Code', newCode)
                    data.append('Latex', newLatex)
                    data.append('ArrowColor', newColor)
                    data.append('LatexText', newLatexText || "")

                    data.append('SelectedObjectbodyId', selectedOB.Id)
                    data.append('Linear', newType === FBD_VECTOR_LINEAR)
                    data.append('Angle', newAngle)
                    data.append('Clockwise', false)

                    data.append('KeyboardId', selectedKeyboard.Id)


                    data.append('Answers', JSON.stringify(newList.map((a) => ({
                        AnswerElements: a.List.map((e,i) => (
                            {
                                NumericKeyId: e.NumericKeyId,
                                ImageId: e.VariableImageId,
                                Value:e.char,
                                Id: i,
                                Order:i
                            }))}
                        ))))

                    addFBDQuestionVT(data).then(r =>handleResponse(r, api, 'Added successfully',1 , () => {
                        reloadQuestion()
                        onClose()
                    }))
                }}
            >
                Add
            </Button>
        </Space>}

        width={'100%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

    >   
        {contextHolder}
        
        <Tabs 
            items={[{
                key:1,
                label:'Meta data',
                children: <div>{renderDefineData()} </div>
            },{
                key:2,
                label:'Select keyboard',
                children: <div>{renderSelectedKeyboard()} </div>
            },
            {
                key:3,
                label:'Add answers',
                children: <div>{renderAddAnswers()} </div>
            }]}

            activeKey={currentTab}
            onChange={(s) => {
                if(s === 2 && !newList.length){
                    let _terms = [...newList]

                    _terms.push({
                        List:[],
                        echoNumber:0
                    })

                    setSelectedIndex(_terms.length - 1)

                    setNewList(_terms)
                }

                setCurrentTab(s)
            }}
        />

        
    </Drawer>
    )
}