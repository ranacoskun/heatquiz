import React, { useEffect, useState } from "react";
import { useDatapools } from "../../../contexts/DatapoolsContext";
import {Button, Col, Input, Row, Select, Space, Spin, message } from "antd";
import { useTopics } from "../../../contexts/TopicsContext";
import { useLevelsOfDifficulty } from "../../../contexts/LevelOfDifficultyContext";

import './List.css'
import { CLICKABLE_QUESTION_PARAMETER, DIAGRAM_QUESTION_PARAMETER, ENERGY_BALANCE_QUESTION_PARAMETER, FBD_QUESTION_PARAMETER, KEYBOARD_QUESTION_PARAMETER, MULTIPLE_CHOICE_QUESTION_PARAMETER, PV_DIAGRAM_QUESTION_PARAMETER, QUESTION_SEARCH_CRITERIAS, QUESTION_SEARCH_CRITERIA_MEDIAN_TIME, QUESTION_SEARCH_CRITERIA_PLAY_STATS, QUESTION_SEARCH_CRITERIA_QUESTION_TYPES, QUESTION_TYPES_SEARCH_NAMES } from "./constants";
import { useQuestions } from "../../../contexts/QuestionsContext";
import { GetPagesArray } from "../../../services/Auxillary";

export function QuestionsSearchTool({onSetFirstIndex}){
    const {topics, errorGetTopics, isLoadingTopics, getAllTopics} = useTopics()
    const { isLoadingLODs, errorGetLODs, LODs, getAllLODs} = useLevelsOfDifficulty()

    const {questions,isLoadingQuestions, searchQuestions} = useQuestions()

    const {selectedDatapool} = useDatapools()

    const [questionCode, setQuestionCode] = useState('')
    const [selectedLOD, setSelectedLOD] = useState(null)
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [selectedSubtopic, setSelectedSubtopic] = useState(null)

    const [selectedSearchCriteria, setSelectedSearchCriteria] = useState(QUESTION_SEARCH_CRITERIA_QUESTION_TYPES)
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(QUESTION_TYPES_SEARCH_NAMES)
    
    const [medianTimeValueMin, setMedianTimeValueMin] = useState(1)
    const [medianTimeValueMax, setMedianTimeValueMax] = useState(10)

    const [minPlayTimes, setMinPlayTimes] = useState(1)
    const [minSuccessRate, setMinSuccessRate] = useState(0)
    const [maxSuccessRate, setMaxSuccessRate] = useState(50)


    const [selectedPerPage, setSelectedPerPage] = useState(50)
    const [selectedPage, setSelectedPage] = useState(1)

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        getAllLODs()
    }, [])

    useEffect(() => {
        getAllTopics()

        setSelectedTopic(null)
        setSelectedSubtopic(null)

    }, [selectedDatapool])

    useEffect(() => {
        if(errorGetTopics){
            messageApi.destroy()
            messageApi.error(errorGetTopics)
        }

        if(errorGetLODs){
            messageApi.destroy()
            messageApi.error(errorGetLODs)
        }
    }, [errorGetTopics, errorGetLODs])


    const renderSelectQuestionTypes = () => {
        return(
            <div className="question-search-criteria">
                <Select 
                    onChange={(v, option) => {
                        const findTypes = QUESTION_TYPES_SEARCH_NAMES.filter(a =>v.includes(a.value))

                        setSelectedQuestionTypes(findTypes)
                    }}
                    mode="multiple"
                    size="small"
                    defaultValue={'please select'}
                    value={selectedQuestionTypes}

                    options={QUESTION_TYPES_SEARCH_NAMES}
                />
            </div>
        )
    }

    const renderSpecifyMedianTime = () => {
        return(
            <div className="question-search-criteria">
                <Space size={'large'}>
                        <Input 
                            placeholder="Median time in seconds"
                            className="question-search-criteria-play-stats-input"
                            value={medianTimeValueMin}
                            type="number"
                            min={1}
                            onChange={(v) => {
                                const value = v.target.value
                                if(value <= 0) return

                                setMedianTimeValueMin(parseInt(value))
                            }}
                            suffix={
                            <small className="suffix-word">
                                From {' '} <i>(seconds)</i>
                            </small>}
                           
                        />
                       
                   
                        <Input 
                            placeholder="Median time in seconds"
                            className="question-search-criteria-play-stats-input"
                            value={medianTimeValueMax}
                            type="number"
                            min={1}
                            onChange={(v) => {
                                const value = v.target.value
                                if(value <= 0) return

                                setMedianTimeValueMax(parseInt(value))
                            }}

                            suffix = { 
                                <small className="suffix-word">
                                    To {' '} <i>(seconds)</i>
                                </small>}
                        />
                </Space>
            </div>
        )
    }

    const renderSpecifyPlayStats = () => {
        return(
            <div className="question-search-criteria">
                <Space size={'large'}>
                    <Input 
                            placeholder="Minimum number of play times"
                            className="question-search-criteria-play-stats-input"
                            value={minPlayTimes}
                            type="number"
                            min={1}
                            onChange={(v) => {
                                const value = v.target.value
                                if(value <= 0) return

                                setMinPlayTimes(parseInt(value))
                            }}
                            suffix={
                            <small className="suffix-word">
                                Min. # of plays
                            </small>}
                           
                        />

                        <Input 
                            placeholder="Minimum number of play times"
                            className="question-search-criteria-play-stats-input"
                            value={minSuccessRate}
                            type="number"
                            min={1}
                            onChange={(v) => {
                                const value = v.target.value
                                if(value < 0) return
                                if(value > 99) return
                                if(value > maxSuccessRate) return

                                setMinSuccessRate(parseInt(value))
                            }}
                            suffix={
                            <small className="suffix-word">
                                Success rate from %
                            </small>}
                           
                        />

                        <Input 
                            placeholder="Minimum number of play times"
                            className="question-search-criteria-play-stats-input"
                            value={maxSuccessRate}
                            type="number"
                            min={1}
                            onChange={(v) => {
                                const value = v.target.value
                                if(value < 0) return
                                if(value > 100) return
                                if(value < minSuccessRate) return

                                setMaxSuccessRate(parseInt(value))
                            }}
                            suffix={
                            <small className="suffix-word">
                                Success rate to %
                            </small>}
                           
                        />
                </Space>
            </div>
        )
    }

    const selectCriteria = {
        [QUESTION_SEARCH_CRITERIA_QUESTION_TYPES.value]: renderSelectQuestionTypes,
        [QUESTION_SEARCH_CRITERIA_PLAY_STATS.value]: renderSpecifyPlayStats,
        [QUESTION_SEARCH_CRITERIA_MEDIAN_TIME.value]: renderSpecifyMedianTime,
    }

    const searchData = () => {
        const VM = ({
            
            Subgroup: selectedTopic && selectedSubtopic ? selectedSubtopic.Id : -1, 

            Topic: selectedTopic ? selectedTopic.Id : -1, 

            LevelOfDifficulty: selectedLOD ? selectedLOD.Id : -1,

            Code: questionCode.trim(),
            Page:0,
            QperPage:selectedPerPage,

            SearchBasedOnQuestionTypes: selectedSearchCriteria.value === QUESTION_SEARCH_CRITERIA_QUESTION_TYPES.value,

            ShowClickableQuestions: selectedQuestionTypes.map(a => a.value).includes(CLICKABLE_QUESTION_PARAMETER),
            ShowKeyboardQuestions: selectedQuestionTypes.map(a => a.value).includes(KEYBOARD_QUESTION_PARAMETER),
            ShowMultipleChoiceQuestions: selectedQuestionTypes.map(a => a.value).includes(MULTIPLE_CHOICE_QUESTION_PARAMETER),
            ShowEBQuestions: selectedQuestionTypes.map(a => a.value).includes(ENERGY_BALANCE_QUESTION_PARAMETER),
            ShowFreebodyDiagramQuestions:  selectedQuestionTypes.map(a => a.value).includes(FBD_QUESTION_PARAMETER),
            ShowDiagramQuestions:  selectedQuestionTypes.map(a => a.value).includes(DIAGRAM_QUESTION_PARAMETER),
            ShowPVDiagramQuestions:  selectedQuestionTypes.map(a => a.value).includes(PV_DIAGRAM_QUESTION_PARAMETER),
            
            SearchBasedOnMedianTime: selectedSearchCriteria.value === QUESTION_SEARCH_CRITERIA_MEDIAN_TIME.value,

            MedianTime1:medianTimeValueMin,
            MedianTime2: medianTimeValueMax,

            SearchBasedOnPlayStats: selectedSearchCriteria.value === QUESTION_SEARCH_CRITERIA_PLAY_STATS.value,

            MinimumQuestionPlay: minPlayTimes,
            SuccessRate1: minSuccessRate,
            SuccessRate2: maxSuccessRate,

            GetIdsTypes: true
        })

        searchQuestions(VM)
        onSetFirstIndex(0)
        setSelectedPage(1)
    }

    const getAllData = () => {
        const VM = ({
            
            Subgroup: -1, 

            Topic: -1, 

            LevelOfDifficulty:  -1,

            Code: questionCode.trim(),
            Page:0,
            QperPage:selectedPerPage,

            SearchBasedOnQuestionTypes: true,

            ShowClickableQuestions: true,
            ShowKeyboardQuestions: true,
            ShowMultipleChoiceQuestions: true,
            ShowEBQuestions: true,
            ShowFreebodyDiagramQuestions: true,
            ShowDiagramQuestions: true,
            ShowPVDiagramQuestions: true,
            
            SearchBasedOnMedianTime: false,

            MedianTime1:0,
            MedianTime2: 0,

            SearchBasedOnPlayStats: false,

            MinimumQuestionPlay: 0,
            SuccessRate1: 0,
            SuccessRate2: 0,

            GetIdsTypes: true
        })

        searchQuestions(VM)
        onSetFirstIndex(0)
        setSelectedPage(1)
    }

    const renderSearchButtons = () => (
            <Space size={'small'}>
                <Button
                    onClick={searchData}
                >
                    Search 
                </Button>
                <Button onClick={getAllData}>
                    Get all questions 
                </Button>
            </Space>
            
    )

   
    const renderPagesCols = () => {
        const {Codes, NumberOfQuestions, QuestionsIdsTypes} = questions
        const pageCols = GetPagesArray(NumberOfQuestions, selectedPerPage, Codes)

        return(
            <div>
                <Row
                    className="pages-single-row"
                    gutter={8}
                >
                    {pageCols.map((c, ci) => 
                    <Col 
                        key={ci}
                        className={(selectedPage === ci+1) ? "pages-single-col-selected" : "pages-single-col"}

                        onClick={() => {
                            setSelectedPage(ci+1)
                            onSetFirstIndex(ci*selectedPerPage)

                            const Ids = QuestionsIdsTypes.slice(ci*selectedPerPage, (ci + 1)*selectedPerPage).map(a => a.Key)

                            const VM = ({Ids, QuestionsIdsTypes, Codes, NumberOfQuestions})

                            searchQuestions(VM, true)
                        }}
                    >
                        <p className="pages-single-value">{c.Index + ' ' + c.Character}</p>
                    </Col>
                )}
                </Row>
                <small className="search-result"> {NumberOfQuestions} questions</small>
            </div>
        )
    }

    return(
        <div className="question-search-container">
            {contextHolder}
            <div className="question-search-inner-container">
                <div className="question-search-input-container">
                    <Space size={'large'}>
                        <div className="question-search-input-column">
                            
                            <Input 
                                placeholder="Questions code or part of it"
                                value={questionCode}
                                onChange={(v) => setQuestionCode(v.target.value)}
                                suffix = {<small className="suffix-word">Code</small>}
                            />
                        </div>
                        <div className="question-search-input-column">
                            {isLoadingLODs ?
                            <Spin/>
                            :
                            <Select
                                onChange={(v, option) => {
                                    const findLOD = LODs.filter(l => l.Id === option.value)[0]

                                    setSelectedLOD(findLOD)
                                }}
                                defaultValue={'please select'}
                                value={(selectedLOD || {'Name': 'please select'}).Name}

                                options={(LODs || []).map((d) => ({
                                    value: d.Id,
                                    label: d.Name
                                    }))}

                                suffixIcon={<span>Level of difficulty</span>}
                            />}
                        </div>
                        <div className="question-search-input-column">
                            {isLoadingTopics ? 
                            <Spin/>
                            :
                            <Select
                                onChange={(v, option) => {
                                    const findTopic = topics.filter(t => t.Id === option.value)[0]

                                    setSelectedTopic(findTopic)
                                    setSelectedSubtopic(null)

                                }}
                                defaultValue={'please select'}
                                value={(selectedTopic || {'Name': 'please select'}).Name}

                                options={(topics || []).map((d) => ({
                                    value: d.Id,
                                    label: d.Name
                                    }))}

                                suffixIcon={<span>Topic</span>}

                            />}
                        </div>
                        <div 
                        className="question-search-input-column">
                            {selectedTopic && <Select
                                onChange={(v, option) => {
                                    const findSubtopic = selectedTopic.Subtopics.filter(s => s.Id === option.value)[0]

                                    setSelectedSubtopic(findSubtopic)
                                }}
                                defaultValue={'please select'}
                                value={(selectedSubtopic || {'Name': 'please select'}).Name}

                                options={(selectedTopic.Subtopics || []).map((d) => ({
                                    value: d.Id,
                                    label: d.Name
                                    }))}

                                suffixIcon={<span>Subtopic</span>}
                                
                            />}
                        </div>
                        <div 
                        className="question-search-input-column">
                            <Select
                                onChange={(v, option) => {
                                    setSelectedSearchCriteria(option)
                                }}
                                defaultValue={'please select'}
                                value={selectedSearchCriteria.label}

                                options={QUESTION_SEARCH_CRITERIAS}

                                suffixIcon={<span>Search criteria</span>}
                            />
                        </div>
                    </Space>
                    <div 
                    className="question-search-pages-input-column">
                        <Select
                            onChange={(v, option) => {
                                const value = option.value

                                setSelectedPerPage(value)

                                if(questions && questions.QuestionsIdsTypes){
                                    const {QuestionsIdsTypes, Codes, NumberOfQuestions} = questions

                                    setSelectedPage(1)
                                    onSetFirstIndex(0)

                                    const Ids = QuestionsIdsTypes.slice(0, value).map(a => a.Key)

                                    const VM = ({Ids, QuestionsIdsTypes, Codes, NumberOfQuestions})

                                    searchQuestions(VM, true)
                                }
                            }}
                            defaultValue={'please select'}
                            value={selectedPerPage}

                            options={[50,20,10].map(v => ({value:v, label:v}))}
                            suffixIcon={<span>Questions per page</span>}
                        />
                    </div>
                </div>
                
                    
            <br/>
            <div 
                size={'large'}
                className="question-search-criteria-buttons-container"
            >
               
                <div className="question-search-criteria-container">
                    {selectCriteria[selectedSearchCriteria.value]()}
                </div>
                <div>
                    {renderSearchButtons()}
                </div>
            </div>
            {isLoadingQuestions ? <Spin /> : (questions && renderPagesCols())}
            </div>
        </div>
    )
}