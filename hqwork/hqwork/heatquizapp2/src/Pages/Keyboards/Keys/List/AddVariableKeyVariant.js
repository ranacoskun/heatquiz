import { Button, Drawer, Form, Input, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useKeyboard } from "../../../../contexts/KeyboardContext";
import { handleResponse } from "../../../../services/Auxillary";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

export function AddVariableKeyVariant({open, onClose, variableKey}){

    if(!open) return <div/>;

    const [messageApi, contextHolder] = message.useMessage();

    const { isLoadingAddKeyVariant, addKeyVariant,} = useKeyboard()

    const [newLatex, setNewLatex] = useState('\\Alpha_{new-variant}')

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Add variant"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
            >
                <Form>
                    <Form.Item>
                        <small className="default-gray">LaTeX</small>
                        <Input 
                        placeholder="New LaTex"
                        value={newLatex}
                        onChange={(v) => setNewLatex(v.target.value)}
                         
                        />
            
                    </Form.Item>
                </Form>

                <LatexRenderer 
                    latex={"$$" + newLatex + "$$"}
                    className="hq-element-container"
                />
                <Button 
                    type="primary" 
                    onClick={() => {
                        if(!newLatex.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add LaTeX')
                            return
                        }

                        const VM = ({
                            KeyId: variableKey.Id,
                            TextPresentation: newLatex
                        })

                        addKeyVariant(VM).then((r) => 
                        handleResponse(r, messageApi, 'Added successfully', 1, () => {
                            onClose()
                            window.location.reload()
                        }))

                        
                    }}
                    loading = {isLoadingAddKeyVariant}
                >
                Add
                </Button>
            </Drawer>
        </div>
    )
}