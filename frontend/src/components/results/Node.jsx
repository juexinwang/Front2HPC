import React from 'react';
import { Button, Form, Input, Select, Space, Tooltip, Typography,InputNumber } from 'antd';
import { setNodeApi } from '../../requests/api';
const { Option } = Select;

const Node = () => {
  const submitNodes = async (nodes) => {
    const res = await setNodeApi({ Nodes: nodes});
    console.log(res)
    // if () {
      
    // } else {
    // }
  }
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // submitNodes(req)
    const SourceNode = values.source
    const TargetNode = values.target
    const DistThreshold =values.distThreshold
    const req = {SourceNode,TargetNode,DistThreshold}
    submitNodes(req)
  };
  return (
    <Form name="complex-form" onFinish={onFinish} labelCol={{span: 8,}} wrapperCol={{span: 16,}}>
        
      <Form.Item name="distThreshold" label= "Distance Threshold" rules={[{type:"number" }]} >   
          <InputNumber placeholder='Distance Threshold'/>
      </Form.Item>
      
      <Form.Item label="path" style={{marginBottom: 0,}}>
        <Form.Item name="source" rules={[{required: true, },]} style={{display: 'inline-block',width: 'calc(50% - 4px)',}} extra="source node">
            <Input placeholder="Input source ndoe" />  
        </Form.Item>
        <Form.Item name="target" rules={[{required: true,}, ]} style={{display: 'inline-block',width: 'calc(50% - 4px)',marginLeft: '8px',}} extra="target node">
          <Input placeholder="Input target node" />
        </Form.Item>
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Node;