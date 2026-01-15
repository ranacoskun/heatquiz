import { Alert, Col, Drawer, Row, Slider, Space, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, CloseOutlined, InfoCircleFilled, TrophyOutlined, SelectOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { QUESTIONNAIRE_QUESTION_MC_TYPE } from "../Shared/Constants";
import TextArea from "antd/es/input/TextArea";

export function ViewHistorySnapViews({open, onClose, surveyId, history}){

    if(!open) return <div/>;

    const [api, contextHolder] = message.useMessage()

    const {surveyViewEdit: survey} = useQuestionnaires()

    const [currentQuestionsTab, setCurrentQuestionsTab] = useState(0)

    const [questionAnswers, setQuestionAnswers] = useState([])
    const [questionTextInputAnswers, setQuestionTextInputAnswers] = useState([])
    const [questionRangeInputAnswers, setQuestionRangeInputAnswers] = useState([])

    useEffect(() => {

        if(open){
            const {Instances} = history
            const {Questions} = survey

            let questionsAnswers = {}
            let questionsTextInputAnswers = {}
            let questionsRangeInputAnswers = {}

            for(const q of Questions){
                const instanceQ = Instances.filter((ins, i) => ins.QuestionId === q.Id)[0]

                if(instanceQ) questionsAnswers[q.Id] =  {answers:instanceQ.Statistics
                    .filter(s => Object.is(s.Choice.Type, QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL))
                    .map(c => c.ChoiceId), RemovedChoicesCount: instanceQ.RemovedChoicesCount}
            }

            for(const q of Questions){
                const instanceQ = Instances.filter((ins, i) => ins.QuestionId === q.Id)[0]

                if(instanceQ) questionsTextInputAnswers[q.Id] =  {answers:instanceQ.Statistics
                    .filter(s => Object.is(s.Choice.Type, QUESTIONNAIRE_QUESTION_MC_TYPE.TXT))
                    }
            }

            for(const q of Questions){
                const instanceQ = Instances.filter((ins, i) => ins.QuestionId === q.Id)[0]

                if(instanceQ) questionsRangeInputAnswers[q.Id] =  {answers:instanceQ.Statistics
                    .filter(s => Object.is(s.Choice.Type, QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE))
                    }
            }

            setQuestionAnswers(questionsAnswers)
            setQuestionTextInputAnswers(questionsTextInputAnswers)
            setQuestionRangeInputAnswers(questionsRangeInputAnswers)
        }
    }, [open])


    const {Key, Player,TotalTime, Series, MapElement} = history

    const renderQuestionInList = (q, qi) => {
        const {Id, Title, Body, ImageURL, Choices, IsSingleChoice} = q

        const answers = questionAnswers[Id]
        const txtAnswers = questionTextInputAnswers[Id]
        const rangeAnswers = questionRangeInputAnswers[Id]
        
        const RemovedChoicesCount = answers ? answers.RemovedChoicesCount : 0

        return(
            <div key={Id}>
                <Row>
                    <Col>
                        <Space direction="vertical" align="end">
                            <Space className="QuestionnaireQuestionInfo">
                                {ImageURL &&<img 
                                    alt={Title}
                                    className="QuestionnaireQuestionImage"

                                    src={ImageURL}

                                    onClick={() => {
                                        api.destroy()

                                        api.info(
                                            <Space align="start">
                                                <img 
                                                    alt={Title}
                                                    className="QuestionnaireQuestionImageZoom"

                                                    src={ImageURL}

                                                    
                                                />
                                                <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                            </Space>
                                        , 0)
                                    }}
                                />}

                                <LatexRenderer className="QuestionnaireQuestionBody" latex={Body || ""}/>
                            </Space>
                            <small className="default-title">{IsSingleChoice && "Only a single choice is possible."}</small>
                        </Space>
                    </Col>

                   
                    <Col xs={1}/>
                       
                        
                    <Col>
                    
                    {Choices.sort((a,b) => b.Order - a.Order).map((c, ci) => {
                            const {Id, LaTex, ImageURL, Type, Start, End, Step} = c
                            
                            if(Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL)){
                                const isSelected = answers && answers.answers.includes(c.Id)

                                return(
                                    <div 
                                key={Id} className={isSelected ? "QuestionnaireQuestionChoiceLineSelected": "QuestionnaireQuestionChoiceLine"}>
                                    <Space 
                                    
                                    align="start" className="QuestionnaireQuestionChoiceLineInner" size="large">
                                        <div>
                                            {LaTex && <LatexRenderer latex={LaTex || ""} />}
                                        </div>
                                        <div>
                                            {ImageURL && 
                                                <img 
                                                    alt={Title}
                                                    className="QuestionnaireQuestionChoiceImage"

                                                    src={ImageURL}

                                                    onClick={() => {
                                                        api.destroy()
                                                        
                                                        api.info(
                                                            <Space align="start">
                                                                <img 
                                                                    alt={Title}
                                                                    className="QuestionnaireQuestionImageZoom"
                
                                                                    src={ImageURL}
                
                                                                    
                                                                />
                                                                <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                                            </Space>
                                                        , 0)
                                                    }}
                                                />}
                                        </div>
                                    </Space>
                                    
                                </div>
                                )
                            }
                            else if(Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.TXT)){
                                const answer = txtAnswers && txtAnswers.answers.filter(a =>Object.is(a.ChoiceId, c.Id))[0]
                                return(
                                    <div 
                                    key={Id} className="QuestionnaireQuestionChoiceLineTextRangeInput">
                                        <Space 
                                        
                                        align="start" className="QuestionnaireQuestionChoiceLineInner" size="large">
                                            <div>
                                                {LaTex && <LatexRenderer latex={LaTex || ""} />}
                                            </div>
                                            <div>
                                                {ImageURL && 
                                                    <img 
                                                        alt={Title}
                                                        className="QuestionnaireQuestionChoiceImage"
    
                                                        src={ImageURL}
    
                                                        onClick={() => {
                                                            api.destroy()
                                                            
                                                            api.info(
                                                                <Space align="start">
                                                                    <img 
                                                                        alt={Title}
                                                                        className="QuestionnaireQuestionImageZoom"
                    
                                                                        src={ImageURL}
                    
                                                                        
                                                                    />
                                                                    <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                                                </Space>
                                                            , 0)
                                                        }}
                                                    />}
                                            </div>
                                        </Space>
                                        {answer ?
                                        <TextArea 
                                            value={answer.Value}
                                            className="hq-full-width"
                                            onChange={(v) => {}}
                                        /> : <p>No answer found</p>}
                                        <br/>
                                        <br/>
                                    </div>
                                )
                            }
                            else if(Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE)){
                                const answer = txtAnswers && rangeAnswers.answers.filter(a =>Object.is(a.ChoiceId, c.Id))[0]

                                const marks = {
                                    [Start]: Start,
                                    [End]: End
                                }

                                if(answer){
                                    const v = parseFloat(answer.Value)
                                    marks[v] =  {
                                        style: {
                                          color: 'gray',
                                        },
                                        label:v,
                                      }
                                }
                                return(
                                    <div 
                                    key={Id} className="QuestionnaireQuestionChoiceLineTextRangeInput">
                                        <Space 
                                        
                                        align="start" className="QuestionnaireQuestionChoiceLineInner" size="large">
                                            <div>
                                                {LaTex && <LatexRenderer latex={LaTex || ""} />}
                                            </div>
                                            <div>
                                                {ImageURL && 
                                                    <img 
                                                        alt={Title}
                                                        className="QuestionnaireQuestionChoiceImage"
    
                                                        src={ImageURL}
    
                                                        onClick={() => {
                                                            api.destroy()
                                                            
                                                            api.info(
                                                                <Space align="start">
                                                                    <img 
                                                                        alt={Title}
                                                                        className="QuestionnaireQuestionImageZoom"
                    
                                                                        src={ImageURL}
                    
                                                                        
                                                                    />
                                                                    <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                                                </Space>
                                                            , 0)
                                                        }}
                                                    />}
                                            </div>
                                        </Space>
                                        {answer 
                                        ?
                                        <Slider 
                                            min={Start}
                                            max={End}
                                            step={Step}
                                            className="hq-full-width QuestionnaireQuestionChoiceLineRangeInput"
                                            value={parseFloat(answer.Value)}
                                            marks={marks}
                                            onChange={(v) => {}}
                                        /> : <p>No answer found</p>}
                                    </div>
                                )
                            }

                        })}
                        {RemovedChoicesCount && answers?
                        <Space>
                            <InfoCircleFilled className="default-title"/>
                            <p className="default-red">{RemovedChoicesCount} choice(s) removed after participation.</p>
                        </Space>
                        : <div/>}
                        {!answers && 
                        <Alert 
                            type="info" 
                            banner
                            message={
                            <Space direction="vertical" align="start">
                                <small>It seems no answers are available for this questions.</small>
                                <small>Propably the question was added after participation</small>
                            </Space>
                        }
                        />
                    }
                    </Col>
                </Row>
            </div>
        )
    }

    const renderSurvey = () => {
        const {RemovedQuestionsCount} = history
        const {Questions} = survey

        const tabs = Questions.map((q, qi) => {
            const {Title} = q

            return ({
                key: qi,
                label: 
                <Space size="middle">
                    <p className="default-gray">{(qi + 1)}</p>
                    {(qi === currentQuestionsTab) && <p className="default-title">{' '}{Title}</p>}
                </Space> ,
                children:<div>{renderQuestionInList(q, qi)} </div>
            })
        })

        return(
            <div>
                {RemovedQuestionsCount?
                <Space>
                    <InfoCircleFilled className="default-title"/>
                    <p className="default-red">{RemovedQuestionsCount} question(s) removed after participation.</p>
                </Space>
                : <div/>}
                <Tabs
                    defaultActiveKey={0}
                    items={tabs}
                    onChange={(t) => {
                        setCurrentQuestionsTab(t)
                    }}
                    activeKey={currentQuestionsTab}
                    className="QuestionnaireTab"
                />
            </div>
        )
    }

    return(
        <Drawer
            title={
                <Space size="large">
                    <p className="hq-normal-font-weight">Snap History</p>

                    <Space className="hq-full-width hq-opposite-arrangement" size="large">
                        <Space>
                            <p className="hq-normal-font-weight">Player/Key</p>
                            {Key && <p className="hq-normal-font-weight default-title">{Key}</p>}
                            {Player && <p className="hq-normal-font-weight default-title">{Player}</p>}
                        </Space>
                        &nbsp;&nbsp;&nbsp;
                        <Space>
                            {TotalTime && 
                            <Space size="small">
                                <ClockCircleOutlined className="default-gray"/>
                                <p className="hq-normal-font-weight">{TotalTime}s</p>
                            </Space>}
                            &nbsp;
                            {Series && 
                            <Space size="small">
                                <TrophyOutlined className="default-green"/>
                                <p className="hq-normal-font-weight">{Series.Code}</p>
                            </Space>}
                            {MapElement && 
                            <Space size="small">
                                <SelectOutlined className="default-gray"/>
                                <p className="hq-normal-font-weight">{MapElement.Title}</p>
                            </Space>}
                        </Space>
                    </Space>
                </Space>
            }
            width={'100%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
            closable={true} 
        >
            {contextHolder}
            
            {renderSurvey()}
        </Drawer>  
    )
}