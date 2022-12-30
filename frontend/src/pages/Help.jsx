import React, { useEffect,Tag } from 'react'
import '../assets/lesses/help.less'
import Node from '../components/results/Node';
import Domain from '../components/results/Domain';
import Status from '../components/results/Status';
import Vmd from '../components/tutorials/Vmd'
import { Typography,Divider } from 'antd';
import Amber from '../components/tutorials/Amber';
import Gromacs from '../components/tutorials/Gromacs';
import Python from '../components/tutorials/Python';


const { Title } = Typography; 
// import A from './A';

export default function Help() {
  return <>
  <Title level={2}>User Guide</Title>
  <Title level={3}>1 Preparation for trajecory file</Title>
    <Title level={4}>1.1 Built commands of MD software</Title>
      <Title level={5}>1.1.1 Gromacs</Title>
      <Gromacs/>
      <Title level={5}>1.1.2 amber</Title>
      <Amber></Amber>
      <Title level={5}>1.1.3 namd</Title>
    <Title level={4}>1.2 VMD</Title>
    <Vmd/>
    <Title level={4}>1.3 Python Script</Title>
    <Python/>
  <Divider/>
  <Title level={3}>2 Parameters for submitting</Title>
  <div  className="help-parameters">
    <Title level={4}>2.1 pre-processing parameters: Generate training/validation/testing features from pdb</Title>
    <div><span>Protein Start</span>: select pdb file window from start</div>
    <div><span>Protein End</span>: select pdb file window to end</div>
    <div><span>Train Interval</span>: intervals in trajectory in training</div>
    <div><span>Validate Interval</span>: intervals in trajectory in validate</div>
    <div><span>Test Interval</span>: intervals in trajectory in test</div>
    <Title level={4}>2.2 running parameters: Neral relational inference for molecular dynamics simulations</Title>
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
    <Title level={5}> 2.3.1 Visualize the learned interactions between residues</Title>
    <div><span>Visualization Threshold</span>: threshold for interaction visualization</div>
    <div><span>Domain</span>: Set domain, only calculate domain information if domainInput has information</div>
    <Title level={5}>2.3.2 Find shortest paths along domains in residues. Running on both backend and frontend</Title>
    <div><span>Distance Threshold</span>: threshold for shortest distance, set as num-residues if it does not work</div>
    <div><span>Source Residue</span>: source residue of the PDB</div>
    <div><span>Target Residue</span>: target residue of the PDB</div>
  </div>



  </>

}

