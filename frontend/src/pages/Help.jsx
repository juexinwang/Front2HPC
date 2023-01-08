import React, { useEffect,Tag } from 'react'
import '../assets/lesses/help.less'
import Node from '../components/results/Node';
import Domain from '../components/results/Domain';
import Status from '../components/results/Status';
import Vmd from '../components/tutorials/Vmd'
import Namd from '../components/tutorials/Namd';
import { Typography,Divider } from 'antd';
import Amber from '../components/tutorials/Amber';
import Gromacs from '../components/tutorials/Gromacs';
import Python from '../components/tutorials/Python';
import { Link } from 'react-router-dom';
import steps from '../assets/imgs/steps.png'
import check from '../assets/imgs/check.png'
import status from '../assets/imgs/status.png'

import bookmark from '../assets/imgs/bookmark.png'
const { Text} = Typography;
const { Title } = Typography; 
// import A from './A';

export default function Help() {
  return <>
  <Title level={2}>User Guide</Title>
  <Divider/>
  <div>
  This document is for both new and experienced users of analyzing long-range interactions in proteins from molecular dynamics simulations using NRIMD.
   Here are four features available for this web server, as listed in the left side of the website --
  <Link to='/intro'>Introduction</Link>
  , <Link to='/submit'>Submit Job</Link>
  , <Link to='/result'>Get Result</Link> and <Link to='/example'>Example Explanation</Link>.
  </div>
  <Divider/>

  <Title level={3}>1. Introduction</Title>
  <div>
  Users can learn the workflow and basic introductions to each feature on this website. 
  Please click the 3 steps consecutively as listed in the picture, for the basic introductions of this webserver.
  </div>
  <img src={steps} style={{width:"100%",border:'3px solid #000'}}></img>
  <Divider/>

  <Title level={3}>2. Submit Job</Title>
  <ul>
    <li> <Title level={4}>2.1 Pareparation for trajecory file</Title>
    The NRIMD input can be prepared from outputs of mainstream Molecular Dynamics software GROMACS, AMBER, and NAMD. We provide instructions using Built-in commands, VMD, and Customized python scripts as follows:
      <ul>
        <li><Title level={5}>2.1.1 Built commands of MD software</Title>
          <ul>
          <li><h3>GROMACS</h3> <Gromacs/></li>
          <li><h3>AMBER</h3><Amber/></li>
          <li><h3>NAMD</h3><Namd/></li> 
          </ul>
        </li>
        <li><Title level={5}>2.1.2 VMD</Title>
        <Vmd/>
        </li>
        <li>
        <Title level={5}>2.1.3 Python Script</Title>
        <Python/>
        </li>
      </ul>
    </li>

    <li><Title level={4}>2.2 Parameters for submitting</Title>
        <div  className="help-parameters">
        <ul>
          <li>
          <Title level={5}>2.2.1 Pre-processing parameters: Generate training/validation/testing features from pdb</Title>
          </li>
          <div><span>Protein Start</span>: select pdb file window from start</div>
          <div><span>Protein End</span>: select pdb file window to end</div>
          <div><span>Train Interval</span>: intervals in trajectory in training</div>
          <div><span>Validate Interval</span>: intervals in trajectory in validate</div>
          <div><span>Test Interval</span>: intervals in trajectory in test</div>
          <li>
          <Title level={5}>2.2.2 Advanced running parameters: deep learning parameters in the model of Neral Relational Inference </Title>
          </li>
          <div><span>Epochs</span>: Number of epochs to train</div>
          <div><span>Timestep Size</span>: The number of time steps per sample. Actually is 50</div>
          <div><span>Learning Rate</span>: Initial learning rate</div>
          <div><span>Learning Rate Decay</span>: After how epochs to decay LR by a factor of gamma</div>
          <div><span>Gamma</span>: LR decay factor</div>
          <div><span>Seed</span>: Random seed</div>
          <div><span>Var</span>: Output variance</div>
          <div><span>Decoder</span>: Type of decoder model (mlp or rnn)</div>
          <div><span>Decoder Hidden</span>: Number of hidden units in decoder</div>
          <div><span>Decoder Dropout</span>: Dropout rate (1 - keep probability) in decoder</div>
          <div><span>Eecoder</span>: Type of Eecoder model (mlp or rnn)</div>
          <div><span>Encoder Hidden</span>: Number of hidden units in encoder</div>
          <div><span>Encoder Dropout</span>: Dropout rate (1 - keep probability) in encoder</div>
          <li>
          <Title level={5}> 2.2.3 Visualize the learned interactions between residues</Title>
          </li>
          <div><span>Visualization Threshold</span>: threshold for interaction visualization</div>
          <div><span>Domain</span>: Set domain, only calculate domain information if domainInput has information</div>
          <li>
          <Title level={5}>2.2.4 Find shortest paths along domains in residues. Running on both backend and frontend</Title>
          <div><span>Distance Threshold</span>: threshold for shortest distance, set as num-residues if it does not work</div>
          <div><span>Source Residue</span>: source residue of the PDB</div>
          <div><span>Target Residue</span>: target residue of the PDB</div>
          </li>
      </ul>
      </div>
    </li>
  </ul>
  <Divider/>

  <Title level={3}>3. Get Result</Title>
  <div>
  Once the job has been submitted, users can get Job Id, and users can check the job status ( running or finished ).
  </div>
  <img src={check} style={{border:'3px solid #000'}}></img>
  <div>
  Users can can either bookmark the results as http://nrimd.luddy.iupui.edu/result/ + Job ID, or click the link in the emailbox if the email address is provided.
  </div> 
  <img src={bookmark} style={{border:'3px solid #000'}}></img>
  <div>
  As the deep learning based jobs take some time (~1 hour or longer, depends on the sequence length and the queue in the HPC). If the job is still running, the status of the job will show this:
  </div>
  <img src={status} style={{width:'100%',border:'3px solid #000'}}></img>
  <div>
    The job status will fresh every 5 minutes, users can click the refresh button to fresh the job status.
  </div>
  <div>
    It will jump to the results page if the job is finished. Note: All finished jobs will be deleted automatically in 14 days.
  </div>
  <Divider/>

  </>

}

