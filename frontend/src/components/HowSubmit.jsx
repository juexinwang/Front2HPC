import React, { useState } from 'react';
import { Menu,Drawer,Tabs } from 'antd';
import '../assets/lesses/submit.less'
import Gromacs from './tutorials/Gromacs';
import Amber from './tutorials/Amber';
import Namd from './tutorials/Namd';
import Vmd from './tutorials/Vmd';
import Python from './tutorials/Python';
import ExampleDrawer from './tutorials/ExampleDrawer';
import { Link } from 'react-router-dom';


const builtin =  [
    {
    label: 'Gromacs',
    key:'gromacs',
    children: <Gromacs/>,
    },
    {
    label: 'Amber',
    key:'amber',
    children: <Amber/>,
    },
    {
    label: (<p>Namd</p>),
    key:'namd',
    children: <Namd/>,
    },
]

const built =  <Tabs tabPosition='left' items={builtin}/>

const methods = [
    {label: 'Built-in commands of MD software', key: 'builtin',children: built},
    {label: 'VMD software', key: 'vmd',children: <Vmd/>},
    {label: 'Python script', key: 'python',children: <Python/>}
]

const items = new Array(3).fill(null).map((_, i) => {
    const id = String(i + 1);
    return {
      label: `Tab Title ${id}`,
      key: id,
      children: (
        <>
          <p>Content of Tab Pane {id}</p>
          <p>Content of Tab Pane {id}</p>
          <p>Content of Tab Pane {id}</p>
        </>
      ),
    };
  });
  const App = () => (
    <div className="card-container">
      <Tabs type="card" items={items} />
    </div>
  );
const HowSubmit = () => {
  return <>
    <h2>2.1 Prepare Trajectory</h2>
    <div>The input Molecular Dynamics trajectory should be like the SOD1 <ExampleDrawer/> with the Carbon-Alpha skeleton input, details in the previous <a href="https://www.nature.com/articles/s41467-022-29331-3">paper</a>. Take the results from molecular dynamics in <a href="https://www.cgl.ucsf.edu/chimera/docs/UsersGuide/tutorials/pdbintro.html">PDB format</a> time-series frames, each frame only includes Carbon-Alpha atom of each residue. </div>
    <div>The NRIMD input can be prepared from outputs of mainstream Molecular Dynamics software GROMACS, AMBER, and NAMD. We provide instructions using Built-in commands, VMD, and Customized python scripts as follows: </div>
    <br/>
    <div className="card-container">
        <Tabs type="card" items={methods} />
    </div>
    <h2>2.2 Submit</h2>
    <div>After obatin the input <span style={{color:"green"}}>ca_traj.pdb</span> in the designed format, go to <Link to='/submit'>submit</Link>.</div>
  </>
};
export default HowSubmit;


// const items = [
//     {
//     label: 'Built-in command of MD software',
//     key: 'bultin',
//     children: [
//         {
//         label: 'Gromacs',
//         key:'gromacs'
//         },
//         {
//         label: 'Amber',
//         key:'amber'
//         },
//         {
//         label: 'Namd',
//         key:'namd'
//         },
//     ],
//     },
//     {
//         label:'VMD software',
//         key: 'vmd',
//     },
//     {
//         label: 'Python script',
//         key: 'python',
//     },
// ];
// const shows = {
//     'gromacs': <Gromacs/>,
//     'amber': <Amber/>,
//     'namd': <Namd/>,
//     'vmd': <Vmd/>,
//     'python': <Python/>,
// }
// const HowSubmit = () => {
//     const [current, setCurrent] = useState('gromacs');
//     const onClick = (e) => {
//       console.log('click ', e);
//       setCurrent(e.key);
//     };
//     return <>
//       <h2>1. prepare trajectory</h2>
//       <div>Your should process molecular dynamics trajectory like <ExampleDrawer/>, only include CA atom of each residue</div>
//       <div>We provide 3 methods to prapare CA trajecory pdb file </div>
//       {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} theme={'light'} /> */}
//       {/* <div className="">{shows[current]}</div> */}
//     </>
//   };