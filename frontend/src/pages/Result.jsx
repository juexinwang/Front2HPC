import React, { useState,useEffect } from 'react'
import { CheckApi, fileApi } from '../requests/api'
import { useNavigate } from 'react-router-dom';
import { useLocation,useParams,Link } from 'react-router-dom'
import { Button, Form, Input, InputNumber, message, Upload ,Table, Divider, Tag, Space,Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};

export default function Result() {
  const location =useLocation()
  let jobid;
  if(location.state!==null){
    jobid=location.state.jobid
  }else{
    jobid=''
  }
  const [inputValue, setInputValue] = useState('');
  const [check,setCheck]=useState(true)
  const [jobStatus,setJobStatus]=useState(false)
  const [word,setWord]=useState('')
  const [domainImg,setDomainImg]= useState('')
  const [probImg,setProbImg]= useState('')
  const [paths,setPaths] = useState({})
  const [path,setPath] = useState('')

  
  const onFinish = (values) => {
    console.log('inputValue',inputValue)
    CheckApi({
      JobId:inputValue
    }).then(res=>{
      console.log('submit',res)
      if (res=="NotExist"){
          message.error('Your Job ID not exist!')
      } else if(res.JobStatus==false){
          setCheck(false)
          setWord(`sorry, job ${values.JobId} still running`)
      }else{
          setCheck(false)
          setJobStatus(true)
          setWord(`your job ${values.JobId} has finished`)
          setPaths(res.paths)
          setDomainImg(res.file_data[0].file_base64)
          setProbImg(res.file_data[1].file_base64)
        //setTimeout(()=>{navigate('/plot',{state:{JobId:values.JobId}})},1500)   
      }
    })
  }


  const rowSelection = {
    defaultSelectedRowKeys: [0],
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0].path);
      setPath(selectedRows[0].path.replace(/\>/g,''))
      console.log(path);
    },
    fixed: false,

  };
  const ListPath = () => {
  //   useEffect(()=>{

  // },[pathname])
    return (
      <div>
        <Table
          rowSelection={{
            type: "radio",
            
            ...rowSelection,
            
          }}
          columns={paths.columns}
          dataSource={paths.data}
        />
      </div>
    );
  };

  function MyForm(){
    return <>
    <Form {...layout}  onFinish={onFinish}>

      <Form.Item name="JobId" label="JobId" rules={[{ required: true, },]}>
          <Input defaultValue={jobid} value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
        </Form.Item>

      <Form.Item  wrapperCol={{...layout.wrapperCol, offset: 11,}}>
          <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
    </>
  }

  function Plot(){
      
    return <>
      
      <div>edges_domain image</div>
      <div><img style={{width:'200px',height:'200px'}} src={`data:image/png;base64,${domainImg}`} alt=""/></div>
      <div>probability image</div>
      <div><img style={{width:'200px',height:'200px'}} src={`data:image/png;base64,${probImg}`} alt=""/></div>
      <div style={{width:"50%"}}>{ListPath()}</div>
      <iframe src={`http://localhost:9090/index.php?pdb=1ake.pdb&path=${path}`} width="50%" height="800px" frameBorder = "1" ></iframe>
      
    </>
  }

  function CheckResult(){
    return(
    <>
    <div>{word}</div>
    <div>{jobStatus?Plot():<button onClick={()=>window.history.go(0)}>return</button>}</div>
    </>
    )
  }
 
  return (
    <div>{check?MyForm():CheckResult()}</div>
  )
}