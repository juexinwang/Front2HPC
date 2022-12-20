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
    <h2>1 prepare trajectory</h2>
    <div>Your molecular dynamics trajectory should like <ExampleDrawer/>, every frame the protein only includes CA atom information of each residue and file needs to be in pdb format. </div>
    <div>We provide 3 methods below for praparing CA trajecory file in pdb format: </div>
    <br/>
    <div className="card-container">
        <Tabs type="card" items={methods} />
    </div>
    <h2>2 submit</h2>
    <div>then upload your prapared file <span style={{color:"green"}}>ca_traj.pdb</span> and submit, <Link to='/submit'>Go to submit</Link>.</div>
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