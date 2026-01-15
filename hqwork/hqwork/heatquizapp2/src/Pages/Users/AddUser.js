import { Button, Drawer, Form, Input, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { handleResponse } from "../../services/Auxillary";
import { useUsers } from "../../contexts/UsersContext";
import { MIN_USER_PASSWORD } from "./Constants";

export function AddUser({open, onClose, reloadData}){
    const [messageApi, contextHolder] = message.useMessage();

    const {loadingAddNewUser, addNewUser} = useUsers()

    const [newUsername, setNewUsername] = useState('')
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newRepeatedPassword, setNewRepeatedPassword] = useState('')

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Add user"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
            >
                <Form>
                    <Form.Item>
                        <small className="default-gray">Username</small>
                        <Input 
                        value={newUsername}
                        onChange={(v) => setNewUsername(v.target.value)}
                         
                        />
            
                    </Form.Item>
                    <Form.Item>
                        <small className="default-gray">Name</small>
                        <Input 
                        value={newName}
                        onChange={(v) => setNewName(v.target.value)}
                         
                        />
            
                    </Form.Item>
                    <Form.Item>
                        <small className="default-gray">Email</small>
                        <Input 
                        value={newEmail}
                        onChange={(v) => setNewEmail(v.target.value)}
                         
                        />
            
                    </Form.Item>

                    <Form.Item>
                        <small className="default-gray">Password</small>
                        <Input 
                            value={newPassword}
                            onChange={(v) => setNewPassword(v.target.value)}
                            type="password"
                        />
            
                    </Form.Item>
                    <Form.Item>
                        <small className="default-gray">Repeat password</small>
                        <Input 
                            placeholder="Name - unique"
                            value={newRepeatedPassword}
                            onChange={(v) => setNewRepeatedPassword(v.target.value)}
                            type="password"
                        />
            
                    </Form.Item>
                </Form>
                <Button 
                    type="primary"
                    size="small"
                    onClick={() => {
                        if(!newUsername.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add username')
                            return
                        }

                        if(!newName.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add name')
                            return
                        }

                        if(!newEmail.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add email')
                            return
                        }

                        if(!newPassword.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add password')
                            return
                        }

                        if(newPassword.length < MIN_USER_PASSWORD){
                            messageApi.destroy()
                            messageApi.warning('Please password must be atleast 6 charachters')
                            return
                        }

                        if(newPassword !== newRepeatedPassword){
                            messageApi.destroy()
                            messageApi.warning('Please password must be identical')
                            return
                        }

                        const VM =({
                            Username: newUsername,
                            Name: newName,
                            Email: newEmail,
                            Password: newPassword,
                            ConfirmPassword: newRepeatedPassword,
                            Roles: ['course_editor', 'content_editor']
                        })

                        addNewUser(VM).then(r => handleResponse(r, messageApi, 'Added successfully', 1, () => {
                            reloadData()
                            onClose()
                        }))
                        
                    }}
                    loading = {loadingAddNewUser}
                >
                Add
                </Button>
            </Drawer>
        </div>
    )
}