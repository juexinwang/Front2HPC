import React from 'react'
import { Typography,Divider } from 'antd';
import { Link } from 'react-router-dom';
import check from '../assets/imgs/check.png'
import result1 from '../assets/imgs/result1.png'
import result2 from '../assets/imgs/result2.png'
import result3 from '../assets/imgs/result3.png'
import etraj1 from '../assets/imgs/etraj1.png'
import etraj2 from '../assets/imgs/etraj2.png'
import etraj3 from '../assets/imgs/etraj3.png'
import etraj4 from '../assets/imgs/etraj4.png'
import bookmark from '../assets/imgs/bookmark.png'
const { Text} = Typography;
const { Title } = Typography; 
export default function Example() {
  return (
    <div>
    <Title level={3}>Example Explanation</Title>
    <Divider/>
    <Title level={4}>1. Submit Example Trajectory</Title>
    <ul>
      <li><Title level={5}>1.1 Download Example Trajectory</Title></li>
      <img src={etraj1} style={{width:"100%",border:'3px solid #000'}}></img>
     <div>
     then click Download button to download example trajecory:
     </div>
      
      <img src={etraj2} style={{border:'3px solid #000'}}></img>
      <li><Title level={5}>1.2 Upload Example Trajectory </Title></li>
      <img src={etraj3} style={{border:'3px solid #000'}}></img>
      <li><Title level={5}>1.3 Submit</Title></li>
      <img src={etraj4} style={{border:'3px solid #000'}}></img>
    </ul>
    <Divider/>

    <Title level={4} >2. Get Example Result</Title>
    <div>
    You can input your Job Id here to check your job status ( running or finished ).
    </div>
    <img src={check} style={{border:'3px solid #000'}}></img>
    <div>
    You can can either bookmark your results as http://nrimd.luddy.iupui.edu/result/ + job Id, or click the link in the emailbox if email address is provided.
    </div> 
    <img src={bookmark} style={{border:'3px solid #000'}}></img>
    <Divider/>

    <Title level={4}>3.Example Result Explanation</Title>
    <ul>
      <li><Title level={5}>3.1 Visualize the learned interactions between residues</Title></li>
      <div>In the results genereated below, both rows and columns are residues of the input Carbon-Alpha skeleton, 
        this heatmap demonstrates the inferred interactions between these residues from the NRIMD model. 
        The color demonstrates the strength of the interaction. Dark color means strong interaction, light color weak interaction. 
        Users can tune the parameter below to select customerized threshold.
      </div>
      <img src={result1} style={{width:"100%",border:'3px solid #000'}}></img>
      <div>
        (Optional) Comparing to the heatmap on interactions between residues genereated above, users can manually 
        define the domains below to get the coarse grained heatmap between the domains.
      </div>
      <img src={result2} style={{width:"100%",border:'3px solid #000'}}></img>
      <li><Title level={5}>3.2 Find the potential pathways between residues (Optional)</Title></li>
      <div>Inferring the potential pathways from user defined source residue to target residue. 
        The paths are inferred as the shortest distances by Dijkstra's algorithm.</div>
      <img src={result3} style={{width:"100%",border:'3px solid #000'}}></img>
    </ul>
    <Divider/>

  
  </div>
  )
}
