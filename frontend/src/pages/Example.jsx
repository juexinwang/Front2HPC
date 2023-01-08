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
        <div>Then the drawer below will pop up on the right side of the screen, please click Download button to download example trajectory.</div>
        <img src={etraj2} style={{width:"90%",border:'3px solid #000'}}></img>
        </li><br/>
      </ul>

      <li><Title level={5}>1.2 Upload Example Trajectory </Title></li>
      <ul>
        <li>
          <div>After downloaded the example trajectory - sod1_traj.pdb, click upload button to upload it. Note, it may take some time to uploading the whole input.</div>
          <img src={etraj3} style={{width:"90%",border:'3px solid #000'}}></img>
        </li><br/>
      </ul>

      <li><Title level={5}>1.3 Submit</Title></li>
      <ul>
        <li><span style={{fontWeight:"bold"}}>Parameters</span>:
        <div>Name and Email are optional. If a valid email address is provided, users will be notified with result link if the submitted job is finished.</div>
        <div>After the example input has been successfully uploaded, the basic parameters will automatically loaded into the system. These parameters will affect the visualization of the results, 
          the blue box in the picture details the explanation of the parameters:</div>
          <ul>
            <li><span style={{fontWeight:"bold"}}>Visualization Threshold</span>: the interaction threshold between two residues for visulization, (0.1-1.0), default 0.5.
            The inferred interaction between two residues larger than the threshold will shown in the interaction heatmap. <Anchor items={[{key: 'interactions-residues',href: "#interactions-residues",title: 'example'}]} />
            
            
            
            
            </li>
            <li><span style={{fontWeight:"bold"}}>Domain</span>: users can manually define name, start, and end positions of the protein domains. Compared to the heatmap between residues, 
              it will generate the coarse grained heatmap between the domains. <Anchor items={[{key: 'interactions-domains',href: "#interactions-domains",title: 'example'}]} />
            </li>
            <li><span style={{fontWeight:"bold"}}>Paths</span>: set the source (Start) residue and target (End) residue of the protein for inferring potential paths. The paths are inferred as the shortest distances by Dijkstra's algorithm.</li>
            <li><span style={{fontWeight:"bold"}}>Distance Threshold</span>: maximum residue distance per segment of potential pathways. <Anchor items={[{key: 'paths',href: "#paths",title: 'example'}]} />
            </li>
          </ul>
        </li>
        <li><span style={{fontWeight:"bold"}}>Advanced</span>:
          <div>There are more deep learning based algorithm parameters in the advanced section, and the default values have been set as the default.</div>
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
        users can input the Job Id here and click submit button to check the job status ( running or finished ).
        </div>
        <img src={check} style={{width:"90%", border:'3px solid #000'}}></img>
      </li><br/>
      <li>
        <div>
        You can either bookmark your results as http://nrimd.luddy.iupui.edu/result/ + job Id, or click the link in the emailbox if email address is provided.
        If the user uploads the example sod1_traj.pdb and does not change the parameters, the system will automatically generate results in seconds. Otherwise, the system will submit the job to the queue of HPC as the ordinary jobs.
        </div> 
        <img src={bookmark} style={{width:"50%",border:'3px solid #000'}}></img>
      </li>    <br/>
    </ul>
    
    <Divider/>

    <Title level={4}>3.Example Results Explanation </Title>

    <ul>
      <li>
        <div>
        The result of NRIMD consists of two parts: 
          <ul>
            <li>Visualize the learned interactions 
              <ul>
                <li>Visualize the learned interactions between residues </li>
                <li>Visualize the learned interactions between domains ( optional, need to manually define protein Domains )</li>
              </ul>
            </li>
            <li>Find the potential pathways between residues ( optional, need to input Distance Threshold and Paths ) 
              and then visualize in protein structure ( optional, need to upload the full PDB file )
              </li>
          </ul>
        Note: Users can change the above default parameters in the result page.
        </div>
      </li>

      <li id="interactions-residues"><Title level={5}>3.1 Visualize the learned interactions between residues</Title>
      <ul>
        <li>Visualize the learned interactions between residues:
          <div>
          In the results genereated below, both rows and columns are residues of the input Carbon-Alpha skeleton, 
          this heatmap demonstrates the inferred interactions between these residues from the NRIMD model. 
          The color demonstrates the strength of the interaction. Dark color means strong interaction, light color means weak interaction. 
          Users can tune the parameter below to select customerized threshold.
          </div>
          <img src={result1} style={{width:"90%",border:'3px solid #000'}}></img>
          <br/>
          <div>
          
          In the following figure, the Visualization Threshold are set as 0.1 and 0.9 respectively. 
          The interaction will not shown in the heatmap if the strength is less than the defined threshold. Users can modify the threshold value to get the desired heatmap.

          </div>
          <img src={result2} style={{width:"90%",border:'3px solid #000'}}></img>
        </li><br/>

        <li id="interactions-domains">Visualize the learned interactions between domains ( Optional ) :
        <div>
        Compared to the residue level heatmap genereated above, users can manually 
          define the domains below to get the coarse grained heatmap between the domains.
        </div>
        <img src={result3} style={{width:"90%",border:'3px solid #000'}}></img>
        </li><br/>
      </ul>
      </li>

      <li id="paths"><Title level={5}>3.2 Find the potential pathways between residues (Optional)</Title></li>
      <ul>
        <li>
          <div>Inferring the potential pathways from user defined source (Start) residue to the target (End) residue. 
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
          Users can also select diffirent path to show in the PDB structure, black ball is the residue node, grey stick is the path.
          </div>
        </li>
      </ul>
      <img src={result4} style={{width:"90%",border:'3px solid #000'}}></img>
    </ul>
    <Divider/>

  
  </div>
  )
}
