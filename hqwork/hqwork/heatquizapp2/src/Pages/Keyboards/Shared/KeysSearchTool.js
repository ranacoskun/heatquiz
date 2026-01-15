import React from "react";
import { useKeyboard } from "../../../contexts/KeyboardContext";
import { useState } from "react";
import { Button, Col, Input, Row, Select, Space, Spin } from "antd";
import { useEffect } from "react";

import './KeysSearchTool.css'
import { GetPagesArray } from "../../../services/Auxillary";
import { useDatapools } from "../../../contexts/DatapoolsContext";
import { NUMERIC_KEY, NUMERIC_KEY_NAME, VARIABLE_KEY, VARIABLE_KEY_NAME } from "../../../Components/Keyboard/constants";

export function KeysSearchTool({onSetFirstIndex}){

    const { 
        isLoadingKeyLists, keyLists, getAllKeyLists,
        keys, isLoadingKeys, searchKeys
    } = useKeyboard()

    const [code, setCode] = useState('')
    const [selectedList, setSelectedList] = useState(null)

    const [selectedPerPage, setSelectedPerPage] = useState(50)
    const [selectedPage, setSelectedPage] = useState(1)

    const [searchType, setSearchType] = useState(NUMERIC_KEY_NAME)

    const {selectedDatapool} = useDatapools()

    useEffect(() => {
        getAllKeyLists()
        setSelectedList(null)

    }, [selectedDatapool])

    const renderPagesCols = () => {
        const {Codes, NumberOfKeys, Ids: KIds} = keys
        const pageCols = GetPagesArray(NumberOfKeys, selectedPerPage, Codes)

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
                            if(onSetFirstIndex) onSetFirstIndex(ci*selectedPerPage);

                            const Ids = KIds.slice(ci*selectedPerPage, (ci + 1)*selectedPerPage)

                            const VM = ({Ids, NumberOfKeys, Codes, KeyIds: KIds, Type:((searchType === NUMERIC_KEY_NAME) ? NUMERIC_KEY : VARIABLE_KEY)})
                            
                            console.log(VM)
                            console.log(KIds)
                            console.log(Ids)

                            searchKeys(VM, true)
                        }}
                    >
                        <p className="pages-single-value">{c.Index + ' ' + c.Character}</p>
                    </Col>
                )}
                </Row>
                <small className="search-result"> {NumberOfKeys} keys</small>
            </div>
        )
    } 

    const searchData = () => {
        const VM = ({
            Code:code||"",

            Page:0,
            QperPage:selectedPerPage,

            ListId: (selectedList || {}).Id,
            GetNumeric: (searchType === NUMERIC_KEY_NAME)
        })

        searchKeys(VM)
        setSelectedPage(1)

        if(onSetFirstIndex) onSetFirstIndex(0);

    }

    const getAllData = () => {
        const VM = ({
            Code:"",

            Page:0,
            QperPage:selectedPerPage,

            ListId: null,
            GetNumeric:  (searchType === NUMERIC_KEY_NAME)
        })

        searchKeys(VM)
        setSelectedPage(1)
        
        if(onSetFirstIndex) onSetFirstIndex(0);
    }


    return(
        <div>
            <div className="keys-search-tool-container">
                <Space> 
                    <div className="keys-search-tool-input-column">
                        <Input  
                            placeholder="Keys's code/LaTeX or parts of it"
                            suffix={<small>Code / LaTeX</small>}

                            value={code}
                            onChange={(v) => setCode(v.target.value)}
                        />
                    </div>

                    <div className="keys-search-tool-input-column">
                        {isLoadingKeyLists ? 
                        
                        <Spin />
                        :
                        <Select
                                className="keys-search-tool-input-column"
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

                    <div >
                        <Select
                                className="keys-search-tool-type-column"
                                onChange={(v, option) => {
                                    setSearchType(v)
                                }}
                                defaultValue={'please select'}
                                value={searchType}

                                options={([NUMERIC_KEY_NAME, VARIABLE_KEY_NAME]).map((d) => ({
                                    value: d,
                                    label: d
                                }))}

                                suffixIcon={<span>Key type</span>}
                        />
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
                            suffixIcon={<span>Keys per page</span>}
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
                            loading={false}
                            onClick={searchData}
                        >
                            Search
                        </Button>

                        <Button 
                            loading={false}
                            onClick={getAllData}
                        >

                            Get all keys
                        </Button>
                    </Space>
                </Space>

                {isLoadingKeys ? 
                <Space>
                    <Spin />
                </Space> : (keys && renderPagesCols())}            
                
            </div>
        </div>
    )
}