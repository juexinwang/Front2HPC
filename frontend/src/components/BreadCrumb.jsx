import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import React from 'react'
import { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function BreadCrumb() {
    const {pathname} = useLocation()
    const [breadName,setbreadName] = useState('')
    useEffect(()=>{
        switch(pathname){
            case '/submit':
                setbreadName('submit');
                break;
            case '/result':
                setbreadName('result');
                break;
            case '/help':
                setbreadName('help');
                break;            
            case '/intro':
                setbreadName('intro');
                break; 
        }
    },[pathname])
  return (
    <Breadcrumb>
    <Breadcrumb.Item href="/intro">
      <HomeOutlined />
    </Breadcrumb.Item>
    <Breadcrumb.Item href={pathname}>{breadName}</Breadcrumb.Item>
  </Breadcrumb>
  )
}
