import React,{useState} from 'react';
import { Button, Form, Input, Select, Space, Tooltip, Typography,InputNumber,Upload } from 'antd';
import { setNodeApi } from '../../requests/api';
import { useParams } from 'react-router-dom';
import { UploadOutlined,MinusCircleOutlined,PlusOutlined } from '@ant-design/icons';
//request
const { Option } = Select;

const Node = (props) => {
  const {id} =useParams()
  const JobId =id
  const [strucFileList, setStrucFileList] = useState([]);
  const submitNodes = async (nodes) => {
    const res = await setNodeApi({ Nodes: nodes});
    console.log(res)
    // props.setPaths(res.paths)
    props.setResults({...props.results,'paths':res.paths})
  }
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // submitNodes(req)
    const SourceNode = values.source
    const TargetNode = values.target
    const DistThreshold =values.distThreshold
    const req = {SourceNode,TargetNode,DistThreshold,JobId}
    submitNodes(req)
  };

  const strucHandleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        console.log(file.response.StrucFilePath)
        
        props.setResults({...props.results,'strucFilePath':file.response.StrucFilePath})
      }
      return file;
    });
    setStrucFileList(newFileList);
  };
  const strucProps={action:'/api/uploadstruc/',onChange:strucHandleChange,multiple:true}
  
  return (
    <Form name="complex-form" onFinish={onFinish} labelCol={{span: 6,}} wrapperCol={{span: 18,}}>
          <Form.Item name="StrucFile" label="Protein Structure File" extra="optional, upload protein structure pdb file ( include all atoms ) can visualize long-range allosteric interactions in protein " >
            <Upload {...strucProps} fileList={strucFileList}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

        
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