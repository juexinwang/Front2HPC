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
    label: (<Link to='/help'>Help Doc</Link>),
    icon: <FileOutlined />,
  },
]

export default function App() {

  return (
    <Layout className='totolLayout'>
      <header>
        <div className='logo'>NRI-MD</div>
        <div className='word'>Neural relational inference to learn long-range allosteric interactions in proteins from molecular dynamics simulations</div>
        <div className='contactus'><a>Contact us</a></div>
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
      <Footer  style={{textAlign: 'center',}}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  )
}


  // <Menu theme="dark"  mode="horizontal" items={items} className="Menu"/>