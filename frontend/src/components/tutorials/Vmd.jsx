
import v1 from '../../assets/imgs/vmd1-2.png'
import v2 from '../../assets/imgs/vmd3-4-5.png'
import v3 from '../../assets/imgs/vmd6-7.png'
import v4 from '../../assets/imgs/vmd8-9-10.png'
import v5 from '../../assets/imgs/vmd11-12.png'
import v6 from '../../assets/imgs/vmd13.png'
import v7 from '../../assets/imgs/vmd14.png'
import React from 'react'
import { Divider, Radio, Typography } from 'antd';
const { Paragraph } = Typography;

export default function Vmd() {
  return (
    <div>
        <div style={{fontWeight:"bold"}}>Please follow the steps.</div>
        <div>First upload your trajecory file:</div>
        <img src={v1} style={{border:'3px solid #000'}}></img>
        <img src={v2} style={{border:'3px solid #000'}}></img>
        <div>Next upload your topology file: </div>
        <img src={v3} style={{border:'3px solid #000'}}></img>
        <img src={v4} style={{border:'3px solid #000'}}></img>
        <div>Then open TK console:</div>
        <img src={v5} style={{border:'3px solid #000'}}></img>
        <div><img src={v6} style={{border:'3px solid #000'}}></img></div>
        <div>Input commands below (you can copy and paste):</div>
        <div className='div'>
        {/* pbc wrap -centersel "protein" -center com -compound residue -all<br/>
        set ref atomselect top backbone frame 0<br/>
        set sel atomselect 0 backbone<br/>
        set prot atomselect 0 protein<br/>
        set n molinfo 0 get numframes<br/>
        for  set i 0   $i &lt; &#36;n   incr i <br/>
        &nbsp; &#36; el frame $i<br/>
        &nbsp;$prot frame $i<br/>
        &nbsp;$prot move measure fit $sel $ref<br/>
        &nbsp;$prot writepdb ./$i.pdb<br/>
        quit */}
          set fp [open "ca_traj.pdb" w+]<br/>
          set n [molinfo 0 get numframes]<br/>
          for &#123; set i 0 &#125; &#123; &#36;i &lt; &#36;n &#125; &#123; incr i &#125; &#123;<br/>
          &emsp;&emsp;set cas [atomselect top "name CA" frame $i]<br/>
          &emsp;&emsp;$cas writepdb ./$i.pdb<br/>
          &emsp;&emsp;set pdbinfo [open $i.pdb r]<br/>
          &emsp;&emsp;set str [read $pdbinfo]<br/>
          &emsp;&emsp;close $pdbinfo<br/>
          &emsp;&emsp;file delete $i.pdb<br/>
          &emsp;&emsp;set noX_str [string map &#123;X ""&#125; $str ]<br/>
          &emsp;&emsp;set noXelb_str [string trimright $noX_str "\n"]<br/>
          &emsp;&emsp;set CRYSTindex [string first "CRYST" $noXelb_str ]<br/>
          &emsp;&emsp;set lbindex [string first "\n" $noXelb_str ]<br/>
          &emsp;&emsp;set framepdb [string replace $noXelb_str $CRYSTindex $lbindex ""]<br/>
          &emsp;&emsp;set frameindex  [expr $i + 1] <br/>
          &emsp;&emsp;puts $fp "MODEL $frameindex"<br/>
          &emsp;&emsp;puts $fp $framepdb<br/>
          &#125;<br/>
          close $fp<br/>
        </div>
        <div>These commands will generate desired C-Alpha skeleton <span style={{color:"green"}}>ca_traj.pdb</span> as the NRIMD input in your corresponding VMD folder.</div>
        <img src={v7} style={{border:'3px solid #000'}}></img>
    </div>
  )
}
