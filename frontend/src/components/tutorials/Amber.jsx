import React from 'react'

export default function Amber() {
  return (
    <>
    <div>please input amber built-in commands below:</div>
    <div className='div'>
    <div>$ cpptraj</div>
    <div>&gt;parm XXX.prmtop </div>
    <div>&gt;trajin XXX.dcd</div>
    <div>&gt;strip !@CA</div>
    <div>&gt;trajout CA_traj.pdb noter</div>
    <div>&gt;run</div>
    <div>&gt;quit</div>
    </div>
    </>
    
  )
}
