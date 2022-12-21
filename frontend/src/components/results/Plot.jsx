import React,{useState} from 'react'
import Domain from './Domain';
import Prob from './Prob';
import Node from './Node';
import { Button, Form, Input, InputNumber, message, Upload ,Table, Divider, Tag, Space,Radio,} from 'antd';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { setNodeApi } from '../../requests/api';
import { Typography } from 'antd';
import Traj from './Traj';
const { Title } = Typography; 
export default function Plot(props){
  const {id} =useParams()
  const [path,setPath] = useState('')
  const [strucFile,setStrucFile] = useState('')
  const [showDomain,setShowDomain] = useState(true)
  const [showPDB,setShowPDB]=useState('')
  const [showsetdomain,setShowsetdomain] = useState("none")
  console.log(props.results.imgs.edges_domain);
  console.log('aaa',props.results.strucFilePath)
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
    // console.log('aaaaa',props.results.imgs.edges_domain)
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
<div  style={{ background: "#fffbe6", border: "1px solid #ffe58f",marginTop:"70px", marginRight:"70px" }}>
  <div style={{ margin: "20px"}}>
  <Domain setResults={props.setResults} results={props.results}/>
  </div>
</div>    

  return <>
    <h4>Your job {id} has finished, here are results: </h4>
    <Divider style={{fontSize:"large"}}>1. Visualize the distribution of learned edges between residues</Divider>
    <Row>
      <Col span={14}>
        <img style={{width:'100%',display:"flex"}} src={`data:image/png;base64,${props.results.imgs.probs}`} alt=""/>
        <Title level={4}style={{textAlign:"center"}}>Distribution of learned edges</Title>
      </Col>
      <Col span={10}>
        <div  style={{ background: "#fffbe6", border: "1px solid #ffe58f",marginTop:"80px", marginRight:"80px" }}>
            <div style={{ margin: "10px"}}>
            <Prob setResults={props.setResults} results={props.results}/>    
            </div>
        </div>
        <div style={{marginTop:"10px"}}>
          <div><span style={{fontWeight:"bolder"}}>Visualization Threshold</span>: threshold for interaction visualization</div>
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
        <Row >
          <Col span={14}>
              <div>  
                <img style={{width:'100%',}} src={`data:image/png;base64,${props.results.imgs.edges_domain}`} alt=""/>
                <Title level={4}style={{textAlign:"center"}}>Distribution of learned edges between domains</Title>
              </div>
          </Col>
          <Col span={10}>
          {/* {domain} */}
            <div>
              {domain}
              <div style={{marginTop:"10px"}}>
                <div><span style={{fontWeight:"bolder"}}>Visualization Threshold</span>: threshold for interaction visualization</div>
                <div><span style={{fontWeight:"bolder"}}>Domain</span>: Set domain, only calculate domain information if domainInput has information</div> 
              </div>
              
            </div>
          </Col> 
        </Row>    
        :
        ''
      }

    <br/>
    <br/>


    <Divider style={{fontSize:"large"}}>2. Find shortest paths along domains in residues</Divider>
    <Row>
      <Col span={12}>
        <div style={{ background: "#fffbe6", border: "1px solid #ffe58f",marginRight:"10px",marginLeft:"10px" }}>
          <Node setResults={props.setResults} results={props.results} />
        </div>
        <br/>
        <div style={{width:"90%",marginLeft:"40px"}}>{ListPath()}</div>
      </Col>
      <Col span={12}>

        <Traj setResults={props.setResults} results={props.results}/>

        
        {showPDB?
        <div style={{marginLeft:'50px',marginRight:'30px'}}>
          <iframe src={`http://nrimd.luddy.iupui.edu:9090/index.php?pdb=${Path2Filename(props.results.strucFilePath)}&path=${path}`} width="100%" height="500px"  frameborder="1" scrolling="no"></iframe>
        </div>
          :''}
   
      </Col>
    </Row>
    
  </>
}

