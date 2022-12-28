import React, { useState } from 'react';
import { Button, message, Steps } from 'antd'
import flowchart from '../assets/imgs/chart.webp'
import { Typography,Divider } from 'antd';
import HowSubmit from './HowSubmit';
import { Link } from 'react-router-dom';
const { Title } = Typography;
let intro=<div>
  
            <h2>Analyzing long-range interactions in molecular dynamics simulations using deep learning</h2>
            <div>
            Long-range allostery communication between distant sites in proteins is central to biological regulation but still poorly characterized, limiting the development of protein engineering and drug design. Molecular dynamics (MD) simulation provides a powerful computational approach to probe the allosteric effect and other long-range interactions. <br></br> 
            Based on our recent works on neural relational inference using graph neural networks (<a href="https://www.nature.com/articles/s41467-022-29331-3">Zhu et al, Nature Communications</a>), we developed <Link to='/intro'>NRIMD</Link>, a web server for analyzing long-range interactions in proteins from MD simulation. The cloud-based web server accepts MD simulation data in the Carbon-Alpha skeleton format from mainstream MD software AMBER, NAMD, and GROMACS. The input MD trajectory data is validated in the front end, and then submitted to the backend on a High-Performance Computer system supported by Indiana University cyberinfrastructure. Due to its computational intensity on GPUs, the submitted tasks will be lined up in the computational queue in the HPC. The results include the learned long-range interactions and pathways that can mediate the long-range interactions between distant sites, and the visualization from the trajectories obtained in MD.<br></br>
            The learning process includes the system preparation of a ligand-binding complex or mutant protein structure with allostery (a), the MD simulation of a prepared allosteric system to obtain the trajectory with the dynamic 3D coordinates (b), the conventional analysis for the trajectory (c), and the sampling and training using the NRI model with two jointly trained components (d). In (d), the NRI model consists of an encoder, which infers a factorized distribution qΦ(z|x) over the latent interactions based on the input trajectories and a decoder, which reconstructs the future trajectories of the dynamic systems given the latent graph learned from the encoder. Based on the MD trajectory, the NRI model formulates the protein allosteric process as a dynamic network of interacting residues. The interaction graph learned from this model is compared with the conventional analysis to better understand the allosteric pathway in the protein.<br></br>
            </div>
            <img src={flowchart} alt="" style={{width:'500px'}}></img>
        </div>
let submit=<div>
  <HowSubmit/>
        </div>
let result=<div>
              You can check your results <Link to='/result'>here</Link>, and input your Job ID when submitting successfully. <br/>
              As the deep learning based jobs take some time (~1 hour or longer, depends on the sequence length and the queue in HPC), You can either bookmark your result as http://nrimd.luddy.iupui.edu/result/ + your job Id, or click the link in your emailbox if email address is provided. <br/>
              <span style={{ fontWeight: 'bold' }}>Note: All finished jobs will be deleted automatically in 14 days.</span>
          </div>

const steps = [
  {
    title: 'Introduction',
    content: intro,
  },
  {
    title: 'Submit Trajectory',
    content: submit,
  },
  {
    title: 'Get Result',
    content: result,
  },
];

const items = steps.map((item) => ({ key: item.title, title: item.title }));

const QuickStart = () => {
  const [current, setCurrent] = useState(0);
  
  const onChange = (value) => {
    console.log('onChange:', current);
    setCurrent(value);
  }

  return (
    <>
      <Title level={2}>Introduction to Neural Relational Inference from Molecular Dynamics (NRIMD)</Title>
      <Divider/>
      <Title level={3}>Quick Start</Title>
      <Steps current={current} onChange={onChange} items={items} />
      <br/>
      <div className="steps-content">{steps[current].content}</div>
    </>
  );
};

export default QuickStart