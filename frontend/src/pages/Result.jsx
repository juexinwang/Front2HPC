import React, { useState,useEffect } from 'react'
import { CheckApi, fileApi } from '../requests/api'
import { useNavigate } from 'react-router-dom';
import { useLocation,useParams,Link } from 'react-router-dom'
import { Button, Form, Input, InputNumber, message, Upload ,Table, Divider, Tag, Space,Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Status from '../components/results/Status';
import Plot from '../components/results/Plot';
import Domain from '../components/results/Domain';
import Node from '../components/results/Node';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};

export default function Result() {
//gain url id
  const { id } = useParams()
//navgate
  const navigate = useNavigate()
//job status
  const [jobStatus, setJobStatus] = useState(false)
  const [table,setTable] = useState()
  const [domainImg, setDomainImg] = useState('')
  const [probImg, setProbImg] = useState('')
  const [paths,setPaths] = useState({})
  
//mount check id
  useEffect(() => {
    check(id)
  }, [id])

//check Status
  useEffect(()=>{
    let timer = null;
    if(!jobStatus){
      timer = setInterval(()=>{
        check();
      },15000);
    }
    return ()=>{
      clearInterval(timer);
    }
  },[jobStatus])


  const check = async () => {
    const res = await CheckApi({ JobId: id});
    console.log('submit', res);
    if (res == "NotExist") {
      navigate('/result',{state:{jobIfExist:false,jobid:id}})
    } else {
      setJobStatus(res.JobStatus)
      if(res.JobStatus){
        setDomainImg(res.file_data[0].file_base64)
        setProbImg(res.file_data[1].file_base64)
        setPaths(res.paths)
      }else{
        setTable([{jobid:id,time:res.Created_at,status:'running'}])
        message.success("fresh")
      }
    }
  }


  return <div>{jobStatus?<Plot domainImg={domainImg} probImg={probImg} paths={paths}/>:<Status table={table}/>}</div>
}


//   const [inputValue, setInputValue] = useState('');
//   const [check,setCheck]=useState(true)
//   const [jobStatus,setJobStatus]=useState(false)
//   const [word,setWord]=useState('')
//   const [domainImg,setDomainImg]= useState('')
//   const [probImg,setProbImg]= useState('')
//   const [paths,setPaths] = useState({})
//   const [path,setPath] = useState('')

  
//   const onFinish = (values) => {
//     console.log('inputValue',inputValue)
//     CheckApi({
//       JobId:inputValue
//     }).then(res=>{
//       console.log('submit',res)
//       if (res=="NotExist"){
//           message.error('Your Job ID not exist!')
//       } else if(res.JobStatus==false){
//           setCheck(false)
//           setWord(`sorry, job ${values.JobId} still running`)
//       }else{
//           setCheck(false)
//           setJobStatus(true)
//           setWord(`your job ${values.JobId} has finished`)
//           setPaths(res.paths)
//           setDomainImg(res.file_data[0].file_base64)
//           setProbImg(res.file_data[1].file_base64)
//         //setTimeout(()=>{navigate('/plot',{state:{JobId:values.JobId}})},1500)   
//       }
//     })
//   }


  // const rowSelection = {
  //   defaultSelectedRowKeys: [0],
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0].path);
  //     setPath(selectedRows[0].path.replace(/\>/g,''))
  //     console.log(path);
  //   },
  //   fixed: false,

  // };
  // const ListPath = () => {
  // //   useEffect(()=>{

  // // },[pathname])
  //   return (
  //     <div>
  //       <Table
  //         rowSelection={{
  //           type: "radio",
            
  //           ...rowSelection,
            
  //         }}
  //         columns={paths.columns}
  //         dataSource={paths.data}
  //       />
  //     </div>
  //   );
  // };

//   function MyForm(){
//     return <>
//     <Form {...layout}  onFinish={onFinish}>

//       <Form.Item name="JobId" label="JobId" rules={[{ required: true, },]}>
//           <Input defaultValue={jobid} value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
//         </Form.Item>

//       <Form.Item  wrapperCol={{...layout.wrapperCol, offset: 11,}}>
//           <Button type="primary" htmlType="submit">Submit</Button>
//       </Form.Item>
//     </Form>
//     </>
//   }


//   function CheckResult(){
//     return(
//     <>
//     <div>{word}</div>
//     <div>{jobStatus?Plot():<button onClick={()=>window.history.go(0)}>return</button>}</div>
//     </>
//     )
//   }
 
//   return (
//     <div>{check?MyForm():CheckResult()}</div>
//   )
// }