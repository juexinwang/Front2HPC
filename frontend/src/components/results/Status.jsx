import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Tag } from 'antd';
import { SyncOutlined, } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
let timer = null;
export default function Status(props) {
    const {setAgainGet} = props;
    // const [count,setCount] = useState(0)
    // useEffect(()=>{
    //     const timer =setInterval(()=>{console.log(count);},1000*5)
    //     return ()=> clearInterval(timer)
    // },[count])
    const tag = <Tag color="processing">running</Tag>
    const tag2 = <Tag icon={<SyncOutlined spin />} color="processing">
        processing
    </Tag>
    console.log('/result/' + props.jobid)
    const navigate = useNavigate()
    // const data = [
    // {
    //     key: '1',
    //     jobid: 'John Brown',
    //     time: 32,
    //     status: ['running'],
    // },
    // ];
    // const [count, setCount] = useState(5)
    const [word, setWord] = useState('no click')
    // useEffect(() => {
    //     timer = setInterval(() => {
    //         setCount(v => v - 1);
    //         console.log("count", count);
    //     }, 1000)
    //     return () => clearInterval(timer)
    // }, [])

    // useEffect(() => {
    //     if (count === 0) {
    //         setWord('can click to fresh')
    //         clearInterval(timer);
    //     }
    // }, [count])

    const columns = [
        {
            title: 'Job Id',
            dataIndex: 'jobid',
            key: 'jobid',
        },
        {
            title: 'Create Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
        },
    ];
    return (
        <>
            <div style={{ marginBottom: "10px" }}>The job status will fresh every 5 minutes <Button type="primary" onClick={() => setAgainGet(true)}>refresh</Button></div>
            <Table columns={columns} dataSource={props.table} pagination={false} />
        </>
    )
}

