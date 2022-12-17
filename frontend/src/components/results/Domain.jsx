import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space,InputNumber } from 'antd';
import { setDomainApi} from '../../requests/api'
const Domain = () => {
  const submitDomain = async (domains) => {
    const res = await setDomainApi({ Domains: domains});
    console.log(res)
    // if () {
      
    // } else {
    // }
  }
  const onFinish = (values) => {
    console.log('Received values of form:', values);
    const arr=values.domain_arr
    // const req=obj.domain+'_'+obj.start+'_'+obj.end
    const domains = arr.map(obj => obj.domain+'_'+(obj.start-1)+'_'+(obj.end-1)).join(',')
    const visualThreshold = values.VisualThreshold
    const req={domains,visualThreshold}
    console.log(req)
    submitDomain(req)
  };
  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">

      <Form.Item name="VisualThreshold" label= "VisualThreshold" rules={[{type:"number" }]} extra="VisualThreshold">   
        <InputNumber defaultValue={12}  placeholder='Visual Threshold'/>
      </Form.Item>

      <Form.List name="domain_arr" >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{display: 'flex',marginBottom: 8}} align="baseline">                             
                <Form.Item {...restField} name={[name, 'domain']} rules={[{ required: true,message: 'Missing first name',},]} >
                  <Input placeholder="Domain name" />
                </Form.Item>
                <div style={{display:'flex'}}>
                <Form.Item {...restField} name={[name, 'start']} rules={[{ required: true, message: 'Missing last name',},  ]}>
                    <Input style={{width: 100,textAlign: 'center', }} placeholder="start index"/>
                </Form.Item>
                <Input className="site-input-split" style={{width: 30,borderLeft: 0,borderRight: 0,pointerEvents: 'none',marginBottom:'24px'}} placeholder="~" disabled/>
                <Form.Item {...restField} name={[name, 'end']} rules={[{ required: true, message: 'Missing last name',},  ]}>
                <Input  className="site-input-right"style={{width: 100,textAlign: 'center',}} placeholder="end index" />
                </Form.Item>
                </div>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item style={{width:"100%"}}>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add domain
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">Submit </Button>
      </Form.Item>

    </Form>
  );
};
export default Domain;