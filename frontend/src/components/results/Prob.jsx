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

  const validateMessages = {
    required: '${label} is required!',
    types: {
      number: '${label} is not a valid number!',
    },
    VisualThreshold: {
      range: 'between ${min} and ${max}',
    },
  
  };
  return (
    <>
    
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" validateMessages={validateMessages}>
    <Form.Item name="" style={{marginBottom:"0",height:"35px"}}>   
      <Form.Item name="VisualThreshold" label= "Visualization Threshold"  rules={[{type:"number",required:true,min:0,max:1 }]}  style={{ display: 'inline-block',  width: '80%',}}>   
        <InputNumber placeholder='0.6'/>
      </Form.Item>
      <Form.Item style={{ display: 'inline-block',  width: '20%'}}>
        <Button type="primary" htmlType="submit" >Change </Button>
      </Form.Item>
    </Form.Item>
    </Form>
    </>
  );
};
export default Prob;