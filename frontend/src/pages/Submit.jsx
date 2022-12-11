//react
import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
//antd
import { Button, Form, Input, InputNumber, Radio, message, Upload ,Slider} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
//request
import { submitJobApi } from '../requests/api'
//component
import SubmitSuccessfully from '../components/SubmitSuccessfully';
//less
import '../assets/lesses/submit.less'

//generate JobId
function randomString(length){
  var str = "";
  var arr = ['A', 'B', 'C', 'D', 'E', 'F',
          'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 
          'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  for(var i=0; i<length; i++){
      let pos = Math.floor(Math.random() * (arr.length));
      str += arr[pos];
  }
  return str;
}
function generateJobId(alpha_length){
  const date = new Date()
  const arr = date.toLocaleDateString().split('/')
  const JobId = arr[0]+arr[1]+randomString(alpha_length)
  return JobId
}

//layout for form
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
//validate for form
const validateMessages = {
  required: '${label} is required!',
  types: {
    Email: '${label} is not a valid email!',
  },
  Epochs: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export default function Submit() {
  //state: submit form or submit finished ?
  const [ifsubmit,setIfSubmit] = useState(true)
  //state for submitting form
  const [advanced,setAdvanced] = useState('none')
  const [form, setForm] = useState({ Name:'1', Epochs:200, JobId:generateJobId(4),Email:'', TrajFilePath:'',StrucFilePath:'',Encoder:'mlp', Decoder:'rnn', Lr:0.0005, BatchSize:1});
  //state for uploading trajectory file
  const [trajFileList, setTrajFileList] = useState([]);
  const [length,setLength] = useState(0)
  const [lengthValid,setLengthValid] = useState(false)
  //state for uploading protein structure file
  const [strucFileList, setStrucFileList] = useState([]);
  //state for tansfer jobid
  //now use form.JobId instead > setJobid(res.JobId)
  
  //upload trajectory file
  const trajHandleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        setForm({ ...form, TrajFilePath: file.response.TrajFilePath })
        setLength(file.response.amount_residues)
        setLengthValid(file.response.length_valid)
        if(file.response.amount_residues>100){
          message.error(`Your protein length is ${file.response.amount_residues}, now we don't support caculate a protein more than 100 amino-acids`)
        }else{
          setLengthValid(true)
        }
      }
      return file;
    });
    setTrajFileList(newFileList);
  };
  const trajProps={action:'/api/uploadtraj/',onChange:trajHandleChange,multiple:true}
  
  //upload structure file
  const strucHandleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        setForm({ ...form, StrucFilePath: file.response.StrucFilePath })
      }
      return file;
    });
    setStrucFileList(newFileList);
  };
  const strucProps={action:'/api/uploadstruc/',onChange:strucHandleChange,multiple:true}

  //submit form
  const onFinish = async () => {
    console.log(form);
    if(lengthValid){
      const res = await submitJobApi(form);
      console.log(res)
      if (res) {
        message.success('Submit Successfully')
        setIfSubmit(false)
        // setJobid(res.JobId)
        //setTimeout(() => { navigate('/wait', { state: { JobId: res.JobId } }) }, 1500)
      } else {
        message.error('Submit failedly')
      }
    }else{
      message.error(`Your protein length is valid, now we don't support caculate a protein more than 100 amino-acids`)
    }
  };

  let submitForm = <>
      <div>
        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>

          <Form.Item name='JobName' label="Name" rules={[{ type: 'string',max: 50, }]} extra="optional, user name we called you" >
            <Input onChange={(e) => setForm({ ...form, JobName: e.target.value })} placeholder='not must'/>
          </Form.Item>

          <Form.Item name='Email' label="Email" rules={[{ type: 'email', }]}  extra="optional, can remind you when the job is completed">
            <Input onChange={(e) => setForm({ ...form, Email: e.target.value })} placeholder='not must'/>
          </Form.Item>

          <Form.Item name="JobFile" label="Trajectory File" rules={[{ required: true, },] } 
          extra="upload protein trajectory pdb file ( only include CA atoms ), protein should be less than 100 residues" >
            <Upload {...trajProps} fileList={trajFileList}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          {/* <span className="ant-form-text" style={{ marginLeft: 8 }}><Link  to='/help'> how to prapare the input file</Link></span> */}

          <Form.Item name="StrucFile" label="Protein Structure File" extra="optional, upload protein structure pdb file ( include all atoms ) can visualize long-range allosteric interactions in protein " >
            <Upload {...strucProps} fileList={strucFileList}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="Epochs" label="Epochs" rules={[{ type: 'number',min: 1, max: 500, }]} style={{display:advanced}}>
            <Slider marks={{0:0,100:100, 200:200, 300:300, 400:400, 500:500,} }  defaultValue={200}  max={500} onChange={(e) => {setForm({ ...form, Epochs: e })}}/>
          </Form.Item>

          <Form.Item name="BatchSize" label="Batch Size" className='formbatchsize' rules={[{ type: 'number',min: 1, max: 50, }]} style={{display:advanced}}>
            <Slider marks={{0:0,10:10, 20:20, 30:30, 40:40, 50:50,} }  max={50} defaultValue={1}  trackStyle={{backgroundColor: 'red',}} 	handleStyle={{backgroundColor:'red'}} onChange={(e) => {setForm({ ...form, BatchSize: e })}}/>
          </Form.Item>

          <Form.Item label="Learning Rate" name="Lr" className='formlr' style={{display:advanced}} rules={[{ type: 'float',min: 0.0001, max: 0.0050, }]}>
            <Slider marks={{0:0, 0.0005:0.0005, 0.0010:0.0010, 0.0015:0.0015, 0.0020:0.0020, 0.0025:0.0025, 0.0030:0.0030, 0.0035:0.0035, 0.0040:0.0040, 0.0045:0.0045, 0.0050:0.0050,} }  
            max={0.0050} defaultValue={0.0005} step={0.0001} trackStyle={{backgroundColor: 'green',}} handleStyle={{backgroundColor:'green'}} 
            onChange={(e) => {setForm({ ...form, Lr: e })}}/>
          </Form.Item>
          {/* <Form.Item  label="Learning Rate" name="Lr" style={{display:advanced}} rules={[{ type: 'float',min: 0.0001, max: 0.0100, }]}>
            <InputNumber min={0.0001} max={0.0100}  onChange={(e) => {console.log(e);setForm({ ...form, Lr: e })}} defaultValue={0.0005} step={0.0001}/>
          </Form.Item> */}

          <Form.Item name="Encoder" label="Encoder" style={{display:advanced}}>
            <Radio.Group onChange={(e) => setForm({ ...form, Eecoder: e.target.value })} defaultValue='mlp'>
              <Radio value="mlp" >MLP</Radio>
              <Radio value="cnn">CNN</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="Decoder" label="Decoder" style={{display:advanced}}>
            <Radio.Group onChange={(e) => setForm({ ...form, Decoder: e.target.value })} defaultValue='rnn'>
              <Radio value="rnn" defaultChecked>RNN</Radio>
              <Radio value="mlp">MLP</Radio>
            </Radio.Group>
          </Form.Item>

          <div style={{width:"67%",display: "flex",justifyContent: "flex-end",height:"40px",transition: '.3s',}} >
            <Button onClick={() => {
              advanced === "none" ? setAdvanced("block") : setAdvanced("none")
            }} >{advanced === "none" ?'Advanced':'Fold'}</Button>
          </div>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 11, }}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>

        </Form>
    </div>
  </>

  return (
    <div>{ifsubmit?submitForm:<SubmitSuccessfully jobid={form.JobId}/>}</div> 
  )
}


