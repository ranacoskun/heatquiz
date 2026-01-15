import {Divider, Drawer, Dropdown, Skeleton, Space,} from "antd";
import React, { useEffect } from "react";
import {ArrowLeftOutlined, TrophyOutlined, EditOutlined} from '@ant-design/icons';
import { LatexRenderer } from "../../../Components/LatexRenderer";

import './ViewQuestionRelations.css'
import { useQuestions } from "../../../contexts/QuestionsContext";
import { useNavigate } from "react-router-dom";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { SeriesPlayPocket } from "../../Series/Play/SeriesPlayPocket";
import { useState } from "react";

export function ViewQuestionRelations({open, onClose, question}){

    if(!open) return <div/>;

    const {questionRelations, errorGetQuestionRelations, isLoadingGetQuestionRelations, getQuestionRelations} = useQuestions()
    const navigate = useNavigate()

    const [showPlaySeriesModal, setShowPlaySeriesModal] = useState(false)
    const [selectedSeries, setSelectedSeries] = useState({Code:''})

    useEffect(() => {
        if(open){
            getQuestionRelations(question.Id)
        }
    }, [open])

    const mapActionList = (m) => [{
        key: 'play_map',
        label: 'Play',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => navigate('/playcoursemap/'+m.Id)
    },
    {
        key: 'view_edit_map',
        label: 'View / edit map',
        icon: <EditOutlined/> ,
        onClick: () => navigate('/edit_view_map/'+m.Id)
    }]

    const seriesActionList = (s) => [{
        key: 'play_series',
        label: 'Play',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setShowPlaySeriesModal(true)
            setSelectedSeries(s)
        }
    },
    {
        key: 'view_edit_series',
        label: 'View / edit series',
        icon: <EditOutlined/> ,
        onClick: () => navigate('/series_edit_view/'+s.Code)
    }]

    const renderRelations = () => {

        return(
            <div>
                {questionRelations.map((r) => {
                const {Title, Image, Id, Elements} = r
                    return(
                        <div
                            key={Id}
                            className="hq-full-width"
                        >
                            <Space 
                                direction="vertical"
                            >
                                    <Space 
                                        size={'large'}
                                        
                                    >
                                        <Dropdown
                                            menu={{
                                                items:mapActionList(r),
                                                title:'Actions'
                                                }}
                                        >
                                            <p className="default-title hoverable">{Title}</p>
                                        </Dropdown>
                                    </Space>
                                    <Space
                                        size={'large'}
                                        align="start"
                                    >
                                        <img 
                                            alt={Title}
                                            src={Image}
                                            className="question-relation-map-img"
                                        />

                                        <div>
                                            {Elements.map((e) => {
                                                const {Title: eTitle, QuestionSeries, Id: eId} = e

                                                return(
                                                    <div
                                                        key={eId}
                                                    >
                                                        <p>{eTitle} {' - '} 

                                                            <Dropdown
                                                                menu={{
                                                                    items:seriesActionList(QuestionSeries),
                                                                    title:'Actions'
                                                                    }}
                                                            >
                                                                <span className="default-title hoverable">{QuestionSeries.Code}</span>
                                                            </Dropdown>

                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </Space>
                            </Space>
                            <Divider/>

                        </div>)
            })}
            </div>
        )
    }

    return(
        <Drawer
        title="Question relations"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}

        footer={
          <div>
          <p className="question-code">{question.Code}</p>
          <Space size={'large'} align="start">
              <div>
                  <img
                      src = {question.Base_ImageURL}
                      alt="question"
                      className="question-feedback-image"
                      
                  />
              </div>
              <div>
                  {question.Latex && <LatexRenderer latex={question.Latex}/>}
              </div>
          </Space>
      </div>}
    >   
        {isLoadingGetQuestionRelations && <Skeleton/>}

        {(!isLoadingGetQuestionRelations && questionRelations) && renderRelations()}

        {errorGetQuestionRelations && !isLoadingGetQuestionRelations && 
            <ErrorComponent 
                error={errorGetQuestionRelations}
                onReload={() => getQuestionRelations(question.Id)}
            />
        }

        <SeriesPlayPocket 
            open={showPlaySeriesModal}
            onClose={() => setShowPlaySeriesModal(false)}
            Code={selectedSeries.Code}
        />
    </Drawer>
    )
}