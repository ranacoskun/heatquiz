import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, VerticalAlignBottomOutlined, SortAscendingOutlined, SortDescendingOutlined} from '@ant-design/icons';
import {Button, Col, Divider, Drawer, List, Radio, Skeleton, Space, Tooltip} from "antd";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { downloadFile } from "../../../services/Auxillary";

export function TextInputChoiceInputsList({open, onClose, choice}){
    if(!open) return <div/>

    const [showAccordingToCount, setShowAccordingToCount] = useState(true)
    const [sortAscending, setSortAscending] = useState(true)

    const {questionnaireChoiceTextInputs: data, errorGetQuestionnaireChoiceTextInputs, isLoadingGetQuestionnaireChoiceTextInputs: isLoading, getQuestionnaireChoiceTextInputs} = useQuestionnaires()

    useEffect(() => {
        if(open){
            getQuestionnaireChoiceTextInputs(choice.Id)
            setShowAccordingToCount(true)
            setSortAscending(false)
        }
    }, [open])

    const downloadInputsList = () => {
        const {LaTex} = choice 
        const {Total} = data

        const _data = getData()

        let text = ""
        text += "{" + (LaTex || "image") + "}" + ";\n"
        for(const d of _data){
            const {Text, Count} = d
            const perc = (100 * (Count / Total)).toFixed(0) + "%"
            text += Text + ", " + Count + ", " + perc + ";\n"
        }

        downloadFile(text, "inputsList.txt", "txt")
    }


    const getData = () => {
        const {CountDescending, TextLengthDecending} = data

        if(sortAscending){
            if(showAccordingToCount){
                const _data = [...CountDescending]
                _data.reverse()
                return _data;
            }
            else {
                const _data2 = [...TextLengthDecending]
                _data2.reverse()
                return _data2;
            }
        }
        else{
            if(showAccordingToCount) return CountDescending;
            else return TextLengthDecending
        }
    }

    const renderData = () => {
        const {Total} = data
        const _data = getData()
        return(
            <div className="hq-full-width">
                <Space>
                    <p className="default-gray">Sort by</p>
                    <Radio.Group 
                            size="small" 
                            value={showAccordingToCount} 
                            onChange={(v) => {
                                setShowAccordingToCount(v.target.value)
                            }}>
                        <Radio.Button value={true}>Frequency</Radio.Button>
                        <Radio.Button value={false}>Text length </Radio.Button>
                    </Radio.Group>
                    <div 
                        className="hq-clickable"
                        onClick={() => setSortAscending(!sortAscending)}
                    >
                        {sortAscending ? <SortAscendingOutlined className="default-larger"/> : <SortDescendingOutlined className="default-larger"/>}
                    </div>
                    {data && data.CountDescending.length ? 
                    <Tooltip
                        color="white"
                        title={<p>Download inputs list in current order</p>}
                    >
                        <Button
                        icon={<VerticalAlignBottomOutlined className="default-green"/>}
                        type="default"
                        size="small"

                        onClick={() => {
                            downloadInputsList()
                        }}
                        />
                    </Tooltip>
                    : <div/>}
                </Space>
                <Divider/>
                <List 
                    className="hq-full-width"
                    dataSource={_data}
                    renderItem={(d, di) => {
                        const {Text, Count} = d
                        const perc = (100 * (Count / Total)).toFixed(0) + "%"
                        return(
                            <div key={di}>
                                <Space className="hq-full-width">
                                    <Col xs={3}>
                                    <p className="default-gray">{perc}</p>
                                    </Col>
                                    &nbsp;
                                    <p className="default-title">{Text}</p>
                                </Space>
                                <br/>
                                <br/>
                            </div>
                        )
                    }}
                />
            </div>
        )
    }

    const {LaTex, ImageURL} = choice
   
    return(
        <Drawer
        title="Text input list"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        closable={true}
        footer={
            <Space
                size={'large'}
                align="start"
            >
                {LaTex && <LatexRenderer latex={LaTex} />}
                {ImageURL && 
                <img 
                    alt={'Choice'}
                    className="multiple-choice-question-edit-view-choice-img"
                    src={ImageURL}
                />}
            </Space>
        }
        >
            {isLoading && <Skeleton />}
            {errorGetQuestionnaireChoiceTextInputs && 
            <ErrorComponent
                error={errorGetQuestionnaireChoiceTextInputs}
                onReload={() => getQuestionnaireChoiceTextInputs(choice.Id)}
            />}

            {!(isLoading || errorGetQuestionnaireChoiceTextInputs) && data && renderData()}
        </Drawer>
    )
}