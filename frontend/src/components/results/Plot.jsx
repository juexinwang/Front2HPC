import React,{useState} from 'react'
import Domain from './Domain';
import Prob from './Prob';
import Node from './Node';
import { Button, Form, Input, InputNumber, message, Upload ,Table, Divider, Tag, Space,Radio,} from 'antd';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { setNodeApi,downloadResultAPI,uploadTrajApi  } from '../../requests/api';
import { Typography } from 'antd';
import {DownloadOutlined,} from '@ant-design/icons';
import Struc from './Struc';
const { Title } = Typography; 
export default function Plot(props){
  const {id} =useParams()
  const [path,setPath] = useState('')
  const [strucFile,setStrucFile] = useState('')
  const [showDomain,setShowDomain] = useState(true)
  const [showPDB,setShowPDB]=useState('')
  const [showsetdomain,setShowsetdomain] = useState("none")
  const [example,setExample]=useState('')
  useEffect(()=>{
    props.setResults(props.results)
    if(props.results.imgs.edges_domain==undefined){
      setShowDomain(false)
    }else{
      setShowDomain(true)
    }
    if(props.results.strucFilePath==''){
      setShowPDB(false)
    }else{
      setShowPDB(true)
    }
    if(props.results.example===true){
      setExample(true)
    }else{
      setExample(false)
    }
  },[props.results])

  
  const cm = [{title:'Path Name',dataIndex:'pathname'},{title:'Path',dataIndex:'path'},{title:'Probability',dataIndex:'probability'}]
  const rowSelection = {
    // defaultSelectedRowKeys: [0],
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0].path);
      setPath(selectedRows[0].path.replace(/\>/g,''))
    },
    fixed: false,
  
  };
  const ListPath = () => {
    return (
      <div>
        <Table rowSelection={{type: "radio",...rowSelection,}} columns={cm} dataSource={props.results.paths} /></div> );
  };   
        
 const Path2Filename = (fullpath) =>{
  if(fullpath === undefined){
    return ''
  }
  let pos = fullpath.lastIndexOf('/');
  let filename = fullpath.substr(pos+1);
  return filename
 }
 
const domain =          
<div  style={{ background: "#fffbe6", border: "1px solid #ffe58f",marginTop:"30px", marginRight:"30px" }}>
  <div style={{ margin: "20px"}}>
  <Domain setResults={props.setResults} results={props.results}/>
  </div>
</div>    

const download_result=  async()=>{
  console.log('download')
  const res = await downloadResultAPI({'JobId':id});
  console.log(res);
  
}
  return <>
    <Title level={4}style={{textAlign:"center"}}>1. Visualize the learned interactions between residues</Title>
    <div>
    In the results genereated below, both rows and columns are residues of the input Carbon-Alpha skeleton, this heatmap demonstrates the inferred interactions between these residues
    from the NRIMD model. The color demonstrates the strength of the interaction. Dark color means strong interaction, light color means weak interaction. Users can tune the parameter below 
    to select customerized threshold.
    </div>
    <Row>
      <Col span={14}>
        <img style={{width:'100%',display:"flex"}} src={`data:image/png;base64,${props.results.imgs.probs}`} alt=""/>  
      </Col>
      <Col span={10}>
        <div  style={{ background: "#fffbe6", border: "1px solid #ffe58f",marginTop:"50px", marginRight:"10px" }}>
            <div style={{ margin: "10px"}}>
            <Prob setResults={props.setResults} results={props.results}/>    
            </div>
        </div>
        <div style={{marginTop:"10px"}}>
          <div><span style={{fontWeight:"bolder"}}>Visualization Threshold</span>: Visual interaction threshold</div>
        </div>
        {showDomain?
          ''
          :
          <div>
            <div style={{width:"80%",display: "flex",justifyContent: "flex-end",height:"40px",transition: '.3s',}} >
                <Button onClick={() => {
                  showsetdomain === "none" ? setShowsetdomain("") : setShowsetdomain("none") 
                }} >{showsetdomain === "none" ?'Set domain':'Fold'}</Button>
            </div>
            <div style={{display:showsetdomain}}>
                {domain}
            </div>
          </div>
        }
      </Col>
      </Row>


      {showDomain?
      <>
        <div style={{fontSize:"large",}}><br />(Optional) Comparing to the heatmap on interactions between residues genereated above, users can manually define the domains below to get the coarse grained heatmap between the domains.
        </div> 
        <Row >
          <Col span={14}>
              <div>
                <img style={{width:'100%',}} src={`data:image/png;base64,${props.results.imgs.edges_domain}`} alt=""/>  
              </div>
          </Col>
          <Col span={10}>
            <div style={{width:"100%"}}>
              {domain}
              <div style={{marginTop:"10px"}}>
                <div><span style={{fontWeight:"bolder"}}>Visualization Threshold</span>: Visual interaction threshold</div>
                <div><span style={{fontWeight:"bolder"}}>Domain</span>: User defined protein domain, only calculate defined domain</div> 
              </div>
            </div>
          </Col> 
        </Row>  
        </>  
        :
        ''
      }

    <br/>
    <br/>


    <Title level={4}style={{textAlign:"center"}}>2. Find the potential pathways between residues (Optional)</Title>
    <div style={{fontSize:"large", marginBottom:20}}>Inferring the potential pathways from user defined source residue to target residue. The paths are inferred as the shortest distances by Dijkstra's algorithm. 
    </div>
    <Row>
      <Col span={12}>
        <div style={{ background: "#fffbe6", border: "1px solid #ffe58f",marginRight:"10px",marginLeft:"10px" }}>
          <Node setResults={props.setResults} results={props.results} />
        </div>
        <br/>
        <div style={{width:"90%",marginLeft:"5%"}}>{ListPath()}</div>
      </Col>
      <Col span={12}>
        {
          props.results.example?
          ''
          : 
          <Struc setResults={props.setResults} results={props.results}/>
        }
        
        {showPDB?
        <div style={{marginLeft:'50px',marginRight:'30px'}}>
          <iframe src={`http://nrimd.luddy.iupui.edu:9090/index.php?pdb=${Path2Filename(props.results.strucFilePath)}&path=${path}`} width="100%" height="500px"  frameborder="1" scrolling="no"></iframe>
        </div>
          :''}
   
      </Col>
    </Row>
    <span style={{ fontWeight: 'bold' }}>Note: All finished jobs will be deleted automatically in 14 days.</span>
    <h4>All the results can be downloaded:     
    <a href={'/api/download_result/'+id+'/'} style={{marginLeft:"50px"}}><Button type="primary" icon={<DownloadOutlined />}>Download Results</Button></a>
                                      </h4>
    
  </>
}

