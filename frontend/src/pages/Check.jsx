import React, { useState,useEffect } from 'react'
import { CheckApi, fileApi } from '../requests/api'
import { useNavigate } from 'react-router-dom';
import { useLocation,useParams,Link } from 'react-router-dom'
import { Button, Form, Input, InputNumber, message, Upload ,Table, Divider, Tag, Space,Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function Check() {
//form 
  const [form] = Form.useForm()
//Result transfer state here
//SubmitSuccessfully tansfer state here
  const location =useLocation()
  const [jobid,setJobid] = useState('')
  console.log(location.state);
  if(location.state !== null){
    if(location.state.jobIfExist == false) {
        message.error(`your job (${location.state.jobid} ) not exist`)
    }
  }

//navgate
  const navigate = useNavigate()
//useParams()
//   useEffect(()=>{
//     setJobid(id) 
//     form.setFieldsValue({JobId:id})
//   },[id])
  

  const onFinish = (values) => {
        // console.log(values.JobId)
        navigate('/result/'+values.JobId,{state:{"jobid":values.JobId}})
  }

  function CheckForm(){
    const layout = {labelCol: { span: 8, }, wrapperCol: { span: 8,}, };
    return <>
    <Form {...layout}  onFinish={onFinish} form={form}>

      <Form.Item name="JobId" label="Job Id" rules={[{ required: true, },]}>
          <Input /> 
      </Form.Item>

      <Form.Item  wrapperCol={{...layout.wrapperCol, offset: 11,}}>
          <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
    </>
  }
 
  return (
    <div>{CheckForm()}</div>
  )
}

