import {Button, Drawer, Dropdown, Row, Space, Tooltip, message} from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { CompactQuestionComponent } from "../../Questions/SearchQuestionsList/CompactQuestionComponent";
import { useSeries } from "../../../contexts/SeriesContext";
import { handleResponse } from "../../../services/Auxillary";

export function AssignQuestionsToPool({open, onClose, Series, reloadSeries}){

    if(!open) return <div/>;

    const {isLoadingAssignQuestionsToPool, assignQuestionsToPool} = useSeries()

    const [selectedPool, setSelectedPool] = useState(1)
    const [selectedQuestions, setSelectedQuestions] = useState([])

    const [api, contextHolder] = message.useMessage()
  
    useEffect(() => {
      setSelectedPool(1)
      setSelectedQuestions([])
    }, [open])

    const {Elements} = Series

    let questions = Elements.filter(a => (a.PoolNumber) !== selectedPool).map(e => ({...e.Question, ElementId: e.Id})) 
    const {Stats} = Series

    if(Stats){
      questions = questions.map((q, qi) => ({
        ...q,
        MedianPlayTime: Stats[Elements[qi].Id].MedianPlayTime,
        TotalGames: Stats[Elements[qi].Id].TotalPlay,
        TotalCorrectGames:Stats[Elements[qi].Id].TotalSuccessPlay,
      }))
    }

    const handleSelectQuestion = (q) => {
      const questionIsSelected = selectedQuestions.map(a => a.Id).includes(q.Id)

      let _selectedQuestions = [...selectedQuestions]

      if(questionIsSelected){
          _selectedQuestions = _selectedQuestions.filter(a => a.Id !== q.Id)
      }
      else{
          _selectedQuestions.push(q)
      }

      setSelectedQuestions(_selectedQuestions)
    }

    const getPoolNumbersList = () => {
        const {NumberOfPools} = Series

        let finalList = []

        for(let i = 0; i < NumberOfPools; i++){            
            finalList.push({
                key: 'pool_number'+(1+i),
                label: 'Select Pool #' + (1+i),
                onClick: () => {
                  setSelectedQuestions([])
                  setSelectedPool(i+1)
                }
            })
        }

        return finalList
    }

    const renderPools = () => {
      return(
        <Dropdown
            menu={{
              items: getPoolNumbersList(),
              title:'Change pool number'
            }}
          >
            <div>
            <small className="default-gray hq-normal-font-weight">Selected pool: </small>
            <p className="default-title highlighted hq-normal-font-weight">Pool #{selectedPool}</p>
            </div>
          </Dropdown>
      )
    }

    return(
      <div>
        {contextHolder}
        <Drawer
        title={
          <Space 
            size={'large'}
          >
            <p>Assign questions to pool</p>
            {renderPools()}

            {selectedQuestions.length ? 
            <Button
              size="small"
              type="primary"
              loading={isLoadingAssignQuestionsToPool}
              onClick={() => {
                const VM = ({
                  SelectedElements: selectedQuestions.map(q => q.ElementId),
                  Pool: selectedPool
                })

                assignQuestionsToPool(VM)
                .then(
                  (r) => 
                  handleResponse(r, api, 'Questions assigned successfully', 1, () => {
                    reloadSeries()
                    onClose()
                  }))
              }}
            >
              Update assignment
            </Button> : <div/>}
          </Space>
        }
        width={'100%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            <p
              className="default-gray"
            >Questions assigned to {' '}
            <span 
              className="default-title highlighted"
            >
              Pool #{selectedPool}
            </span>{' '} are not shown</p>
            <br/>
            <Row
                    gutter={[12, 12]}
                >
                    {questions.map((q, qi) => 
                        (
                            <CompactQuestionComponent 
                                q={q}
                                qi={qi}
                                firstIndex={0}
                                selectedQuestions = {selectedQuestions}
                                onRenderCode = {(q, i) =>
                                  
                                  <Tooltip
                                    title={<p>Click to select</p>}
                                    color="white"
                                  >
                                    <p  
                                    onClick={() => handleSelectQuestion(q)}
                                    className="hoverable-plus">
                                    
                                    {i}{' '}{q.Code}
                                  </p>
                                  </Tooltip>
                                }
                            />
                        )
                    )}
                </Row>
        </Drawer>
      </div>
    )
}