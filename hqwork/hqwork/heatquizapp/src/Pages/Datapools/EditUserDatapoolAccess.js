import {Button, Drawer, Space, Transfer, message} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useEffect } from "react";
import { useUsers } from "../../contexts/UsersContext";
import { useState } from "react";
import { useDatapools } from "../../contexts/DatapoolsContext";

export function EditUserDatapoolAccess({open, onClose, DP}){

    if(!open) return <div/>;

    const {errorEditDataPoolAccess, isLoadingEditDataPoolAccess, EditDataPoolAccess, getAllDatapoolsAdmin} = useDatapools()
    const [api, contextHolder] = message.useMessage()

    const {users, getUsers} = useUsers()

    const [usersWithAccess, setUsersWithAccess] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

    useEffect(() => {
        if(open){
            const {PoolAccesses} = DP

            getUsers()

            setUsersWithAccess(PoolAccesses.map((a) => a.UserName))
        }
    }, [open])

    useEffect(() => {
        if(errorEditDataPoolAccess)
        {
          api.destroy()
          api.error(errorEditDataPoolAccess)
        }
      }, [errorEditDataPoolAccess])

    const handleChange = (newTargetKeys) => {
        setUsersWithAccess(newTargetKeys);
      };

    const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedUsers([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    return(
        <Drawer
        title={
            <Space
                size={'large'}
            >
                Edit datapool access

                <p>{DP.NickName}</p>

                <Button 
                    type="primary" 
                    size="small"
                    onClick={() => {
                        const VM = ({
                            UpdateDataPoolId: DP.Id,
                            UsersWithAccess: usersWithAccess.map(a => a.trim())
                        })
        
                        EditDataPoolAccess(VM)
                        .then(() => {
                            getAllDatapoolsAdmin()
                        })
                    }}
                    loading = {isLoadingEditDataPoolAccess}
                    >
                        Update
                </Button>
            </Space>
        }
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {contextHolder}
            <Transfer
                dataSource={users.map((a) => ({
                    key: a.Name,
                    title: a.Name,
                }))}
                titles={['All users', 'Users with access']}
                targetKeys={usersWithAccess}
                selectedKeys={selectedUsers}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onScroll={() => {}}
                render={(item) => item.title}
                oneWay
                style={{
                marginBottom: 16,
                }}

                listStyle={{
                    width:'100%',
                    height:'50vh'
                }}
            />            
        </Drawer>
    )
}