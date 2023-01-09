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
    <Form name="complex-form" onFinish={onFinish} wrapperCol={{offset:0,span: 24,}} style={{marginTop:'10px'}} form={form}>

      <div style={{marginLeft:20,marginTop:5,display:"inline-block"}}>Distance Threshold: &nbsp; </div>
        
      <Form.Item name="distThreshold"  rules={[{type:"number" }]} style={{marginBottom:"10px",display:"inline-block"}}>   
          <InputNumber placeholder='12'/>
      </Form.Item>
      
      <Form.Item  style={{marginBottom: 0,marginLeft:'20px'}} >
        <Form.Item name="source" rules={[{required: true, },]} style={{display: 'inline-block',width: '35%',marginBottom:"15px"}} extra="source residue">
            <Input placeholder="Input source ndoe" />  
        </Form.Item>
        <Form.Item name="target" rules={[{required: true,}, ]} style={{display: 'inline-block',width: '35%',marginLeft: '5%',marginBottom:"15px"}} extra="target residue">
          <Input placeholder="Input target node" />
        </Form.Item>
        <Form.Item  colon={false} style={{marginBottom:'10px',display:'inline-block', width: '20%',marginLeft:"5%"}}>
          <Button type="primary" htmlType="submit">Change</Button>  
        </Form.Item>
      </Form.Item>
    </Form>
  );
};
export default Node;