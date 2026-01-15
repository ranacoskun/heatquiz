import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { useParams } from "react-router-dom";
import { Button, Divider, Dropdown, List, Popconfirm, Skeleton, Space, Spin, Statistic, Tabs, Tooltip, Tree, message } from "antd";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { beautifyDate, beautifyNumber, downloadFile, goToQuestionnairePlay, handleResponse } from "../../../services/Auxillary";
import {EditOutlined, CompassOutlined, CloseOutlined, VerticalAlignBottomOutlined, DownOutlined, EyeOutlined, DeleteOutlined, CopyOutlined, SortAscendingOutlined, FontSizeOutlined, ColumnWidthOutlined, PlusOutlined, DatabaseOutlined, OrderedListOutlined, ExperimentOutlined, TrophyOutlined, NodeIndexOutlined, ApiOutlined} from '@ant-design/icons';

import "./index.css"
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { CombinationList } from "./CombinationList";
import { ParticipationHistory } from "./ParticipationHistory";
import { AssignSeriesToQuestionnaire } from "./AssignSeriesToQuestionnaire";
import { DeassignSeriesToQuestionnaire } from "./DeassignSeriesToQuestionnaire";
import { EditQuestionnaireCode } from "./EditQuestionnaireCode";
import { EditQuestionnaireExplanation } from "./EditQuestionnaireExplanation";
import { EditQuestionnaireQuestionTitle } from "./EditQuestionnaireQuestionTitle";
import { EditQuestionnaireQuestionBody } from "./EditQuestionnaireQuestionBody";
import { AddQuestionnaireQuestionImage } from "./AddQuestionnaireQuestionImage";
import { EditQuestionnaireChoiceLatex } from "./EditQuestionnaireChoiceLatex";
import { EditQuestionnaireChoiceImage } from "./EditQuestionnaireChoiceImage";
import { AddQuestionnaireChoice } from "./AddQuestionnaireChoice";
import { AddQuestionnaireQuestion } from "./AddQuestionnaireQuestion";
import { ReorderQuestionnaireQuestions } from "./ReorderQuestionnaireQuestions";
import { EditQuestionnaireFinalText } from "./EditQuestionnaireFinalText";
import { EditQuestionnaireImage } from "./EditQuestionnaireImage";
import { CopyQuestionnaireQuestion } from "./CopyQuestionnaireQuestion";
import { CopyQuestionnaire } from "./CopyQuestionnaire";
import { ReorderQuestionnaireQuestionChoices } from "./ReorderQuestionnaireQuestionChoices";
import { QUESTIONNAIRE_QUESTION_MC_TYPE } from "../Shared/Constants";
import { QuestionnaireQuestionChoiceRangeInputSpectrum } from "./QuestionnaireQuestionChoiceRangeInputSpectrum";
import { TextInputChoiceInputsList } from "./TextInputChoiceInputsList";

