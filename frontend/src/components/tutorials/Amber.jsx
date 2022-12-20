import React from 'react'

export default function Amber() {
  return (
    <>
    <div>please input amber built-in commands below:</div>
    <div className='div'>
      <div>$ cpptraj</div>
      <div>&gt;parm yourtop.prmtop </div>
      <div>&gt;trajin yourtraj.dcd</div>
      <div>&gt;strip !@CA</div>
      <div>&gt;trajout ca_traj.pdb noter</div>
      <div>&gt;run</div>
      <div>&gt;quit</div>
    </div>
    <div>finally will generate <span style={{color:"green"}}>ca_traj.pdb</span>.</div>
    </>
    
  )
}
