import React, { useEffect, useState } from "react";
import { useKeyboard } from "../../contexts/KeyboardContext";
import { Col, Row, Skeleton } from "antd";
import { NUMERIC_KEY, VARIABLE_KEY } from "./constants";
import { LatexRenderer } from "../LatexRenderer";

import './Keyboard.css'
import { ErrorComponent } from "../ErrorComponent";

export function Keyboard({Id, enableDivision, isEnergyBalance, List, onEnterKey}){
    const { isLoadingKeyboard, errorGetKeyboard, Keyboard, getKeyboard} = useKeyboard()

    const [variableKeyElements, setVariableKeyElements] = useState([])

    useEffect(() => {
        getKeyboard(Id)
        setVariableKeyElements([])
    }, [Id])

    const handleNumericVariable = (k) => {
        let list = ({...List})

        //Check last key status
        let Last = list.List.slice(-1)[0]

        //AddDot If last key and new keys are not operands 
        if(Last && Last.IsKey && !(Last.IsInteger && k.NumericKey.IsInteger)){
            list = addDot(list)
        }

        list.List.push({
            NumericKeyId:k.NumericKey.Id,

            code:k.NumericKey.TextPresentation,
            char: k.NumericKey.IsInteger ? k.NumericKey.TextPresentation : k.KeySimpleForm,

            IsKey: true,
            IsInteger: k.NumericKey.IsInteger,

            Left: list.Left,
            Right: list.Right,
            RightBracket: list.RightBracket,
            LeftBracket: list.LeftBracket,
        })

        list.Right = true
        list.Left = false
        list.RightBracket = false
        list.LeftBracket = true

        return list
    }

    const handleVariableVariable = (k) => {
        let list = ({...List})
        
        //Check last key status
        let Last = list.List.slice(-1)[0]

        //AddDot If last key and new keys are not operands 
        if(Last && Last.IsKey){
            list = addDot(list)
        }

        const selectedImage = Keyboard.VariableKeyImages.filter((im) => im.ImageId === k.Id)[0]

        list.List.push({
            ImageId:k.Id,
            code: selectedImage.Image.TextPresentation,
            char: selectedImage.ReplacementCharacter,

            IsKey: true,
            IsInteger: false,

            Left: list.Left,
            Right: list.Right,
            RightBracket: list.RightBracket,
            LeftBracket: list.LeftBracket,
        })

        list.Right = true
        list.Left = false
        list.RightBracket = false
        list.LeftBracket = true

        return list
    }

    const addDot = (list) => {
        let _list = ({...list})

        _list.List.push({
            code:'*',
            char:'*',
            Left: _list.Left,
            Right: _list.Right,
            RightBracket: _list.RightBracket,
            LeftBracket: _list.LeftBracket,
        })

        _list.Left = true
        _list.Right = false
        _list.RightBracket = true
        _list.LeftBracket = false
        _list.IsInteger = false

        return _list
    }

    const addDot2 = () => {
        let list = ({...List})

        if(list.Left) return list;

        if(!list.List.length) return list;

        list.List.push({            
            code:'*',
            char:'*',

            Left: list.Left,
            Right: list.Right,
            RightBracket: list.RightBracket,
            LeftBracket: list.LeftBracket,
        })

        list.Left = true
        list.Right = false
        list.RightBracket = true
        list.LeftBracket = false
        list.IsInteger = false

        return list
    }

    const addPlus = () => {
        let list = ({...List})

        if(list.Left) return list;
        
        if(!list.List.length) return list;

        list.List.push({
            code:'+',
            char:'+',
            Left: list.Left,
            Right: list.Right,
            RightBracket: list.RightBracket,
            LeftBracket: list.LeftBracket,
        })

        list.Right = false
        list.Left = true
        list.RightBracket = true
        list.LeftBracket = false
        list.IsInteger = false

        return list
    }

    const addMinus = () => {
        let list = ({...List})

        if(list.Left)
        {
            if(list.List.length && list.List.slice(-1)[0].char !== '=' && list.List.slice(-1)[0].char === '-') return list;
        }

        list.List.push({
            code:'-',
            char:'-',

            Left: list.Left,
            Right: list.Right,
            RightBracket: list.RightBracket,
            LeftBracket: list.LeftBracket,
        })

        list.Left = true
        list.Right = false
        list.RightBracket = true
        list.LeftBracket = false
        list.IsInteger = false

        return list                                        
    }

    const addDevide = () => {
        let list = ({...List})

        if(list.Left) return list;
       
        if(!list.List.length)return list;
            
        list.List.push({
            code:'/',
            char:'/',

            Left: list.Left,
            Right: list.Right,
            RightBracket: list.RightBracket,
            LeftBracket: list.LeftBracket,
        })

        list.Left = true
        list.Right = false
        list.RightBracket = true
        list.LeftBracket = false
        list.IsInteger = false

        return list                                                             
    }

    const addEqual = () => {
        let list = ({...List})

        if(list.Left || !list.List.length) return list;

        list.List.push({
            IsLatex:false,
            code:'=',
            char:'=',
            Left: list.Left,
            Right: list.Right,
            RightBracket: list.RightBracket,
            LeftBracket:list.LeftBracket,
        })

       
        list.Left = true
        list.Right = false
        list.IsInteger = false

        return list
                       
    }

    const addBracket_right = () => {
        let list = ({...List})

        if(!list.RightBracket && list.List.length && list.List.slice(-1)[0].code !== '(') return  list;

        list.List.push({
            code:'(',
            char:'(',

            Left: list.Left,
            Right: list.Right,
            RightBracket:  list.RightBracket,
            LeftBracket:  list.LeftBracket,
        })

        list.echoNumber =
        list.echoNumber + 1
        
        list.Left = true
        list.Right = false
        list.IsInteger = false

        return list                                      
                       
    }

    const addBracket_left = () => {
        let list = ({...List})

        if(!list.LeftBracket  && list.List.length) return list;

        if(list.echoNumber === 0) return list;                            

        list.List.push({
            code:')',
            char:')',

            Left: list.Left,
            Right: list.Right,
            RightBracket: list.RightBracket,
            LeftBracket:list.LeftBracket,                            
        })

        list.echoNumber =
        list.echoNumber - 1
        
        list.Left = false
        list.Right = true
        list.IsInteger = false

        return list                                        
                       
    }

    const removeOperand = (k) => {
        let list = ({...List})

        if(!list.List.length) return list;

        let Last = list.List.slice(-1)[0]

        list.Left = Last.Left
        list.LeftBracket = Last.LeftBracket
        list.Right = Last.Right
        list.RightBracket = Last.RightBracket
        list.IsInteger = Last.IsInteger

        let echoNumber = list.echoNumber

        if(Last.char === ')'){
            echoNumber = echoNumber + 1
        }

        if(Last.char === '('){
            echoNumber = echoNumber - 1
        }

        list.echoNumber = echoNumber

        list.List.pop()

        return list                                                  
                       
    }

    const OPERANDS = [{
        text:'+',
        action:() => {
            const updatedList = addPlus()

            onEnterKey(updatedList)
        }
        },
        {
            text:'-',
            action:() => {
                const updatedList = addMinus()

                onEnterKey(updatedList)
            }
        },{
            text:'*',
            action:() => {
                const updatedList = addDot2()

                onEnterKey(updatedList)
            }
        },
        enableDivision 
        &&{
            text:'/',
            action:() => {
                const updatedList = addDevide()

                onEnterKey(updatedList)
            }
        },
        isEnergyBalance 
        &&{
            text:'=',
            action:() => {
                const updatedList = addEqual()

                onEnterKey(updatedList)
            }
        },{
            text:'(',
            action:() => {
                const updatedList = addBracket_right()

                onEnterKey(updatedList)
            }
        },{
            text:')',
            action:() => {
                const updatedList = addBracket_left()

                onEnterKey(updatedList)
            }
        }].filter(a => a)


    const renderKeyboard = () => {
        const {NumericKeys, VariableKeys} = Keyboard

        const keys = 
        [...NumericKeys.map((k) => ({...k, Type:NUMERIC_KEY}))
        ,
        ...VariableKeys.map((k) => ({...k, Type:VARIABLE_KEY}))]
        .sort((a, b) => (a.Order >= b.Order) ? 1 : -1)


        return(
            <div>
                <Row>
                    {keys.map((k, ki) => {

                        const latexFormula = (k.NumericKey || k.VariableKey).TextPresentation

                        return(
                            <Col
                                key={ki}
                                className="keyboard-key-item"
                                onClick={() => {
                                    if(k.Type === VARIABLE_KEY){
                                        setVariableKeyElements(k.VariableKey.VImages)
                                    }
                                    else{
                                        setVariableKeyElements([])
                                        const updatedList = handleNumericVariable(k)
                                        onEnterKey(updatedList)
                                    }
                                }}
                            >
                                <div
                                    className="keyboard-key-item-inner"
                                >
                                    <LatexRenderer 
                                        latex={"$$" + latexFormula + "$$"} 
                                    />
                                </div>
                            </Col>
                        )
                    })}                
                </Row>

                {variableKeyElements.length ? <br/> : <div/>}

                <Row>
                    {variableKeyElements.map((k, ki) => {

                        const latexFormula = k.TextPresentation

                        return(
                            <Col
                                key={ki}
                                className="keyboard-key-item keyboard-key-item-variable"
                                onClick={() => {
                                    setVariableKeyElements([])

                                    const updatedList = handleVariableVariable(k)

                                    onEnterKey(updatedList)
                                }}
                            >
                                <div
                                    className="keyboard-key-item-inner"
                                >
                                    <LatexRenderer 
                                        latex={"$$" + latexFormula + "$$"} 
                                    />
                                </div>
                            </Col>
                        )
                    })}
                </Row>

                <br/>

                <Row>
                    {OPERANDS.map((o, oi) => {
                        return(
                            <Col 
                            key={oi}
                            className="keyboard-key-item keyboard-key-item-operand"
                            onClick={() => o.action()}
                        >
                            <div
                                className="keyboard-key-item-inner"
                            >
                                <LatexRenderer 
                                    latex={"$$" + o.text + "$$"} 
                                />
                            </div>
                        </Col>
                        )
                    })}

                    <Col 
                            className="keyboard-key-item keyboard-key-item-operand-remove"
                            onClick={() => {
                                const updatedList = removeOperand()

                                onEnterKey(updatedList)
                            }}
                        >
                            <div
                                className="keyboard-key-item-inner"
                            >
                                <LatexRenderer 
                                    latex={"$$ ⇐ $$"} 
                                />
                            </div>
                        </Col>
                </Row>
            </div>
        )
            
    }

    return(
        <div>
            {isLoadingKeyboard && <Skeleton />}
            {!isLoadingKeyboard && Keyboard && renderKeyboard()}

            {errorGetKeyboard && !isLoadingKeyboard && 
                <ErrorComponent 
                    error={errorGetKeyboard}
                    onReload={() => {
                        getKeyboard(Id)
                        setVariableKeyElements([])
                    }}
                />
            }
        </div>
    )
}