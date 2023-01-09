import React, { useState, useEffect } from 'react'
import { CheckApi, fileApi } from '../requests/api'
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams, Link } from 'react-router-dom'
import { Button, Form, Input, InputNumber, message, Upload, Table, Divider, Tag, Space, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Status from '../components/results/Status';
import Plot from '../components/results/Plot';
import Domain from '../components/results/Domain';
import Node from '../components/results/Node';
import { SyncOutlined, } from '@ant-design/icons';


const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};

let timer = null;
export default function Result() {
  //gain url id
  const { id } = useParams()
  //navgate
  const navigate = useNavigate()
  //job status
  const [jobStatus, setJobStatus] = useState(false)
  const [table, setTable] = useState()
  // const [imgs, setImgs] = useState([])
  // const [paths,setPaths] = useState([])
  const [results, setResults] = useState({})
  const [count, setCount] = useState(5)
  const [againGet, setAgainGet] = useState(true);
  //mount check id
  useEffect(() => {
    againGet && check()
  }, [id, againGet])

  //mount check id
  useEffect(()=>{
    let timer = null;
    if(!jobStatus){
      timer = setInterval(()=>{
        check();
      },60000);
    }
    return ()=>{
      clearInterval(timer);
    }
  },[])


  const tag = <Tag icon={<SyncOutlined spin />} color="processing">running</Tag>
  const check = async () => {
    const res = await CheckApi({ JobId: id });
    console.log('submit', res);
    if (res == "NotExist") {
      navigate('/result', { state: { jobIfExist: false, jobid: id } })
    } else {
      console.log('status', res)
      if (res.JobStatus) {
        // console.log('11222',res.file_data[1].file_base64);
        console.log(res.JobStatus);
        console.log(res.paths);
        console.log(res.strucFilePath);
        console.log('res', res)
        // setResults({'probImg':res.file_data[0].file_base64,'domainImg':res.file_data[1].file_base64,'paths':res.paths,'strucFilePath':res.strucFilePath})
        setResults({
          'imgs': res.file_data, 'paths': res.paths, 'strucFilePath': res.strucFilePath, 'domains': res.Domain,
          'sourcenode': res.SourceNode, 'targetnode': res.TargetNode, 'distThreshold': res.DistThreshold, 'example': res.Example
        })
      } else {
        setTable([{ id: 1, jobid: id, time: res.Created_at.split('.')[0].replace('T', ' '), status: tag }])
        message.success("fresh")
      }
      setJobStatus(res.JobStatus)
      setAgainGet(false);
    }
  }
  console.log('results', results);


  return <div>{jobStatus
    ? <Plot results={results} setResults={setResults} setAgainGet={setAgainGet}/>
    : <Status setAgainGet={setAgainGet} table={table} jobid={id} />}</div>
}
