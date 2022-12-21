import React,{useState} from 'react';
import { Button, Form, Input, Select, Space, Tooltip, Typography,InputNumber,Upload } from 'antd';
import { setNodeApi } from '../../requests/api';
import { useParams } from 'react-router-dom';
import { UploadOutlined,MinusCircleOutlined,PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
//request
const { Option } = Select;

const Node = (props) => {
  const [form] = Form.useForm()
  const {id} =useParams()
  const JobId =id
  const [strucFileList, setStrucFileList] = useState([]);
  console.log('aaaaaaaaaa',props.results.targetnode);

  useEffect(()=>{
      form.setFieldsValue({
        distThreshold:props.results.distThreshold,
        source:props.results.sourcenode,
        target:props.results.targetnode,
      })
  },[])

  const submitNodes = async (nodes) => {
    const res = await setNodeApi({ Nodes: nodes});
    // props.setPaths(res.paths)
    props.setResults({...props.results,'paths':res.paths})
  }
  const onFinish = (values) => {
    // submitNodes(req)
    const SourceNode = values.source
    const TargetNode = values.target
    const DistThreshold =values.distThreshold
    const req = {SourceNode,TargetNode,DistThreshold,JobId}
    submitNodes(req)
  };

  
  return (
    <Form name="complex-form" onFinish={onFinish} labelCol={{span: 6,}} wrapperCol={{span: 16,}} style={{marginTop:'10px'}} form={form}>
        
      <Form.Item name="distThreshold" label= "Distance Threshold" rules={[{type:"number" }]} style={{marginBottom:"20px"}}>   
          <InputNumber placeholder='12'/>
      </Form.Item>
      
      <Form.Item  style={{marginBottom: 0,marginLeft:'40px'}} >
        <Form.Item name="source" rules={[{required: true, },]} style={{display: 'inline-block',width: 'calc(50% - 4px)',marginBottom:"15px"}} extra="source node">
            <Input placeholder="Input source ndoe" />  
        </Form.Item>
        <Form.Item name="target" rules={[{required: true,}, ]} style={{display: 'inline-block',width: 'calc(50% - 4px)',marginLeft: '8px',marginBottom:"15px"}} extra="target node">
          <Input placeholder="Input target node" />
        </Form.Item>
      </Form.Item>

      <Form.Item  colon={false} style={{marginBottom:'10px',marginLeft:'40px'}}>
        <Button type="primary" htmlType="submit">Submit</Button>  
      </Form.Item>
    </Form>
  );
};
export default Node;