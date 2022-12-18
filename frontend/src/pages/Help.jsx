import React, { useEffect,Tag } from 'react'
import Node from '../components/results/Node';
import Domain from '../components/results/Domain';
import Status from '../components/results/Status';
// import A from './A';

export default function Help() {
  return <div>    <h1>linux</h1>
  <h2>gromacs</h2>
  <div></div>
  <h2>amber</h2>
  <h2>namd</h2>
  <h1>windows</h1>
  <h2>VMD</h2>
  <div style={{width:"50%"}}>
  <Node/>
  <Domain/>
  {/* <A/> */}
  {/* {
  Status(data)} */}
  </div>

  </div>;
}