export function QuestionnaireViewEdit(){
    const {
        surveyViewEdit,
        errorGetSurveyViewEdit,
        isLoadingSurveyViewEdit,
        getSurveyViewEdit,

        surveyStatistics,
        errorGetSurveyStatistics,
        isLoadingSurveyStatistics,
        getSurveyStatistics,
    
        removeQuestionnaireQuestionImage,

        removeQuestionnaireChoiceImage,
        removeQuestionnaireChoiceLatex,
        removeQuestionnaireChoice,

        removeQuestionnaireQuestion,
        removeQuestionnaireImage,

        flipQuestionnaireQuestionSingleChoice

    } = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const {id} = useParams()
    const [currentQuestionsTab, setCurrentQuestionsTab] = useState(0)

    const [showHistory, setShowHistory] = useState(false)

    const [showChoiceCombination, setShowChoiceCombination] = useState(false)
    const [combinationData, setCombinationData] = useState(false)

    const [showAssignToSeries, setShowAssignToSeries] = useState(false)
    const [showDeassignToSeries, setShowDeassignToSeries] = useState(false)

    const [showEditCode, setShowEditCode] = useState(false)
    const [showEditExplanation, setShowEditExplanation] = useState(false)
    const [showEditFinalText, setShowEditFinalText] = useState(false)
    const [showEditSurveyImage, setShowEditSurveyImage] = useState(false)

    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [showEditQuestionTitle, setShowEditQuestionTitle] = useState(false)
    const [showEditQuestionBody, setShowEditQuestionBody] = useState(false)
    const [showAddQuestionImage, setShowAddQuestionImage] = useState(false)

    const [selectedChoice, setSelectedChoice] = useState(null)
    const [showEditChoiceLatex, setShowEditChoiceLatex] = useState(false)
    const [showEditChoiceImage, setShowEditChoiceImage] = useState(false)

    const [showAddChoice, setShowAddChoice] = useState(false)

    const [showAddQuestion, setShowAddQuestion] = useState(false)
    const [showCopyQuestion, setShowCopyQuestion] = useState(false)
    const [showCopySurvey, setShowCopySurvey] = useState(false)

    const [showReorderQuestions, setShowReorderQuestions] = useState(false)
    const [showReorderQuestionChoices, setShowReorderQuestionChoices] = useState(false)

    const [showTextInputChoiceInputs, setShowTextInputChoiceInputs] = useState(false)


    const loadData = () => {
        getSurveyViewEdit(id)
        getSurveyStatistics(id)
        setCurrentQuestionsTab(0)
    }

    useEffect(() => {
        loadData()
    }, [id])

    const downloadSpectrum = (data, total) => {
        let text = ""
        for(const d of data){
            const {Text, Count} = d
            const perc = (100 * (Count / total)).toFixed(0) + "%"

            text += Text + ", " + Count + ", " + perc + ";\n"
        }

        downloadFile(text, "spectrum.txt", "txt")
    }

    const renderGeneralStats = () => {
    
        return(
                <div className="questionnaire-statistics-card">
                    <Space align="start">
                        {isLoadingSurveyStatistics && <Spin />}
                        {errorGetSurveyStatistics && <div><p className="default-red hq-clickable" onClick={() => getSurveyStatistics(id)}>Error</p></div>}
                        
                        {surveyStatistics && 
                        <Space>
                            <Tooltip
                                title={<p>{surveyStatistics.TotalPlay} total number of participation</p>}
                                color="white"
                                placement="bottom"
                            >
                                <Statistic
                                    title='Total participation'
                                    value={beautifyNumber(surveyStatistics.TotalPlay)}
                                    valueStyle={{fontSize:'medium', color:'gray'}}
                                />
                            </Tooltip>

                            <Statistic
                                title='Median participation time'
                                value={(surveyStatistics.MedianTime || 0) + " s"}
                                valueStyle={{fontSize:'medium', color:'gray'}}
                            />    
                            <div className="questionnaire-view-edit-history-seperation"/>
                        </Space>}

                        <Button
                            size="small"
                            icon={<DatabaseOutlined />}

                            onClick={() => setShowHistory(true)}
                        >
                            Search participation history
                        </Button>
                    </Space>
                </div>
            )
        
    }

    const actionList = (s) => [{
        key: 'play_questionnaire',
        label: 'Play',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () =>goToQuestionnairePlay(s)
    },
    {
        key: 'edit_code',
        label: 'Edit code',
        icon: <EditOutlined/> ,
        onClick: () => {
            setShowEditCode(true)
        }
    },
    {
        key: 'add_question',
        label: 'Add question',
        icon: <PlusOutlined className="default-green"/> ,
        onClick: () => {setShowAddQuestion(true)}
    },
    {
        key: 'copy_questionnaire',
        label: 'Copy questionnaire',
        icon: <CopyOutlined className="default-green"/> ,
        onClick: () => {
            setShowCopySurvey(true)
        }
    },
    {
        key: 'assign_series',
        label: 'Assign to series',
        icon: <NodeIndexOutlined />,
        onClick: () => {
            setShowAssignToSeries(true)
        }
    },
    {
        key: 'deassign_series',
        label: 'Deassign series',
        icon: <ApiOutlined /> ,
        onClick: () => {setShowDeassignToSeries(true)}
    },{
        key: 'reorder_questions',
        label: 'Reorder questions',
        icon: <OrderedListOutlined /> ,
        onClick: () => {setShowReorderQuestions(true)}
    }]
        
    const renderHeader = () => {
        const {Code, AddedByName, DateCreated} = surveyViewEdit

        return(
            <div>
                <Space className="hq-full-width hq-opposite-arrangement">
                    <div>
                        <Dropdown
                             menu={{
                                items:actionList(surveyViewEdit),
                                title:'Actions'
                            }}
                        >
                            <p className="default-large hoverable default-title">{Code}</p>
                        </Dropdown>
                        <p className="default-gray">{AddedByName}</p>
                        <p className="default-gray">{beautifyDate(DateCreated)}</p>
                    </div>

                    <div>
                    
                        {renderGeneralStats()}
                    </div>
                </Space>
                <Divider />
            </div>
        )
    }

    const renderMetadata = () => {
        const {Explanation, FinalText, ImageURL, Code} = surveyViewEdit

        return(
            <Space direction="vertical" size="large">
                <div>
                <Space size="large"> 
                    <p className="default-gray">Explanation (optional)</p>
                    <EditOutlined className="default-gray hq-clickable" onClick={() => {
                        setShowEditExplanation(true)
                    }}/>
                </Space>

                <LatexRenderer latex={Explanation || "-"}/>
                </div>

                <div>
                <Space size="large"> 
                    <p className="default-gray">Post-submittion text (optional)</p>
                    <EditOutlined className="default-gray hq-clickable" onClick={() => {
                        setShowEditFinalText(true)
                    }}/>
                </Space>

                <p className="default-black">{FinalText || "-"}</p>
                </div>

                <Space direction="vertical">
                <Space size="large">
                            <p className="default-gray">Image (optional)</p>
                            {(ImageURL) ? 
                                <Tooltip
                                    color="white"
                                    title={<p>Delete image</p>}
                                >
                                    <Popconfirm
                                        title="Remove image"
                                        description="Are you sure to delete the image?"
                                        
                                        onConfirm={() => {
                                            const data = new FormData()
                                                
                                            data.append("SurveyId", surveyViewEdit.Id)

                                            removeQuestionnaireImage(data).then(r => handleResponse(r, api, "Image removed successfully", 1, () => {
                                                loadData()
                                            }))
                                        }}
                                        onCancel={() => {}}
                                        okText="Yes"
                                        cancelText="No"
                                        placement="right"
                                    >
                                        <DeleteOutlined
                                            className = "default-red hq-clickable"
                                        />
                                    </Popconfirm>
                                    
                                </Tooltip>
                                :
                                <Tooltip
                                    color="white"
                                    title={<p>Add image</p>}
                                >
                                    <PlusOutlined 
                                        className = "default-green hq-clickable" 
                                        onClick={() => {
                                        setShowEditSurveyImage(true)
                                            
                                        }}
                                    />

                                </Tooltip>}
                        </Space>

                        {ImageURL &&
                        <img 
                            alt={Code}
                            className="questionnaire-question-image"

                            src={ImageURL}

                            onClick={() => {
                                api.destroy()

                                api.info(
                                    <Space align="start">
                                        <img 
                                            alt={Code}
                                            className="questionnaire-question-image-zoom"

                                            src={ImageURL}                                                    
                                        />
                                        <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                    </Space>
                                , 0)
                            }}
                        />}
                </Space>
            </Space>
        )

    }



    const renderQuestionInList = (q, qi) => {
        const {Id, ImageURL, Title, Body, Choices, IsSingleChoice} = q

        let totalPlay = 0
        let choiceStats = []
        let choiceCombinations = []

        let textInputStats = []
        let rangeInputStats = []


        if(surveyStatistics){
            const {QuestionsStats} = surveyStatistics
            const qStats = QuestionsStats.filter(qq => q.Id === qq.Id)[0]

            totalPlay = qStats ? qStats.TotalPlay : 0

            if(qStats){
                choiceStats = qStats.ChoicesStats;
                choiceCombinations = qStats.ChoiceClickCombinationStats;
                textInputStats = qStats.TextInputChoiceStats
                rangeInputStats = qStats.RangeInputChoiceStats
            }
        }

        return(
            <div key={Id} >
                <Space className="hq-full-width hq-opposite-arrangement" align="start">
                <Space size="large" align="start">
                    <Space size="middle" direction="vertical">
                        <div>
                            <Space size="large"> 
                                <p className="default-gray">Title</p>

                                <EditOutlined className="default-gray hq-clickable" onClick={() => {
                                    setShowEditQuestionTitle(true)
                                    setSelectedQuestion(q)
                                }}/>
                            </Space>
                            <p className="default-title">{Title}</p>
                        </div>
                        <div>
                            <Space size="large">
                                <p className="default-gray">Single choice restriction</p>

                                <Tooltip
                                    color="white"
                                    title={<p>Flip single choice restriction (Y/N)</p>}
                                >
                                    <CompassOutlined 
                                        className="default-gray hq-clickable"
                                        onClick={() => {
                                            const data = new FormData()

                                            data.append("QuestionId", q.Id)

                                            flipQuestionnaireQuestionSingleChoice(data).then(r => handleResponse(r, api, "Flipped successfully",1, () => {
                                                loadData()
                                            }))
                                        }}
                                    />
                                </Tooltip>
                            </Space>
                            {IsSingleChoice ? <p className="default-green">Yes</p> : <p className="default-red">No</p>}
                        </div>
                        <div>
                            <p className="default-gray">Total participation</p>
                            <p className="default-gray">{beautifyNumber(totalPlay)}</p>
                        </div>
                        <Space direction="vertical">
                        <Space size="large">
                            <p className="default-gray">Image (optional)</p>
                            {(ImageURL) ? 
                                <Tooltip
                                    color="white"
                                    title={<p>Delete image</p>}
                                >
                                    <Popconfirm
                                        title="Remove image"
                                        description="Are you sure to delete the image?"
                                        
                                        onConfirm={() => {
                                            const data = new FormData()
                                                
                                            data.append("QuestionId", q.Id)

                                            removeQuestionnaireQuestionImage(data).then(r => handleResponse(r, api, "Image removed successfully", 1, () => {
                                                loadData()
                                            }))
                                        }}
                                        onCancel={() => {}}
                                        okText="Yes"
                                        cancelText="No"
                                        placement="right"
                                    >
                                        <DeleteOutlined
                                            className = "default-red hq-clickable"
                                        />
                                    </Popconfirm>
                                    
                                </Tooltip>
                                :
                                <Tooltip
                                    color="white"
                                    title={<p>Add image</p>}
                                >
                                    <PlusOutlined 
                                        className = "default-green hq-clickable" 
                                        onClick={() => {
                                            setShowAddQuestionImage(true)
                                            setSelectedQuestion(q)
                                        }}
                                    />

                                </Tooltip>}
                        </Space>
                        {ImageURL &&
                        <img 
                            alt={Title}
                            className="questionnaire-question-image"

                            src={ImageURL}

                            onClick={() => {
                                api.destroy()

                                api.info(
                                    <Space align="start">
                                        <img 
                                            alt={Title}
                                            className="questionnaire-question-image-zoom"

                                            src={ImageURL}                                                    
                                        />
                                        <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                    </Space>
                                , 0)
                            }}
                        />}
                        </Space>
                    </Space>
                    <div className="questionnaire-view-edit-speration-area"/>
                    <Space direction="vertical">
                        <Space  direction="vertical">
                            <Space size="large"> 
                                <p className="default-gray">Body</p>

                                    <EditOutlined className="default-gray hq-clickable" onClick={() => {
                                         setShowEditQuestionBody(true)
                                         setSelectedQuestion(q)
                                    }}/>
                                </Space>
                            <LatexRenderer latex={Body || "-"}/>
                        </Space>
                        <br/>
                        <div>
                        <Space size="large" className="hq-full-width hq-opposite-arrangement">
                            <Space>
                                <p className="default-gray">Choices</p>
                                
                                <Tooltip
                                    color="white"
                                    title={<p>Add choice</p>}
                                >
                                    <PlusOutlined 
                                        className = "default-green hq-clickable" 
                                        onClick={() => {
                                            setShowAddChoice(true)
                                            setSelectedQuestion(q)
                                        }}
                                    />
                                </Tooltip>

                                <Tooltip
                                    color="white"
                                    title={<p>Reorder choices</p>}
                                >
                                    <SortAscendingOutlined 
                                        className = "default-gray default-large hq-clickable" 
                                        onClick={() => {
                                                setSelectedQuestion(q)
                                                setShowReorderQuestionChoices(true)
                                        }}
                                    />
                                </Tooltip>
                            </Space>

                            {!IsSingleChoice &&
                            <Tooltip
                                color="white"
                                title={<p>Choice combination statistics</p>}
                            >
                                <ExperimentOutlined 
                                    className = "default-gray default-large hq-clickable" 

                                    onClick={() => {
                                        setShowChoiceCombination(true)
                                        setCombinationData({
                                            question: q,
                                            Combinations: choiceCombinations,
                                            TotalPlay: totalPlay
                                        })
                                    }}
                                />
                            </Tooltip>}
                        </Space>
                        <List
                            dataSource={Choices.sort((a,b) => b.Order - a.Order)}
                            className="hq-full-width"
                            renderItem={(c, ci) => {
                                const {Id, LaTex, ImageURL, Type, MaxCharacterCount, Start, End, Step} = c

                                let overalClickFrequency = 0
                                let totalClick = 0
                                let relationArray = []

                                let topFiveText = []
                                let inputRangeSpectrum = []
                                
                                const cStat = choiceStats.filter(cc => cc.Id === c.Id)[0]
                                const txtStat = textInputStats.filter(cc => cc.Id === c.Id)[0]
                                const rangeStat = rangeInputStats.filter(cc => cc.Id === c.Id)[0]

                                if(cStat){
                                    const {TotalChoiceSelection, Relations} = cStat
                                    totalClick = TotalChoiceSelection || 0;
                                    overalClickFrequency = TotalChoiceSelection ? (100 * (TotalChoiceSelection / totalPlay)).toFixed(0) + "%" : 0
                                    
                                    if(totalClick && Relations && Relations.length){
                                        relationArray = Relations.map((r) => {
                                            const {Count, Id} = r

                                            const otherCIndex = Choices.map(c => c.Id).findIndex(a => a === Id)
                                            const perc = (100 * (Count / totalClick)).toFixed(0) + "%"
                                            return ({Percentage: perc, Index: otherCIndex})
                                        }).sort((a,b) => a.Index - b.Index)
                                    }
                                }

                                if(txtStat){
                                    totalClick = txtStat.TotalInput
                                    topFiveText = txtStat.TopFiveInputs
                                }

                                if(rangeStat){
                                    totalClick = rangeStat.TotalInput
                                    inputRangeSpectrum = rangeStat.RangeInputs
                                }

                                return(
                                    <Tooltip 
                                        key={Id} 
                                        color="white"
                                        placement="left"
                                        title={
                                            <Space direction="vertical">
                                                <Button 
                                                size="small" 
                                                className="hq-full-width" 
                                                onClick={() => {
                                                    setSelectedChoice(c)
                                                    setShowEditChoiceLatex(true)
                                                }}>
                                                    Edit LaTeX
                                                </Button>
                                                <Button size="small" className="hq-full-width" 
                                                    onClick={() => {
                                                        setSelectedChoice(c)
                                                        setShowEditChoiceImage(true)
                                                    }}
                                                >
                                                    {ImageURL ? "Edit" : "Add"} Image
                                                </Button>
                                                {ImageURL && LaTex
                                                &&
                                                <Button size="small" className="hq-full-width"
                                                    onClick={() => {
                                                        const data = new FormData()
                                                        data.append("ChoiceId", c.Id)

                                                        removeQuestionnaireChoiceImage(data).then(r => handleResponse(r, api, "Removed", 1, () => {
                                                            loadData()
                                                        }))
                                                    }}
                                                >
                                                    Remove image
                                                </Button>}
                                                {ImageURL && LaTex
                                                &&
                                                <Button size="small" className="hq-full-width"
                                                onClick={() => {
                                                    const data = new FormData()
                                                    data.append("ChoiceId", c.Id)

                                                    removeQuestionnaireChoiceLatex(data).then(r => handleResponse(r, api, "Removed", 1, () => {
                                                        loadData()
                                                    }))
                                                }}
                                                >
                                                    Remove LaTeX
                                                </Button>}
                                                
                                                <Popconfirm
                                                    title="Remove choice"
                                                    description="Are you sure to delete the choice?"
                                                    
                                                    onConfirm={() => {
                                                        const data = new FormData()
                                                            
                                                        data.append("ChoiceId", c.Id)

                                                        removeQuestionnaireChoice(data).then(r => handleResponse(r, api, "Choice removed successfully", 1, () => {
                                                            loadData()
                                                        }))
                                                    }}
                                                    onCancel={() => {}}
                                                    okText="Yes"
                                                    cancelText="No"
                                                    placement="right"
                                                >
                                                    <Button size="small" className="hq-full-width">
                                                        Delete choice
                                                    </Button>
                                                </Popconfirm>
                                            </Space>
                                        }
                                    >
                                        <Space  className="questionnaire-question-choice-line" direction="vertical">
                                        <Space className="hq-opposite-arrangement" align="start">
                                            <Space align="start">
                                                <p className="default-title">{ci+1}</p>

                                                {LaTex && <LatexRenderer latex={LaTex || ""} />}

                                                {ImageURL && 
                                                <img 
                                                    alt="img"

                                                    src={ImageURL}

                                                    className="questionnaire-question-choice-image"

                                                    onClick={() => {
                                                        api.destroy()

                                                        api.info(
                                                            <Space align="start">
                                                                <img 
                                                                    alt={Title}
                                                                    className="questionnaire-question-image-zoom"

                                                                    src={ImageURL}                                                    
                                                                />
                                                                <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                                            </Space>
                                                        , 0)
                                                    }}
                                                />}
                                            </Space>

                                            {Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL) && 
                                            <Space>
                                                <Tooltip
                                                    color="white"
                                                    title={<p>Click frequency per participation</p>}
                                                >
                                                 <p className="default-title">{overalClickFrequency}</p>
                                                </Tooltip>
                                                <div className="questionnaire-view-edit-choice-line-stat-seperation" />
                                                {relationArray.length ? 
                                                <div>   
                                                    <Tooltip
                                                        color="white"
                                                        title={<p>Frequency of clicking other choices with this choice</p>}
                                                    >
                                                        <Space>
                                                            {relationArray.map((a, ai) => 
                                                            <Space key={ai}>
                                                                <span className="questionnaire-view-edit-choice-line-stat-index">{a.Index+1}</span>  
                                                                <span className="default-gray">({a.Percentage})</span>
                                                            </Space>)}
                                                        </Space>
                                                    </Tooltip>
                                                </div> : <div/>}
                                            </Space>}
                                        </Space>
                                        {Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.TXT) && 
                                        <Space>
                                            <FontSizeOutlined className="default-smaller"/>
                                            <small className="default-gray">Text input ({MaxCharacterCount} char count)</small>
                                        </Space>}
                                        {Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE) && 
                                        <Space>
                                            <ColumnWidthOutlined />
                                            <small className="default-gray">Range input [{Start}-{End} : {Step}]</small>
                                        </Space>}

                                        {Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.TXT) && 
                                        <div>
                                            <Tree
                                                className="hq-full-width"
                                                showLine
                                                switcherIcon={<DownOutlined />}
                                                defaultExpandedKeys={['title']}
                                                onSelect={() => {}}
                                                treeData={[{
                                                    title:
                                                    <Space>
                                                        <p className="default-smaller">Top 5 answers</p>
                                                        <Tooltip
                                                            color="white"
                                                            title={<p>See all inputs</p>}
                                                        >
                                                            <EyeOutlined 
                                                                className="default-gray hq-clickable" 
                                                                onClick={() => {
                                                                    setSelectedChoice(c)
                                                                    setShowTextInputChoiceInputs(true)
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    </Space>,
                                                    key:'title',
                                                    children:topFiveText.map((a, ai) => {
                                                        const {Text, Count} = a
                                                        const perc = (100 * (Count / totalClick)).toFixed(0) + "%"
                                                        return({
                                                            title: <Space key={ai}>
                                                                        <p className="default-smaller default-black">{Text}</p>
                                                                        <p className="default-smaller default-gray">{perc}</p>
                                                                    </Space>,
                                                            key:ai
                                                        })
                                                    })
                                                }]}
                                            />
                                            
                                        </div>}

                                        {Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE) && 
                                        <Space align="start">
                                            <QuestionnaireQuestionChoiceRangeInputSpectrum 
                                                start={Start}
                                                end={End}
                                                step={Step}
                                                data={inputRangeSpectrum}
                                                total={totalClick}
                                                style={{width:400, height:300}}
                                            />
                                            <Tooltip
                                                color="white"
                                                title={<p>Download spectrum data</p>}
                                            >
                                                <Button
                                                icon={<VerticalAlignBottomOutlined className="default-green"/>}
                                                type="default"
                                                size="small"

                                                onClick={() => {
                                                    downloadSpectrum(inputRangeSpectrum, totalClick)
                                                }}
                                                />
                                            </Tooltip>
                                        </Space>}

                                    </Space>
                                    </Tooltip>
                                )
                            }}
                         />
                        </div>
                    </Space>
                </Space>

                
                <Space direction="vertical" size="small">
                <Popconfirm
                    title="Remove question"
                    description="Are you sure to delete the question?"
                                        
                    onConfirm={() => {
                        const data = new FormData()
                                                
                        data.append("QuestionId", q.Id)

                        removeQuestionnaireQuestion(data).then(r => handleResponse(r, api, "Question removed successfully", 1, () => {
                            loadData()
                        }))
                    }}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                    placement="right"
                >
                    <Button
                        type="default"
                        size="small"
                        icon={<DeleteOutlined className="default-red"/>}
                    >
                        Delete question
                    </Button>
                </Popconfirm>

                <Button
                    type="default"
                    size="small"
                    icon={<CopyOutlined className="default-green"/>}

                    onClick={() => {
                        setShowCopyQuestion(true)
                        setSelectedQuestion(q)
                    }}
                >
                    Copy question
                </Button>
                </Space>
                </Space>
            </div>
        )
    }

    const renderBody = () => {
        const {Questions} = surveyViewEdit

        
        const tabs = Questions.sort((a,b) => a.Order - b.Order).map((q, qi) => {
            const {Title} = q


            return ({
                key: qi + 1,
                label: 
                <Space size="middle">
                    <p className="default-gray">{(qi + 1)}</p>
                    <p className={currentQuestionsTab === (qi + 1) ? "default-title" : ""}>{' '}{Title}</p>
                </Space> ,
                children:<div>{renderQuestionInList(q, qi)} </div>
            })
        })
        return(
            <div className="hq-full-width">
                
                
                <Tabs
                    defaultActiveKey={0}
                    items={[
                        {
                            key:0,
                            label:'Meta data',
                            children: <div>{renderMetadata()}</div>
                        }
                        ,...tabs]}
                    onChange={(t) => {
                        setCurrentQuestionsTab(t)
                    }}
                    activeKey={currentQuestionsTab}
                    className="questionnaire-view-edit-tabs"
                />   
            </div>
        )
    }

    const renderSurvey = () => {
        return(
            <div>
               {renderHeader()}
               {renderBody()}
            </div>
        )
    }

    return(
        <PagesWrapper>
            {contextHolder}

            {isLoadingSurveyViewEdit && <Skeleton />}

            {errorGetSurveyViewEdit && 
            <ErrorComponent 
                error={errorGetSurveyViewEdit}

                onReload={() => loadData()}
            />}

            {!(isLoadingSurveyViewEdit || errorGetSurveyViewEdit) && surveyViewEdit && renderSurvey()}

            <CombinationList 
                open={showChoiceCombination}
                onClose={() => setShowChoiceCombination(false)}

                survey = {surveyViewEdit}
                data={combinationData}
            />

            <ParticipationHistory 
                open={showHistory}
                onClose={() => setShowHistory(false)}

                survey={surveyViewEdit}
            />

            <AssignSeriesToQuestionnaire 
                open={showAssignToSeries}
                onClose={() => setShowAssignToSeries(false)}

                survey={surveyViewEdit}

                reloadSurvey={() => loadData()}
            />

            <DeassignSeriesToQuestionnaire 
                open={showDeassignToSeries}
                onClose={() => setShowDeassignToSeries(false)}

                survey={surveyViewEdit}

                reloadSurvey={() => loadData()}
            />

            <EditQuestionnaireCode 
                open={showEditCode}
                onClose={() => setShowEditCode(false)}

                survey={surveyViewEdit}
                reloadSurvey={() => loadData()}
            />

            <EditQuestionnaireExplanation 
                open={showEditExplanation}
                onClose={() => setShowEditExplanation(false)}

                survey={surveyViewEdit}
                reloadSurvey={() => loadData()}
            />

            <EditQuestionnaireQuestionTitle 
                open={showEditQuestionTitle}
                onClose={() => setShowEditQuestionTitle(false)}

                question={selectedQuestion}
                reloadSurvey={() => loadData()}
            
            />

            <EditQuestionnaireQuestionBody 
                open={showEditQuestionBody}
                onClose={() => setShowEditQuestionBody(false)}

                question={selectedQuestion}
                reloadSurvey={() => loadData()}
            />

            <AddQuestionnaireQuestionImage
                open={showAddQuestionImage}
                onClose={() => setShowAddQuestionImage(false)}
            
                question={selectedQuestion}
                reloadSurvey={() => loadData()}
            />

            <EditQuestionnaireChoiceLatex 
                open={showEditChoiceLatex}
                onClose={() => setShowEditChoiceLatex(false)}

                choice={selectedChoice}
                reloadSurvey={() => loadData()}
            />

            <EditQuestionnaireChoiceImage 
                open={showEditChoiceImage}
                onClose={() => setShowEditChoiceImage(false)}

                choice={selectedChoice}
                reloadSurvey={() => loadData()}
            />

            <AddQuestionnaireChoice 
                open={showAddChoice}
                onClose={() => setShowAddChoice(false)}

                question={selectedQuestion}
                reloadSurvey={() => loadData()}
            />

            <AddQuestionnaireQuestion 
                open={showAddQuestion}
                onClose={() => setShowAddQuestion(false)}

                survey={surveyViewEdit}
                reloadSurvey={() => loadData()}
            />

            <ReorderQuestionnaireQuestions 
                open={showReorderQuestions}
                onClose={() => setShowReorderQuestions(false)}

                survey={surveyViewEdit}
                reloadSurvey={() => loadData()}
            />

            <EditQuestionnaireFinalText 
                open={showEditFinalText}
                onClose={() => setShowEditFinalText(false)}

                survey={surveyViewEdit}
                reloadSurvey={() => loadData()}
            />

            <EditQuestionnaireImage
                open={showEditSurveyImage}
                onClose={() => setShowEditSurveyImage(false)}

                survey={surveyViewEdit}
                reloadSurvey={() => loadData()}
            />    

            <CopyQuestionnaireQuestion 
                open={showCopyQuestion}
                onClose={() => setShowCopyQuestion(false)}

                question={selectedQuestion}
                reloadSurvey={() => loadData()}
            />  

            <CopyQuestionnaire 
                open={showCopySurvey}
                onClose={() => setShowCopySurvey(false)}

                survey={surveyViewEdit}
                reloadData={() => loadData()}
            />

            <ReorderQuestionnaireQuestionChoices 
                open={showReorderQuestionChoices}
                onClose={() => setShowReorderQuestionChoices(false)}

                question={selectedQuestion}
                reloadSurvey={() => loadData()}
            />

            <TextInputChoiceInputsList 
                open={showTextInputChoiceInputs}
                onClose={() => setShowTextInputChoiceInputs(false)}
                choice={selectedChoice}
            />
        </PagesWrapper>
    )
}