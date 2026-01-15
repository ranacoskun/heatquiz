import React, { useEffect } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { Button, Col, Divider, Dropdown, Row, Skeleton, Space, Table } from "antd";
import { useUsers } from "../../contexts/UsersContext";
import { ErrorComponent } from "../../Components/ErrorComponent";
import { useState } from "react";
import Input from "antd/es/input/Input";
import {PlusOutlined,} from '@ant-design/icons';
import { AddUser } from "./AddUser";

export function UsersList(){

    const {loadingUsers, users, getUserError, getUsers,} = useUsers()

    const [searchCode, setSearchCode] = useState('')

    const [showAddUser, setShowAddUser] = useState(false)

    useEffect(() => {
        getUsers()
    }, [])

    const searchUsersLine = () => {
        return (
            <Input
                placeholder="Search name or email"
                value={searchCode}
                onChange = {(v) => setSearchCode(v.target.value)}
            />
        )
    }

    const userActionsList = (u) => []

    const renderUsers = () => {
        const columns = [
            {
                title: searchUsersLine,
                width: '25%',
                render: (u) => (
                <Dropdown 
                menu={{
                    title:'Actions',
                    items:userActionsList(u)
                }}
                className="hq-full-width">
                    <p className="hoverable default-title hq-full-width">{u.Name}</p>
                </Dropdown>)
            },
            {
                title:'Email',
                dataIndex: 'Email',
                width: '25%',
            },
            {
                title:'Registration date',
                dataIndex: 'RegisteredOn',
                width: '25%',
              
            },
            {
                title:'Roles',
                width: '25%',
                render: (u) => <Row  gutter={4}>{u.Roles.map((a, ai) => <Col key={ai}><p  className="highlighted">{a}</p></Col>)}</Row>
            },
            {
              width: '12.5%',

              render: (u) => u.ProfilePicture ? 
              <img 
                src={u.ProfilePicture}
                alt="user"
                className="user-list-profile-picture"
              /> : <div/>
            },
          ];

        return(
            <Table
                className="hq-full-width"
                columns={columns}
                dataSource={users ? 
                    users.filter((u) => {   
                    if(u.Username === 'admin') return false;

                    if(!searchCode.trim()) return true;
    
                    if(u.Username.includes(searchCode.trim()) || u.Email.includes(searchCode.trim())) return true;
    
                    return false;
    
                }) : []}
                rowKey={(record) => record.username}
                loading={loadingUsers}
                pagination={{position:['topLeft']}}
            />
           
        )
    }

    return(
        <PagesWrapper>
            <Divider orientation="left">
                <Space>
                    <p>Users</p>

                    <Button
                        type={'default'}
                        size="small"
                        onClick={() => setShowAddUser(true)}
                    >
                        <PlusOutlined style={{color:'green'}}/>
                        New user
                    </Button>
                </Space>
            </Divider>

            <br/>

            {loadingUsers && <Skeleton />}

            {getUserError && !loadingUsers && 
                <ErrorComponent 
                    error={getUserError}
                    onReload={() => getUsers()}
                />
            }

            {!(loadingUsers || getUserError) && users && renderUsers()}

            <AddUser 
                open={showAddUser}
                onClose={() => setShowAddUser(false)}

                reloadData = {() => getUsers()}
            />
        </PagesWrapper>
    )
}