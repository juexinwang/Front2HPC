import React from 'react'

export default function Python() {
  return (
    <>
        <div style={{fontWeight:"bold"}}>please download python script <a href='/api/download3/'>here</a></div>
        <div>Amber: </div>
        <div className='div'>python main.py --topfile yourtop.prmtop --trajfile yourtraj.dcd -outputfile CA_traj.pdb</div>
        <div>Gromacs: </div>
        <div className='div'>python main.py --topfile yourtop.tpr --trajfile yourtraj.xtc -outputfile CA_traj.pdb</div>
        <div>finally will generate <span style={{color:"green"}}>ca_traj.pdb</span></div>
    </>
  )
}
