import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space,InputNumber } from 'antd';
import { setVisualApi} from '../../requests/api'
import { useParams } from 'react-router-dom';
const Prob = (props) => {
  const {id} = useParams()

  const submitVisual = async (args) => {
    const res = await setVisualApi({ Domains: args});
    props.setResults({...props.results,'imgs':{...props.results.imgs,"probs":res.file_data.probs}})
  }
  const onFinish = (values) => {
    const visualThreshold = values.VisualThreshold
    const JobId = id
    const domains = ","
    const req={domains,visualThreshold,JobId}
    submitVisual(req)
  };
  return (
    <>
    
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" >
    <Form.Item name="Start" style={{marginBottom:"0",height:"35px"}}>   
      <Form.Item name="VisualThreshold" label= "Visual Threshold"  rules={[{type:"number",required:true }]}  style={{ display: 'inline-block',  width: '70%',}}>   
          <InputNumber  min={0.01} max={1} placeholder='0.6' width="500px"/>
      </Form.Item>
      <Form.Item style={{ display: 'inline-block',  width: '30%',marginBottom:"0"}}>
        <Button type="primary" htmlType="submit" >Submit </Button>
      </Form.Item>
      </Form.Item>
    </Form>
    </>
  );
};
export default Prob;