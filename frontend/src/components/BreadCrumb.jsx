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
                setbreadName('submit job');
                break;
            case '/cookies':
                setbreadName('cookies');
                break;
            case '/result':
                setbreadName('check result');
                break;
            case '/help':
                setbreadName('user guide');
                break;            
            case '/intro':
                setbreadName('introduction');
                break; 
            case '/':
                setbreadName('introduction');
                break; 
            case '/contact':
                setbreadName('contact us');
                break; 
            case '/example':
                setbreadName('example explanation');
                break;
            default:
                setbreadName('get result');                                                                   
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
