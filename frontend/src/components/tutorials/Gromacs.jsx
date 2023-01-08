import React from 'react'
import '../../assets/lesses/tutorial.less'
import { Button, Drawer,Tooltip } from 'antd';


export default function Gromacs() {
  return (
    <>
    <div >With GROMACS outputs, input gromacs built-in commands below:</div>
    <div className='div'>
    <div>$ gmx trjconv -f  <span>yourtraj.xtc</span> -s <span>yourtop.tpr</span> -o <span style={{color:"lightgreen"}}>ca_traj.pdb</span></div>
    </div>
    <div><span style={{color:"skyblue"}}>yourtraj.xtc</span> is your MD protein trajectory file, <span style={{color:"skyblue"}}>yourtop.tpr</span> is your topology file as the GROMACS outputs.</div>
    <div>The command line will generate the following to let you select a group:</div>
    <div className='div' >
            Select group for output<br/>
            Group     0 (         System) has xxxxx elements<br/>
            Group     1 (        Protein) has xxxxx elements<br/>
            Group     2 (      Protein-H) has  xxxx elements<br/>
            Group     3 (        C-alpha) has   xxx elements<br/>
            Group     4 (       Backbone) has  xxxx elements<br/>
            Group     5 (      MainChain) has  xxxx elements<br/>
            Group     6 (   MainChain+Cb) has  xxxx elements<br/>
            Group     7 (    MainChain+H) has  xxxx elements<br/>
            Group     8 (      SideChain) has  xxxx elements<br/>
            Group     9 (    SideChain-H) has  xxxx elements<br/>
            Group    10 (    Prot-Masses) has xxxxx elements<br/>
            Group    11 (    non-Protein) has xxxxx elements<br/>
            Group    12 (          Other) has    xx elements<br/>
            Group    13 (            UNK) has    xx elements<br/>
            Group    14 (          Water) has xxxxx elements<br/>
            Group    15 (            SOL) has xxxxx elements<br/>
            Group    16 (      non-Water) has xxxxx elements<br/>
            Group    17 ( Water_and_ions) has xxxxx elements<br/>
            Select a group: <span style={{backGroundColor:'white',color:"white"}}></span>
    </div>
    <div>Then it will notify you should select a group, type 3 to select Group 3 ( C-alpha ): </div>
    <div className='div'>Select a group: 3</div>
    <div>These commands will generate desired C-Alpha skeleton <span style={{color:"green"}}>ca_traj.pdb</span> as the NRIMD input.</div>
    
    </>
  )
}
