import React,{useState} from 'react'
import Domain from './Domain';
import Node from './Node';
import { Button, Form, Input, InputNumber, message, Upload ,Table, Divider, Tag, Space,Radio,} from 'antd';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { setNodeApi } from '../../requests/api';
export default function Plot(props){
  const {id} =useParams()
  console.log(id)
  const [path,setPath] = useState('')
  const [strucFile,setStrucFile] = useState('')
  console.log(props)
  useEffect(()=>{
    props.setResults(props.results)
  },[props.results])
  // console.log('1111',props.paths);
  console.log('props',props);
  const cm = [{title:'Path Name',dataIndex:'pathname'},{title:'Path',dataIndex:'path'},{title:'Probability',dataIndex:'probability'}]
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
 
    
  return <>
    <h3>Your job {id} has finished, here are results: </h3>
    <Divider>1. Visualize the distribution of learned edges between residues</Divider>
    <Row>
      <Col span={8}>
        <div style={{textAlign:"center"}}>probs image</div>
        <img style={{width:'100%',display:"flex"}} src={`data:image/png;base64,${props.results.probImg}`} alt=""/>
      </Col>
      <Col span={8} style={{marginRight:0}}>
        <div style={{textAlign:"center"}}>edges_domain image</div>
        <img style={{width:'100%',}} src={`data:image/png;base64,${props.results.domainImg}`} alt=""/>
      </Col>
      <Col span={8}>
        <div  style={{ background: "#fffbe6", border: "1px solid #ffe58f", }}>
            <div style={{ margin: "5px"}}>
            <Domain setResults={props.setResults} results={props.results}/>
            </div>
          
        </div>

        
      </Col>
    </Row>
    <br/>
    <Divider>2. Find shortest paths along domains in residues</Divider>
    <Row>
      <Col span={12}>
      <div  style={{ background: "#fffbe6", border: "1px solid #ffe58f", }}>
        <Node  setResults={props.setResults} results={props.results} />
        </div>
          <div style={{width:"50%"}}>{ListPath()}</div>
      </Col>
      <Col span={12}>
      <iframe src={`http://localhost:9090/index.php?pdb=${Path2Filename(props.results.strucFilePath)}&path=${path}`} width="100%" height="800px" frameBorder = "1" ></iframe>
      </Col>
    </Row>
    
  </>
}

