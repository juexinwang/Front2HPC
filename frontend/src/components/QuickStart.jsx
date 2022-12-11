import React, { useState } from 'react';
import { Button, message, Steps } from 'antd'
import flowchart from '../assets/imgs/chart.webp'
let intro=<div>
            <h2>Neural relational inference</h2>
            <h3>
            Neural relational inference to learn long-range allosteric interactions in proteins from molecular dynamics simulations
            </h3>
            <div>
            The process includes the system preparation of a ligand-binding complex or mutant protein structure with allostery (a), the MD simulation of a prepared allosteric system to obtain the trajectory with the dynamic 3D coordinates (b), the conventional analysis for the trajectory (c), and the sampling and training using the NRI model with two jointly trained components (d). In d, the NRI model consists of an encoder, which infers a factorized distribution qΦ(z|x) over the latent interactions based on the input trajectories and a decoder, which reconstructs the future trajectories of the dynamic systems given the latent graph learned from the encoder. Based on the MD trajectory, the NRI model formulates the protein allosteric process as a dynamic network of interacting residues. The interaction graph learned from this model is compared with the conventional analysis to better understand the allosteric pathway in the protein.
            </div>
            <img src={flowchart} alt="" style={{width:'500px'}}></img>
        </div>
let submit=<div>
            <h2>submit</h2>
            <div>Your Molecular dynamics trajectory should like this, only include CA atom of each residue</div>
            <div>We also provide a example trajectory </div>
            <div>how to prapare CA trajecory file</div>
        </div>
let result=<div>dasdsadasd</div>
const steps = [
  {
    title: 'Introduction',
    content: intro,
  },
  {
    title: 'Submit Trajectory',
    content: submit,
  },
  {
    title: 'Get Result',
    content: result,
  },
];

const QuickStart = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <h1 style={{fontSize:"bolder"}}>QuickStart</h1>
      <Steps current={current} items={items} />
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
      {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        
      </div>
    </>
  );
};

export default QuickStart