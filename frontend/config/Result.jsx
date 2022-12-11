import React, { useState,useEffect } from 'react'
import { CheckApi, fileApi } from '../request/api'
import { useNavigate } from 'react-router-dom';
import { useLocation,useParams,Link } from 'react-router-dom'
import { Button, Form, Input, InputNumber, message, Upload } from 'antd';
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
  const [inputValue, setInputValue] = useState('');
  const [check,setCheck]=useState(true)
  const [jobStatus,setJobStatus]=useState(false)
  const [word,setWord]=useState('')
  const [domainImg,setDomainImg]= useState('')
  const [probImg,setProbImg]= useState('')
  const [paths,setPaths] = useState([])
  const [paths1,setPaths1] = useState('')
  const onFinish = (values) => {
    console.log('inputValue',inputValue)
    CheckApi({
      JobId:inputValue
    }).then(res=>{
      console.log('submit',res)
      if (res=="NotExist"){
          message.error('Your Job ID not exist!')
      } else if(res.PredictStatu==false){
          setCheck(false)
          setWord(`sorry, job ${values.JobId} still running`)
      }else{
          setCheck(false)
          setJobStatus(true)
          setWord(`your job ${values.JobId} has finished`)
          console.log("------")
          setPaths(res.path['61']["shortest_path "])
          // console.log(res.path['61'])
          console.log(res.path['61']["shortest_path "][0]);
          let p=res.path['61']["shortest_path "][0]+'-'+res.path['61']["shortest_path "][1]
          console.log(p)
          setPaths1(p)
          console.log('hhhhhhhhhhhhhhhh');
          console.log(paths1)
          setDomainImg(res.file_data[0].file_base64)
          setProbImg(res.file_data[1].file_base64)
        //setTimeout(()=>{navigate('/plot',{state:{JobId:values.JobId}})},1500)   
      }
    })
  }

  function MyForm(){
    return <>
    <Form {...layout}  onFinish={onFinish}>

      <Form.Item name="JobId" label="JobId" rules={[{ required: true, },]}>
          <Input value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
        </Form.Item>

      <Form.Item  wrapperCol={{...layout.wrapperCol, offset: 11,}}>
          <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
    </>
}
  function Plot(){
      // const cfg = {
      //   divid: 'viewer',
      //   mobilemenu: false
      // };
      // cfg['mmdbid'] = '1tup';
      // const icn3dui = new icn3d.iCn3DUI(cfg);
      // icn3dui.show3DStructure();
      // //<div id="viewer"></div>
    return <>
      <div>edges_domain image</div>
      <div><img style={{width:'200px',height:'200px'}} src={`data:image/png;base64,${domainImg}`} alt=""/></div>
      <div>probability image</div>
      <div><img style={{width:'200px',height:'200px'}} src={`data:image/png;base64,${probImg}`} alt=""/></div>
      <iframe src={`http://localhost:9090/index.php?pdb=3tdb.pdb&path=${paths1}`} width="1200" height="800px" frameBorder = "0" ></iframe>
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

/*
../
<img className="img" src={require('./img/RDS.png')} alt=""/> // 相对路径
<img className="img" src={require("../../../backend/a.png"+{imgpath})} alt=""/>
import icon from "./img/RDS.png";
<img src={icon} alt="" width="35" height="35" />
*/