//react
import React, { useState,useEffect } from 'react'
import { useNavigate,Link, } from 'react-router-dom';
//antd
import { Button, Form, Input, InputNumber, Radio, message, Upload ,Slider,Space} from 'antd';
import { UploadOutlined,MinusCircleOutlined,PlusOutlined } from '@ant-design/icons';
//request
import { submitJobApi,submitExampleApi } from '../requests/api'
//component
import SubmitSuccessfully from '../components/SubmitSuccessfully';
import ExampleDrawer from '../components/tutorials/ExampleDrawer';
//less
import '../assets/lesses/submit.less'
import { useRef } from 'react';


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
  //form
  const navigate = useNavigate()

  const [form, setForm] = useState({ 
    Name:'user',  Email:'', 
    TrajFilePath:'',NumResidues: 0, NumFrames: 0, 
    Start: 0, End: 0, TimestepSize: 0, TrainInterval:0, ValidateInterval:0, TestInterval:0,
    Epochs:0,Lr:0.0, LrDecay:0, Gamma:0.0, Var:0.0, Seed:0,
    Encoder:'mlp', Decoder:'rnn', EncoderHidden:0, DecoderHidden:0, EncoderDropout:0, DecoderDropout:0,
    StrucFilePath:'', 
    SourceNode:0, TargetNode:0, VisualThreshold: 0, DistThreshold:0, 
    Domain: ',',
    }); 
  console.log(form);
  //state for uploading trajectory file
  const [trajFileList, setTrajFileList] = useState([]);
  const [length,setLength] = useState(0)
  const [lengthValid,setLengthValid] = useState(false)
  //state for uploading protein structure file
  const [strucFileList, setStrucFileList] = useState([]);
  //state for tansfer jobid
  const [jobid,setJobid] = useState('')
  //now use form.JobId instead > setJobid(res.JobId)
  
  //
  const [exampleSha1,setExampleSha1] = useState(false)




  const [formform] = Form.useForm()

    useEffect(()=>{
      if(exampleSha1){
        console.log("example")
        formform.setFieldsValue({
                                  Start: 1, End: 96, TimestepSize: 45, TrainInterval:100, ValidateInterval:120, TestInterval:150,
                                  Epochs:500, Lr:0.0005, LrDecay:200, Gamma:0.5, Var:0.00005, Seed:42,
                                  Encoder:'mlp', Decoder:'rnn', EncoderHidden:256, DecoderHidden:256, EncoderDropout:0.0, DecoderDropout:0.0,
                                  SourceNode:46, TargetNode:61, DistThreshold:12, VisualThreshold: 0.5,
                                  domain_arr:[{domain:"b1",start:1,end:26},
                                  {domain:"diml",start:26,end:30}  ,
                                  {domain:"disl",start:30,end:33}  ,
                                  {domain:"zl",start:33,end:44}  ,
                                  {domain:"b2",start:44,end:63}  ,
                                  {domain:"el",start:63,end:78}  ,
                                  {domain:"b3",start:73,end:78}  ,
                                ]
          })
        setForm({...form,
          Start: 1, End: 96, TimestepSize: 45, TrainInterval:100, ValidateInterval:120, TestInterval:150,
          Epochs:500, Lr:0.0005, LrDecay:200, Gamma:0.5, Var:0.00005, Seed:42,
          Encoder:'mlp', Decoder:'rnn', EncoderHidden:256, DecoderHidden:256, EncoderDropout:0.0, DecoderDropout:0.0,
          SourceNode:46, TargetNode:61, DistThreshold:12, VisualThreshold: 0.5,
          Domain:'b1_0_25,diml_25_29,disl_29_32,zl_32_43,b2_43_62,el_62_77,b3_72_77',
          // TrajFilePath: "//////",
          // NumResidues: 77,
          // NumFrames:3000,

        })
      }else{
        formform.setFieldsValue({
          Start: 1, End: 56, TimestepSize: 50, TrainInterval:60, ValidateInterval:80, TestInterval:100,
          Epochs:200,Lr:0.0005, LrDecay:200, Gamma:0.5, Var:0.00005, Seed:42,
          Encoder:'mlp', Decoder:'rnn', EncoderHidden:256, DecoderHidden:256, EncoderDropout:0, DecoderDropout:0,
          SourceNode:46, TargetNode:61,VisualThreshold: 0.6, DistThreshold:12, 
          
      })
        setForm({...form,
          Start: 1, End: 56, TimestepSize: 50, TrainInterval:60, ValidateInterval:80, TestInterval:100,
          Epochs:200,Lr:0.0005, LrDecay:200, Gamma:0.5, Var:0.00005, Seed:42,
          Encoder:'mlp', Decoder:'rnn', EncoderHidden:256, DecoderHidden:256, EncoderDropout:0, DecoderDropout:0,
          SourceNode:46, TargetNode:61,VisualThreshold: 0.6, DistThreshold:12, 
        })
      }
    },[exampleSha1])

    // console.log('submit',form);
  
    console.log("esha", exampleSha1)
  //upload trajectory file
  const trajHandleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        console.log(file.response)  
        if(file.response.num_residues>200){
          message.error(`Your protein length is ${file.response.num_residues}, now we don't support caculate a protein more than 100 amino-acids`)
        }else{
          setLengthValid(true)
        }
        setLength(file.response.amount_residues)
        setLengthValid(file.response.length_valid)
        setForm({ ...form, TrajFilePath: file.response.TrajFilePath, NumResidues:file.response.NumResidues,NumFrames:file.response.NumFrames})
        setExampleSha1(file.response.sha1==="21c6c62497a2a53b736ba47244914f11918e0647") 
        console.log(2222222);
        
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
  let domain = ''
  const onFinish = async (values) => {
    console.log('Received values of form:', values.domain_arr);
    if(values.domain_arr!==undefined){
      if((values.domain_arr.length)>0){
        const arr=values.domain_arr
        domain = arr.map(obj => obj.domain+'_'+Number(obj.start-1)+'_'+Number(obj.end-1)).join(',')
        console.log(domain)
        console.log(domain=='b1_0_25,diml_25_29,disl_29_32,zl_32_43,b2_43_62,el_62_77,b3_72_77')
        // b1_1_26,diml_26_30,disl_30_33,zl_33_44,b2_44_63,el_63_78,b3_73_78
      }else{
        domain = ','
      }
    }else{
      domain = ','
    }
    if(lengthValid){
      if(exampleSha1&&
        form.Start==1
        && form.End==96
        && form.TimestepSize== 45
        && form.TrainInterval==100
        && form.ValidateInterval==120
        && form.TestInterval==150
        && form.Epochs==500
        && form.Lr==0.0005 
        && form.LrDecay==200
        && form.Gamma==0.5
        && form.Var==0.00005
        && form.Seed==42
        && form.Encoder=='mlp'
        && form.Decoder=='rnn'
        && form.EncoderHidden==256
        && form.DecoderHidden==256
        && form.EncoderDropout==0.0
        && form.DecoderDropout==0.0
        && form.SourceNode==46
        && form.TargetNode==61
        && form.DistThreshold==12
        && form.VisualThreshold== 0.5
        &&domain=='b1_0_25,diml_25_29,disl_29_32,zl_32_43,b2_43_62,el_62_77,b3_72_77'
        ){
          console.log("domain",domain);
          // navigate('/result/0000AAAA') 
          const res = await submitJobApi({...form,Domain:domain,Example:true});
          console.log(res);
          if (res) {
            message.success('Submit Successfully')
            setIfSubmit(false)
            setJobid(res.JobId)
          } else {
            message.error('Submit failedly')
          }
           
      }else{
        console.log('submitting',{...form,Domain:domain})
        const res = await submitJobApi({...form,Domain:domain,Example:false});
        if (res) {
          message.success('Submit Successfully')
          setIfSubmit(false)
          setJobid(res.JobId)
        } else {
          message.error('Submit failedly')
        }
      }
    }else{
      message.error(`Your protein length is valid, now we don't support caculating a protein more than 100 amino-acids`)
    }
  };

  let submitForm = <>
      <div>
        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} form={formform}>

        <Form.Item name="JobFile" label="Trajectory File" rules={[{ required: true, },] } 
          extra="upload protein trajectory pdb file ( only include CA atoms ), protein should be less than 100 residues" >
            <Upload {...trajProps} fileList={trajFileList}> 
              <Button icon={<UploadOutlined />}>Upload</Button> <span  onClick={(e)=>{e.stopPropagation()}}><ExampleDrawer/></span>
            </Upload>
          </Form.Item>

          <Form.Item name='JobName' label="Name" rules={[{ type: 'string',max: 50, }]} extra="user name we called you" >
            <Input onChange={(e) => setForm({ ...form, JobName: e.target.value })} placeholder='optional'/>
          </Form.Item>

          <Form.Item name='Email' label="Email" rules={[{ type: 'email', }]}  extra="can remind you when the job is completed">
            <Input onChange={(e) => setForm({ ...form, Email: e.target.value })} placeholder='optional'/>
          </Form.Item>

            <Form.Item name="" wrapperCol={{offset:8,span:8}} style={{ display: advanced}}  >   
              <div><hr/></div>
            </Form.Item>

          {/* <span className="ant-form-text" style={{ marginLeft: 8 }}><Link  to='/help'> how to prapare the input file</Link></span> */}

          <Form.Item name="Start" label="Sample Range" style={{display:advanced,marginBottom:"0"}}>   
            <Form.Item name="Start" style={{ display: 'inline-block', width: 'calc(50% - 10px)',}} rules={[{type:"number", min: 1, max: 200, }]} >   
              <Input onChange={(e) => setForm({ ...form, Start: Number(e.target.value) })} placeholder='protein start'/>
            </Form.Item>
            <Form.Item name="~"  style={{ display: 'inline-block',  width: '20px', textAlign:'center'}}  >   
              <div>~</div>
            </Form.Item>
            <Form.Item name="End"  style={{ display: 'inline-block',  width: 'calc(50% - 10px)',}} rules={[{type:"number", min: 1, max: 200, }]} >   
              <Input   onChange={(e) => setForm({ ...form, End: Number(e.target.value) })} placeholder='protein end'/>
            </Form.Item>
          </Form.Item>


          <Form.Item name="" label="Interval" style={{display:advanced,marginBottom:"0"}}>   
            <Form.Item name="TrainInterval" style={{ display: 'inline-block', width: '30%',}} rules={[{type:"number",min: 1, max: 1000, }]} extra="train interval">   
              <InputNumber  onChange={(e) => setForm({ ...form, TrainInterval: Number(e) })} placeholder='train interval'/>
            </Form.Item>
            <Form.Item name="ValidateInterval"  style={{ display: 'inline-block',  width: '30%', marginLeft: '5%', }} rules={[{type:"number", min: 1, max: 1000, }]}  extra="validate interval">   
              <InputNumber  onChange={(e) => setForm({ ...form, ValidateInterval: Number(e) })} placeholder='validate interval'/>
            </Form.Item>
            <Form.Item name="TestInterval"  style={{ display: 'inline-block',  width: '30%', marginLeft: '5%', }} rules={[{type:"number", min: 1, max: 1000, }]} extra="test interval">   
              <InputNumber   onChange={(e) => setForm({ ...form, TestInterval: Number(e) })} placeholder='test interval'/>
            </Form.Item>
          </Form.Item>

          <Form.Item name="" wrapperCol={{offset:8,span:8}} style={{ display: advanced}}  >   
              <div><hr/></div>
            </Form.Item>

          <Form.Item name="Epochs" label="Epochs" rules={[{ type: 'number',min: 1, max: 500, }]} style={{display:advanced}}>
            <Slider marks={{0:0,100:100, 200:200, 300:300, 400:400, 500:500,} }  max={500} onChange={(e) => {setForm({ ...form, Epochs: e })}}/>
          </Form.Item>

          {/* <Form.Item name="BatchSize" label="Batch Size" className='formbatchsize' rules={[{ type: 'number',min: 1, max: 50, }]} style={{display:advanced}}>
            <Slider marks={{0:0,10:10, 20:20, 30:30, 40:40, 50:50,} }  max={50} defaultValue={1}  trackStyle={{backgroundColor: 'red',}} 	handleStyle={{backgroundColor:'red'}} onChange={(e) => {setForm({ ...form, BatchSize: e })}}/>
          </Form.Item> */}

            <Form.Item name="TimestepSize" label="Timestep Size" style={{display:advanced}} rules={[{type:"number", min: 1, max: 1000, }]}  extra="Note: TimeStep Size * Interval >= trajectory frame">   
              <InputNumber  onChange={(e) => setForm({ ...form, TimestepSize: e })} placeholder='step' />
            </Form.Item>

            

          <Form.Item label="Learning Rate" name="Lr" className='formlr' style={{display:advanced}} rules={[{ type: 'float',min: 0.0001, max: 0.0050, }]}>
            <Slider marks={{0:0, 0.0005:0.0005, 0.0010:0.0010, 0.0015:0.0015, 0.0020:0.0020, 0.0025:0.0025, 0.0030:0.0030, 0.0035:0.0035, 0.0040:0.0040, 0.0045:0.0045, 0.0050:0.0050,} }  
            max={0.0050} step={0.0001} trackStyle={{backgroundColor: 'green',}} handleStyle={{backgroundColor:'green'}} 
            onChange={(e) => {setForm({ ...form, Lr: e })}}/>
          </Form.Item>

          <Form.Item name="LrDecay" label="Learning Rate Decay" className='formbatchsize' rules={[{ type: 'number',min: 1, max: 500, }]} style={{display:advanced}}>
            <Slider  marks={{0:0,100:100, 200:200, 300:300, 400:400, 500:500,} }  max={500}  trackStyle={{backgroundColor: 'red',}} 	handleStyle={{backgroundColor:'red'}} onChange={(e) => {setForm({ ...form,LrDecay: e })}}/>
          </Form.Item>

          <Form.Item  label="Gamma" name="Gamma" style={{display:advanced}} rules={[{ type: 'number',min: 0.1, max: 1, }]}>
            <InputNumber min={0.1} max={1}  onChange={(e) => {console.log(e);setForm({ ...form, Gamma: e })}} step={0.1}/>
          </Form.Item>

          <Form.Item  label="Seed" name="Seed" style={{display:advanced}} rules={[{ type: 'number',min: 0, max: 100, }]}>
            <InputNumber min={0} max={100}  onChange={(e) => {console.log(e);setForm({ ...form, Seed: e })}}/>
          </Form.Item>

          <Form.Item  label="Var" name="Var" style={{display:advanced}} rules={[{ type: 'float',min: 1e-5, max: 1e-4, }]}>
            <InputNumber min={1e-5} max={1e-4}  onChange={(e) => {console.log(e);setForm({ ...form, Var: e })}} step={1e-5}/>
          </Form.Item>

          {/* <Form.Item  label="Learning Rate" name="Lr" style={{display:advanced}} rules={[{ type: 'float',min: 0.0001, max: 0.0100, }]}>
            <InputNumber min={0.0001} max={0.0100}  onChange={(e) => {console.log(e);setForm({ ...form, Lr: e })}} defaultValue={0.0005} step={0.0001}/>
          </Form.Item> */}
          <Form.Item name="Decoder" label="Decoder" style={{display:advanced}}>
            <Radio.Group onChange={(e) => setForm({ ...form, Decoder: e.target.value })} defaultValue='rnn'>
              <Radio value="rnn" defaultChecked>RNN</Radio>
              <Radio value="mlp">MLP</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="DecoderHidden" label="Decoder Hidden" style={{display:advanced}} rules={[{type:"number", min: 1, max: 1000, }]} >   
            <InputNumber  onChange={(e) => setForm({ ...form, DecoderHidden: e })} />
          </Form.Item>
          <Form.Item name="DecoderDropout" label="Decoder Dropout" style={{display:advanced}} rules={[{type:"number", min: 0, max: 1, }]} >   
            <InputNumber  onChange={(e) => setForm({ ...form, DecoderDropout: e })} />
          </Form.Item>


          <Form.Item name="Encoder" label="Encoder" style={{display:advanced}}>
            <Radio.Group onChange={(e) => setForm({ ...form, Eecoder: e.target.value })} defaultValue='mlp'>
              <Radio value="mlp" >MLP</Radio>
              <Radio value="cnn">CNN</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="EncoderHidden" label="Encoder Hidden" style={{display:advanced}} rules={[{type:"number", min: 1, max: 1000, }]} >   
            <InputNumber   onChange={(e) => setForm({ ...form, EncoderHidden: e })} />
          </Form.Item>
          <Form.Item name="EncoderDropout" label="Encoder Dropout" style={{display:advanced}} rules={[{type:"number", min: 0, max: 1, }]} >   
            <InputNumber   onChange={(e) => setForm({ ...form, EncoderDropout: e })} />
          </Form.Item>


          <Form.Item name="" wrapperCol={{offset:8,span:8}} style={{ display: advanced}}  >   
              <div><hr/></div>
            </Form.Item>



          <Form.Item name="StrucFile" label="PDB File" extra="optional, upload protein structure pdb file ( include all atoms ) can visualize long-range allosteric interactions in protein " >
            <Upload {...strucProps} fileList={strucFileList}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="VisualThreshold" label= "Visualization Threshold" style={{}} rules={[{type:"float" }]} extra="Threshold for interaction visualization">   
              <InputNumber  min={0.1} max={1.0} step={0.01} onChange={(e) => setForm({ ...form, VisualThreshold: e })} placeholder='Visual Threshold'/>
          </Form.Item>

          <Form.Item name="Domain" label="Domain" style={{}}>
            <Form.List name="domain_arr">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{display: 'flex',marginBottom: 8}} align="baseline">                             
                    <Form.Item {...restField} name={[name, 'domain']} style={{width:200}} rules={[{ required: true,message: 'Missing domain name',},]} >
                      <Input placeholder="Domain name" />
                    </Form.Item>
                    <div style={{display:'flex'}}>
                    <Form.Item {...restField} name={[name, 'start']} rules={[{ required: true,type:"number", message: 'Missing start index',},  ]}>
                        <Input style={{width: 100,textAlign: 'center', }} placeholder="start index"/>
                    </Form.Item>
                    <Input className="site-input-split" style={{width: 30,borderLeft: 0,borderRight: 0,pointerEvents: 'none',marginBottom:'24px'}} placeholder="~" disabled/>
                    <Form.Item {...restField} name={[name, 'end']} rules={[{ required: true,type:"number", message: 'Missing end index',},  ]}>
                    <Input  className="site-input-right"style={{width: 100,textAlign: 'center',}} placeholder="end index" />
                    </Form.Item>
                    </div>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                  <Form.Item style={{display:'flex'}}>
                    <Button type="dashed" onClick={(e) => {add();console.log(e);}} block icon={<PlusOutlined />}>
                      Add domain
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item name="DistThreshold" label= "Distance Threshold" rules={[{type:"number" }]} extra="Ignore the distance if residue distance larger than the Distance Threshold (Default: 12)">   
              <InputNumber onChange={(e) => setForm({ ...form, DistThreshold: e })} placeholder='Distance Threshold'/>
          </Form.Item>

          <Form.Item name="" label="Paths" style={{marginBottom:"0"}} rules={[{type:"number",  min: 1, max: 1000, }]}> 
            <Form.Item name="SourceNode" style={{ display: 'inline-block', width: 'calc(23% - 15px)',}} rules={[{type:"number", min: 1, max: 1000, }]} extra="Source Node" >   
              <InputNumber   onChange={(e) => setForm({ ...form, SourceNode: Number(e) })} placeholder='Source Node'  style={{ display: 'inline-block',}}/>
            </Form.Item>
            <Form.Item name=""  style={{ display: 'inline-block',  width: '30px', textAlign:'center'}}  >   
              <div>-&gt;</div>
            </Form.Item>
            <Form.Item name="TargetNode"  style={{ display: 'inline-block',  width: 'calc(50% - 15px)',}} rules={[{type:"number",min: 1, max: 1000, }]} extra="Target Node">   
              <InputNumber   onChange={(e) => setForm({ ...form, TargetNode: Number(e) })} placeholder='Target Node'/>
            </Form.Item>
          </Form.Item>

              

          <div style={{width:"67%",display: "flex",justifyContent: "flex-end",height:"40px",transition: '.3s',}} >
            <Button onClick={() => {
              advanced === "none" ? setAdvanced("") : setAdvanced("none")
            }} >{advanced === "none" ?'Advanced':'Fold'}</Button>
          </div>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 11, }}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>

        </Form>
    </div>
  </>

  return (
    <div>{ifsubmit?submitForm:<SubmitSuccessfully jobid={jobid}/>}</div> 
  )
}


