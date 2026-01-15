import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, SearchOutlined, TrophyOutlined, SelectOutlined, EditOutlined, FileSearchOutlined, VerticalAlignBottomOutlined, AlignCenterOutlined} from '@ant-design/icons';
import {Button, DatePicker, Divider, Drawer, Dropdown, Input, List, Skeleton, Space, Tooltip} from "antd";
import dayjs from "dayjs";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { beautifyDatetime, downloadFile, goToMapEditView, goToMapPlay, goToSeriesPlay, goToSeriesViewEdit } from "../../../services/Auxillary";
import { ViewHistorySnapViews } from "./ViewHistorySnapView";

const { RangePicker } = DatePicker;

export function ParticipationHistory({open, onClose, survey}){
    if(!open) return <div/>

    const {surveyHistory, errorGetSurveyHistory, isLoadingSurveyHistory, getSurveyHistory,} = useQuestionnaires()

    const [showData, setShowData] = useState(false)

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const [showHistorySnap, setShowHistorySnap] = useState(false)
    const [selectedHistorySnap, setSelectedHistorySnap] = useState(null)

    const [key, setKey] = useState("")

    useEffect(() => {
      setStartDate("")
      setEndDate("")
      setKey("")
      setSelectedHistorySnap(null)
      setShowHistorySnap(false)
      setShowData(false)
    }, [open])

    const onRangeChange = (d) => {
      if(!d){
        setStartDate("")
        setEndDate("")
        return
      }
      const fromTD = d[0].format('DD.MM.YYYY HH:mm:ss')
      const toTD = d[1].format('DD.MM.YYYY HH:mm:ss') 

      setStartDate(fromTD)
      setEndDate(toTD)

  }

  const downloadRecords = () => {
    let text = ""
    const {Questions} = survey
    text += "Date Time; Map key; Device key; Series ;MapElement; TotalTime ;"

    if(surveyHistory && surveyHistory.length){
      const h = surveyHistory[0]
      for(const [qi, q] of Questions.sort((a,b) => a.Order - b.Order).entries()){
        text += "Q" +  (qi+1) +";[];"
      }
      text += "\n"
    }

    for(const d of surveyHistory){
      const {Instances, Series, MapElement, TotalTime} = d
        text += beautifyDatetime(d.DateCreated) + ", " + (d.Key || '-') + ", " + d.Player + (Series ? ("," + Series.Code ) : ',-') + (MapElement ? ("," + MapElement.Title ) : ',-') + "," + TotalTime + ";"

        for(const [qi, q] of Questions.sort((a,b) => a.Order - b.Order).entries()){
          const {Choices} = q
          const instance = Instances.filter(a => a.QuestionId === q.Id)[0]

          if(instance){
            text += "Q" + (qi+1) +";"
            text += "["
            const {Statistics} = instance

            for(const [si, s] of Statistics.sort((a,b) => b.Choice.Order - a.Choice.Order).entries()){
              console.log(si)
              const {Value} = s
              const choice = Choices.map((c, ci) => ({...c, index: ci})).filter(c => c.Id === s.ChoiceId)[0]

              text += (Object.is(si, 0) ? "" : ",") + (choice ? (choice.index+1): "?") + (Value ? (":" + Value) : "") 
            }

            text += "];"
          }


        }      
        
        text += "\n"
    }

    downloadFile(text, (survey.Code)+".txt", "txt")

  }

  const downloadRecordsWithText = () => {
    let text = ""
    const {Questions} = survey

    for(const d of surveyHistory){
      const {Instances, Series, MapElement, TotalTime} = d
        text += beautifyDatetime(d.DateCreated) + ", " + (d.Key || '-') + ", " + d.Player + (Series ? ("," + Series.Code ) : ',-')+ (MapElement ? ("," + MapElement.Title ) : ',-') + "," + TotalTime + ";\n"

        for(const [qi, q] of Questions.sort((a,b) => a.Order - b.Order).entries()){
          const {Choices, Body} = q
          const instance = Instances.filter(a => a.QuestionId === q.Id)[0]

          if(instance){
            const {Statistics} = instance

            text += "Q{" + (qi+1) + "} " + Body + "\n"


            for(const s of Statistics.sort((a,b) => b.Choice.Order - a.Choice.Order)){
              const choice = Choices.map((c, ci) => ({...c, index: ci})).filter(c => c.Id === s.ChoiceId)[0]

              if(choice){
                const {Value} = s
                text +=  (choice.index+1) + " " + (choice.LaTex || "image") + " " + (Value || "") + "\n";
              }
              else{
                text += "?\n"
              }

            }
          }


        }        
    }

    downloadFile(text, (survey.Code)+".txt", "txt")

  }

    const renderSearchLine = () => {
      const rangePresets = [
        {
          label: 'Last Hour',
          value: [dayjs().add(-1, 'h'), dayjs()],
        },{
          label: 'Last Day',
          value: [dayjs().add(-1, 'd'), dayjs()],
        },{
          label: 'Last 7 Days',
          value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
          label: 'Last 14 Days',
          value: [dayjs().add(-14, 'd'), dayjs()],
        },
        {
          label: 'Last 30 Days',
          value: [dayjs().add(-30, 'd'), dayjs()],
        }
    ];

      return(
        <div className="hq-full-width">
          <Space>
            <Input 
              placeholder="Search key / code / name"
              value={key}
              onChange={(v) => setKey(v.target.value)}
              className="hq-full-width"
            />

            <RangePicker
              presets={rangePresets}
              showTime
              format="DD.MM.YYYY HH:mm:ss"
              onChange={onRangeChange}
            />

            <Button
              loading={isLoadingSurveyHistory}

              onClick={() => {
                const VM =({
                  Key: key,
                  From:startDate,
                  To:endDate,
                  SurveyId: survey.Id 
                })
                setShowData(true)
                getSurveyHistory(VM)
              }}
            >
              <SearchOutlined className="default-title" />
            </Button>

            {showData && surveyHistory && surveyHistory.length && 
            
            <Space>
              <Tooltip
                color="white"
                title={<p>Download ({surveyHistory.length}) records</p>}
              >
                <Button
                  icon={<VerticalAlignBottomOutlined className="default-green"/>}
                  type="default"

                  onClick={() => {
                    downloadRecords()
                  }}
                />
              </Tooltip>

              <Tooltip
                color="white"
                title={<p>Download ({surveyHistory.length}) records with text</p>}
              >
                <Button
                  icon={<AlignCenterOutlined className="default-gray"/>}
                  type="default"

                  onClick={() => {
                    downloadRecordsWithText()
                  }}
                />
              </Tooltip>
            </Space>
            }
          </Space>
        </div>
      )
    }

    const renderHistory = () => {
      return(
        <div>
          <List 
            dataSource={surveyHistory}
            renderItem={(h, hi) => {
              const {Key, Player,  DateCreated, TotalTime, Series, MapElement} = h
              return(
                <Space className="hq-full-width" direction="vertical"> 
                  <Space className="hq-full-width hq-opposite-arrangement" align="start">
                    <Space size="large" align="start">
                      <Tooltip
                        color="white"
                        title={<p>Click to view answers</p>}
                      >
                        <FileSearchOutlined 
                        onClick={() => {
                          setSelectedHistorySnap(h)
                          setShowHistorySnap(true)
                        }}
                        className="default-title hq-clickable"/>
                      </Tooltip>
                      <p className="default-gray">{hi+1}</p>
                      <div>
                        <p className="default-title">{Key}</p>
                        <p className="default-gray">{Player}</p>
                        <p className="default-gray">{beautifyDatetime(DateCreated)}</p>
                      </div>
                    </Space>
                    <Space direction="vertical" align="end">
                      <p className="default-gray">{TotalTime}s</p>
                      {Series && 
                      <Dropdown
                        menu={{
                          title:'Actions',
                          items:
                          [{
                            key:'series_ply',
                            label:'Play series',
                            icon: <TrophyOutlined className="default-green" />,
                            onClick: () => goToSeriesPlay(Series)
                          },{
                            key:'series_view',
                            label:'Edit view series',
                            icon: <EditOutlined />,
                            onClick: () => goToSeriesViewEdit(Series)
                          }]
                        }}
                      >
                        <Space className="hoverable ">
                          <TrophyOutlined className="default-gray"/>
                          <p className="default-title">{Series.Code}</p>
                        </Space>
                      </Dropdown>
                      }
                      {MapElement &&
                      <Dropdown
                        menu={{
                          title:'Actions',
                          items:[{
                          key:'map_ply',
                          label:'Play map',
                          icon: <TrophyOutlined className="default-green" />,
                          onClick: () => goToMapPlay({Id:MapElement.MapId})
                        },{
                          key:'map_view',
                          label:'Edit view map',
                          icon: <EditOutlined />,
                          onClick: () => goToMapEditView({Id:MapElement.MapId})
                        }]}}
                      >
                        <Space className="hoverable ">
                          <SelectOutlined className="default-gray"/>
                          <p className="default-title">{MapElement.Title}</p>
                        </Space>
                      </Dropdown>}
                    </Space>
                  </Space>
                  <Divider />
                </Space>
              )
            }}
          />
        </div>
      )
    }

    return(
        <Drawer
        title="Participation History"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        closable={true}
        >
          {renderSearchLine()}
          <Divider />
          {isLoadingSurveyHistory && <Skeleton />}
          {errorGetSurveyHistory && <ErrorComponent error={errorGetSurveyHistory} onReload={() => {}}/>}

          {!(isLoadingSurveyHistory || errorGetSurveyHistory) && surveyHistory && showData && renderHistory()}

          <ViewHistorySnapViews 
            open={showHistorySnap}
            onClose={() => setShowHistorySnap(false)}

            surveyId={survey.Id}
            history={selectedHistorySnap}
          />
        </Drawer>
    )
}