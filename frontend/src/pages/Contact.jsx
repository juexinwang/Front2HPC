import React from 'react';
import { Avatar, List } from 'antd';
const names = [
  {
    title: 'Yi He',
    description: 'heyi21@mails.jlu.edu.cn, Jilin University',
    content: '', 
    avatar: <Avatar src="" />,
  },
  {
    title: 'Shuai Zeng',
    description: '@missouri.edu, Missouri University',
    content: '', 
    avatar: <Avatar src="" />,
  },
  // {
  //   title: 'Dong Xu',
  //   description: 'xudong@missouri.edu, Missouri University',
  //   content: '', 
  //   avatar: <Avatar src="" />,
  // },
  // {
  //   title: 'Weiwei Han',
  //   description: 'weiweihan@jlu.edu.cn, Jilin University',
  //   content: '', 
  //   avatar: <Avatar src="" />,
  // },
  {
    title: 'Juexin Wang',
    description: 'wangjuex@iu.edu, Indiana University',
    content: '', 
    avatar: <Avatar src="" />,
  },
];
const App = () => (
  <List
    itemLayout="horizontal"
    dataSource={names}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          avatar={item.avatar}
          title={item.title}
          description={item.description}
        />
        {item.content}
      </List.Item>
    )}
  />
);
export default App;
