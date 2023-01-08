import React from 'react'

export default function Python() {
  return (
    <>
        <div style={{fontWeight:"bold"}}>Please download python script <a href='/api/download3/'>here</a></div>
        <div>AMBER: </div>
        <div className='div'>python main.py --topfile yourtop.prmtop --trajfile yourtraj.dcd -outputfile CA_traj.pdb</div>
        <div>GROMACS: </div>
        <div className='div'>python main.py --topfile yourtop.tpr --trajfile yourtraj.xtc -outputfile CA_traj.pdb</div>
        <div>This script will generate desired C-Alpha skeleton <span style={{color:"green"}}>ca_traj.pdb</span> as the NRIMD input.</div>
    </>
  )
}
