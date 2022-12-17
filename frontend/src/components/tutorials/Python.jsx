import React from 'react'

export default function Python() {
  return (
    <>
        <div style={{fontWeight:"bold"}}>please download python script <a>here</a></div>
        <div className='div'>Amber: python main.py --topfile XXX.prmtop --trajfile XXX.dcd -outputfile CA_traj.pdb</div>
        <div className='div'>Gromacs: python main.py --topfile XXX.tpr --trajfile XXX.xtc -outputfile CA_traj.pdb</div>
    </>
  )
}
