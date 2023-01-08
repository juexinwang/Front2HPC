import React from 'react'

export default function Amber() {
  return (
    <>
    <div>With AMBER outputs, input AMBER built-in commands below:</div>
    <div className='div'>
      <div>$ cpptraj</div>
      <div>&gt;parm yourtop.prmtop </div>
      <div>&gt;trajin yourtraj.dcd</div>
      <div>&gt;strip !@CA</div>
      <div>&gt;trajout ca_traj.pdb noter</div>
      <div>&gt;run</div>
      <div>&gt;quit</div>
    </div>
    <div>These commands will generate desired C-Alpha skeleton <span style={{color:"green"}}>ca_traj.pdb</span> as the NRIMD input.</div>
    </>
    
  )
}
