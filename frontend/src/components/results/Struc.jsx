import React,{useState} from 'react';
import { Button, Form, Input, Select, Space, Tooltip, Typography,InputNumber,Upload } from 'antd';
import { setNodeApi } from '../../requests/api';
import { useParams } from 'react-router-dom';
import { UploadOutlined,MinusCircleOutlined,PlusOutlined } from '@ant-design/icons';
//request
const { Option } = Select;

const Struc = (props) => {
  const {id} =useParams()
  const JobId =id
  const [strucFileList, setStrucFileList] = useState([]);

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
    <Form name="complex-form" labelCol={{span: 6,}} wrapperCol={{span: 18,}}>
          <Form.Item name="StrucFile" label="PDB File" extra="optional, upload protein structure pdb file ( include all atoms ) can visualize long-range allosteric interactions in protein " >
            <Upload {...strucProps} fileList={strucFileList}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
    </Form>
  );
};
export default Struc;