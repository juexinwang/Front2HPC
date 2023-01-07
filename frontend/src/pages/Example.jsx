import React from 'react'
import { Typography,Divider } from 'antd';
import { Link } from 'react-router-dom';
import check from '../assets/imgs/check.png'
import result1 from '../assets/imgs/result1.png'
import result2 from '../assets/imgs/result2.png'
import result3 from '../assets/imgs/result3.png'
import result4 from '../assets/imgs/result4.png'
import etraj1 from '../assets/imgs/etraj1.png'
import etraj2 from '../assets/imgs/etraj2.png'
import etraj3 from '../assets/imgs/etraj3.png'
import etraj4 from '../assets/imgs/etraj4.png'
import bookmark from '../assets/imgs/bookmark.png'
import { Anchor, Row, Col } from 'antd';
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
      <ul>
        <li>
        <div>Firstly, go to <Link to='/submit'>Submit Job</Link> in the left side menu, and click example link.</div>
        <img src={etraj1} style={{width:"90%",border:'3px solid #000'}}></img>
        </li><br/>
        <li>
        <div>Then the drawer below will pop up on the right side of the screen, please click Download button to download example trajecory.</div>
        <img src={etraj2} style={{width:"90%",border:'3px solid #000'}}></img>
        </li><br/>
      </ul>

      <li><Title level={5}>1.2 Upload Example Trajectory </Title></li>
      <ul>
        <li>
          <div>After downloading the example trajectory - sod1_traj.pdb, please click upload button to upload it.</div>
          <img src={etraj3} style={{width:"90%",border:'3px solid #000'}}></img>
        </li><br/>
      </ul>

      <li><Title level={5}>1.3 Submit</Title></li>
      <ul>
        <li>Parameters:
        <div>Email and Name are optional, if you fill in a valid email address, we will send you an email when the case is finished.</div>
        <div>When the upload is successful, the basic parameters will automatically change from empty to the default value, these parameters will will affect the visualization of the results, 
          see the blue box in the picture below, the following is a detailed explanation of the parameters:</div>
          <ul>
            <li><span style={{fontWeight:"bold"}}>Visualization Threshold</span>: the threshold for interaction visualization between two residues, this is required.
            If the inffered interaction between two residues are greater than the threshold, it will shown in the interaction heatmap in result. <Anchor items={[{key: 'interactions-residues',href: "#interactions-residues",title: 'example'}]} />
            
            
            
            
            </li>
            <li><span style={{fontWeight:"bold"}}>Domain</span>: you can define names and start and end positions of the domains based on your own protein. Comparing to the heatmap on interactions between residues, 
              there will generate the coarse grained heatmap between the domains. <Anchor items={[{key: 'interactions-domains',href: "#interactions-domains",title: 'example'}]} />
            </li>
            <li><span style={{fontWeight:"bold"}}>Paths</span>: set the source residue and target residue of the protein for inferring potential paths. The paths are inferred as the shortest distances by Dijkstra's algorithm.</li>
            <li><span style={{fontWeight:"bold"}}>Distance Threshold</span>: maximum residue distance per segment of potential pathways. <Anchor items={[{key: 'paths',href: "#paths",title: 'example'}]} />
            </li>
          </ul>
        </li>
        <li>Advanced:
          <div>There are more algorithm parameters in the advanced, and the default values have been set in the case.</div>
          <div>Please refer to <Link to='/help'>User Guide</Link> for the explanation of these parameters.</div>
        </li>
        <li>Submit:
          <div>Click the submit button to submit the example job.</div>
        </li>
            <img src={etraj4} style={{width:"40%",border:'3px solid #000'}}></img>
      </ul>
      
    </ul>
    <Divider/>

    <Title level={4} >2. Get Example Result</Title>
    <ul>
      <li>
        <div>
        Go to <Link to='/result'>Get Result</Link> in the left side menu, 
        the you can input your Job Id here and click submit button to check your job status ( running or finished ).
        </div>
        <img src={check} style={{width:"90%", border:'3px solid #000'}}></img>
      </li><br/>
      <li>
        <div>
        You can either bookmark your results as http://nrimd.luddy.iupui.edu/result/ + job Id, or click the link in the emailbox if email address is provided.
        </div> 
        <img src={bookmark} style={{width:"50%",border:'3px solid #000'}}></img>
      </li>    <br/>
    </ul>
    
    <Divider/>

    <Title level={4}>3.Example Result Explanation </Title>

    <ul>
      <li>
        <div>
        The result consists of two parts: 
          <ul>
            <li>Visualize the learned interactions 
              <ul>
                <li>visualize the learned interactions between residues *</li>
                <li>visualize the learned interactions between domains ( optional, need to input Domains )</li>
              </ul>
            </li>
            <li> Find the potential pathways between residues ( optional, need to input Distance Threshold and Paths ) 
              and then visualize in protein structure ( optional, need to upload PDB file )
              </li>
          </ul>
        Note: the above can be changed in the result!
        </div>
      </li>

      <li id="interactions-residues"><Title level={5}>3.1 Visualize the learned interactions between residues</Title>
      <ul>
        <li>Visualize the learned interactions between residues:
          <div>
          In the results genereated below, both rows and columns are residues of the input Carbon-Alpha skeleton, 
          this heatmap demonstrates the inferred interactions between these residues from the NRIMD model. 
          The color demonstrates the strength of the interaction. Dark color means strong interaction, light color weak interaction. 
          Users can tune the parameter below to select customerized threshold.
          </div>
          <img src={result1} style={{width:"90%",border:'3px solid #000'}}></img>
          <br/>
          <div>
          
          In the following figure, the Visualization Threshold are set as 0.1 and 0.9 respectively. 
          If the learned interaction between two residues is less than the threshold, it will not be shown in the heatmap, otherwise it will be displayed. Users can refer this to set threshold value to make the result clearer.

          </div>
          <img src={result2} style={{width:"90%",border:'3px solid #000'}}></img>
        </li><br/>

        <li id="interactions-domains">visualize the learned interactions between domains ( Optional ) :
        <div>
        Comparing to the heatmap on interactions between residues genereated above, users can manually 
          define the domains below to get the coarse grained heatmap between the domains.
        </div>
        <img src={result3} style={{width:"90%",border:'3px solid #000'}}></img>
        </li><br/>
      </ul>
      </li>

      <li id="paths"><Title level={5}>3.2 Find the potential pathways between residues (Optional)</Title></li>
      <ul>
        <li>
          <div>Inferring the potential pathways from user defined source residue to target residue. 
          The paths are inferred as the shortest distances by Dijkstra's algorithm.
          </div>
        </li>
        <li>
          <div>
          User can change the parameters ( Distance Threshold and Paths) in the yellow box to change the result.
          </div>
        </li>
        <li>
          <div>
          User can also select diffirent path to show in the right PDB structure, black ball is the residue node, grey stick is path segment.
          </div>
        </li>
      </ul>
      <img src={result4} style={{width:"90%",border:'3px solid #000'}}></img>
    </ul>
    <Divider/>

  
  </div>
  )
}
