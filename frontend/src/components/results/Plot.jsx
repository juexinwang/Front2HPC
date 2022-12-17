import React,{useState} from 'react'
import Domain from './Domain';
import Node from './Node';
import { Button, Form, Input, InputNumber, message, Upload ,Table, Divider, Tag, Space,Radio } from 'antd';
export default function Plot(props){
  const [path,setPath] = useState('')
  // const [paths,setPaths] = useState(props.paths)
  // const [probImg,setprobImg] = useState(props.paths)
  // const [paths,setPaths] = useState(props.paths)
  let paths = props.paths
  let probImg = props.probImg
  let domainImg = props.domainImg
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
        <Table rowSelection={{type: "radio",...rowSelection,}} columns={paths.columns} dataSource={paths.data} /></div> );
  };   
            
    
  return <>
    <div>Image1</div>
    <div>
      <img style={{width:'50%',display:"flex"}} src={`data:image/png;base64,${probImg}`} alt=""/>
    </div>
    <hr/>
    <div>edges_domain image</div>
    <div>
      <Domain width="50%" style={{width:'50%',display:'inline-block'}}/>
      <img style={{width:'50%',display:'inline-block'}} src={`data:image/png;base64,${domainImg}`} alt=""/>
    </div>
    <hr/>
    <div style={{width:"50%"}}>
    <Node />
    <div >{ListPath()}</div>
    </div>
    <iframe src={`http://localhost:9090/index.php?pdb=1ake.pdb&path=${path}`} width="50%" height="800px" frameBorder = "1" ></iframe>
    
  </>
}

