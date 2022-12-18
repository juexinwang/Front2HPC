import React from 'react';
import { Button, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const SubmitSuccessfully = (props) => { 
    const navigate = useNavigate()
    const jobid = props.jobid
    const subTitle = "Your Job Id is "+jobid+", if you provide email when you are submitting, we will notify you by email when job finished"
    return (
    <Result
        status="success"
        title="Submit Successfully!"
        subTitle= {subTitle}
        extra={[
        // <Button type="primary" key="console" onClick={()=> {navigate('/result/', {state:{"jobid":jobid}})}}>Check Result</Button>
        <Button type="primary" key="console" onClick={()=> {navigate('/result/'+jobid)}}>Check Result</Button>
        ,
        <Button key="buy" onClick={()=>window.history.go(0)}>Submit Again</Button>,
        ]}
    />
    )
}
export default SubmitSuccessfully
