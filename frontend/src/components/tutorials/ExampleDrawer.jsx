import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { DownloadOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom'
import examplepdbimg from '../../assets/imgs/example.jpeg'
const ExampleDrawer = () => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const title = <>
                  <span style={{color:'black'}}>example ca_1.pdb</span> &emsp;
                  <a href='/api/download1/'><DownloadOutlined onClick={()=>{}}></DownloadOutlined></a>
                </>
  return (
    <>
      <a type="primary" onClick={showDrawer}>
        this example 
      </a>
      <Drawer title={title} placement="right" onClose={onClose} open={open} size={'large'}>
        <div>
          <img src={examplepdbimg} alt="" width={'130%'}></img>
        </div>
      </Drawer>
    </>
  );
};
export default ExampleDrawer