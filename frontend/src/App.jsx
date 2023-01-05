import React from 'react'
import { Button } from 'antd';
import './assets/lesses/base.less'
// import logoImg from './assets/imgs/logo.png'
import { Outlet,Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu} from 'antd';
import { SearchOutlined, PlusOutlined,FileOutlined,UnorderedListOutlined,DownloadOutlined} from '@ant-design/icons';
import BreadCrumb from './components/BreadCrumb';

const { Header, Sider,Content, Footer } = Layout;

const items = [
  {
    label: (<Link to='/intro'>Introduction</Link>),
    icon: <UnorderedListOutlined />,
  },
  {
    label: (<Link to='/submit'>Submit Job</Link>),
    icon: <PlusOutlined />,
  },
  {
    label: (<Link to='/result'>Get Result</Link>),
    icon: <SearchOutlined />,
  },
  {
    label: (<Link to='/example'>Example Explanation</Link>),
    icon: <FileOutlined />,
  },
  {
    label: (<Link to='/help'>User Guide</Link>),
    icon: <FileOutlined />,
  },
]

export default function App() {

  return (
    <Layout className='totolLayout'>
      <header>
        <div className='logo'><Link to='/intro' style={{color:'aqua'}}>NRIMD</Link></div>
        <span className='word'><Link to='/intro' style={{color:'whitesmoke'}}>a web server for analyzing long-range interactions in proteins from molecular dynamics simulations</Link></span>
        <div className='contactus'><Link to='/contact'>Contact us</Link></div>
      </header>
      <Layout className='midLayout'>
        <Sider width={250} >
            <Menu className='Menu' mode="inline" defaultSelectedKeys={['1']} items={items}/>
        </Sider>
        <Content className='Content'>
          <BreadCrumb className="BreadCrumb"/>
          <div className="siteLayoutContent">
            <Outlet/>
          </div>
        </Content> 
      </Layout> 
      <Footer  style={{textAlign: 'center',}}><b>Citation:</b> Zhu, J., Wang, J., Han, W., & Xu, D. (2022). Neural relational inference to learn long-range allosteric interactions in proteins from molecular dynamics simulations. Nature communications, 13(1), 1-16.<br/>
        NRIMD ©2022 Created by Yi He</Footer>
    </Layout>
  )
}


  // <Menu theme="dark"  mode="horizontal" items={items} className="Menu"/>