import React from 'react'

export default function Vmd() {
  return (
    <div>
        <div style={{fontWeight:"bold"}}>please input vmd commands below</div>
        <div className='div'>
        pbc wrap -centersel "protein" -center com -compound residue -all<br/>
        set ref atomselect top backbone frame 0<br/>
        set sel atomselect 0 backbone<br/>
        set prot atomselect 0 protein<br/>
        set n molinfo 0 get numframes<br/>
        for  set i 0   $i &lt; &#36;n   incr i <br/>
        &nbsp; &#36; el frame $i<br/>
        &nbsp;$prot frame $i<br/>
        &nbsp;$prot move measure fit $sel $ref<br/>
        &nbsp;$prot writepdb ./$i.pdb<br/>
        quit
        </div>
    </div>
  )
}
