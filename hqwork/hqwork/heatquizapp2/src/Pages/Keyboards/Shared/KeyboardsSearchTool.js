import { Button, Col, Input, Row, Select, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";

import './KeyboardsSearchTool.css'
import { useKeyboard } from "../../../contexts/KeyboardContext";
import { GetPagesArray } from "../../../services/Auxillary";

export function KeyboardsSearchTool({onSetFirstIndex}){

    const { isLoadingKeyLists, keyLists, getAllKeyLists,
        isLoadingKeyboards, keyboards,searchKeyboards,
        
        } = useKeyboard()

    const [code, setCode] = useState('')
    const [selectedList, setSelectedList] = useState(null)

    const [selectedPerPage, setSelectedPerPage] = useState(50)
    const [selectedPage, setSelectedPage] = useState(1)

    useEffect(() => {
        getAllKeyLists()
    }, [])

    const searchData = () => {
        const VM = ({
            Code:code||"",
            KeyLists: selectedList ? [selectedList.Id] : [],
            Page:0,
            QperPage:selectedPerPage,
        })

        onSetFirstIndex(0)
        setSelectedPage(1)

        searchKeyboards(VM)
    }

    const getAllData = () => {
        const VM = ({
            Code:"",
            KeyLists: [],
            Page:0,
            QperPage:selectedPerPage,
        })

        onSetFirstIndex(0)
        setSelectedPage(1)
        
        searchKeyboards(VM)
    }

    const renderPagesCols = () => {
        const {Codes, NumberOfKeyboards, Ids: KIds} = keyboards
        const pageCols = GetPagesArray(NumberOfKeyboards, selectedPerPage, Codes)

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

                            const Ids = KIds.slice(ci*selectedPerPage, (ci + 1)*selectedPerPage)

                            const VM = ({Ids, NumberOfKeyboards, Codes, KeyboardIds: KIds})

                            searchKeyboards(VM, true)
                        }}
                    >
                        <p className="pages-single-value">{c.Index + ' ' + c.Character}</p>
                    </Col>
                )}
                </Row>
                <small className="search-result"> {NumberOfKeyboards} keyboards</small>
            </div>
        )
    } 

    return(
        <div>
            <div className="keyboard-search-tool-container">
                <Space> 
                    <div className="keyboard-search-tool-input-column">
                        <Input  
                            placeholder="Keyboard's code or parts of it"
                            suffix={<small>Code</small>}

                            value={code}
                            onChange={(v) => setCode(v.target.value)}
                        />
                    </div>

                    <div className="keyboard-search-tool-input-column">
                        {isLoadingKeyLists ? 
                        
                        <Spin />
                        :
                        <Select
                                className="keyboard-search-tool-input-column"
                                onChange={(v, option) => {
                                    const findL = keyLists.filter(l => l.Id === option.value)[0]

                                    setSelectedList(findL)
                                }}
                                defaultValue={'please select'}
                                value={(selectedList || {'Code': 'please select'}).Code}

                                options={(keyLists || []).map((d) => ({
                                    value: d.Id,
                                    label: d.Code
                                    }))}

                                suffixIcon={<span>Key list</span>}
                        /> }
                    </div>

                    <div>
                        <Select
                            className="keyboard-search-input-select-page"
                            onChange={(v, option) => {
                                const value = option.value

                                setSelectedPerPage(value)
                            }}
                            defaultValue={'please select'}
                            value={selectedPerPage}

                            options={[50,20,10].map(v => ({value:v, label:v}))}
                            suffixIcon={<span>Keyboards per page</span>}
                        />
                    </div>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <Space>
                        <Button
                            loading={isLoadingKeyboards}
                            onClick={() => searchData()}
                        >
                            Search
                        </Button>

                        <Button 
                            loading={isLoadingKeyboards}
                            onClick={() => getAllData()}
                        >

                            Get all Keyboards
                        </Button>
                    </Space>
                </Space>

                {isLoadingKeyboards ? 
                <Space>
                    <Spin />
                </Space> : (keyboards && renderPagesCols())}
            </div>
        </div>
    )
}