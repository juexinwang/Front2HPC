import React, {useEffect} from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space,InputNumber } from 'antd';
import { setVisualApi} from '../../requests/api'
import { useParams } from 'react-router-dom';
const Domain = (props) => {
  const {id} = useParams()
  const [form] = Form.useForm()

    useEffect(()=>{
      console.log(props.results.domain);
      if(props.results.domains !==undefined){
        if(props.results.domains !== ','){
          console.log('domains',props.results.domains);
          let dmarr =props.results.domains.split(',').map(dm_s_e => {return {'domain':dm_s_e.split('_')[0],'start':Number(dm_s_e.split('_')[1])+1,'end':Number(dm_s_e.split('_')[2])+1}})
        
          form.setFieldsValue({
            domain_arr: dmarr
          })
         }
      }
  },[props.results.domains])


  const submitVisual = async (domains) => {
    console.log('domains',domains.domains.split(','));
    const res = await setVisualApi({ Domains: domains});
    props.setResults({...props.results,'imgs':{...props.results.imgs,"edges_domain":res.file_data.edges_domain},'domain':domains.domains})
  }

  const onFinish = (values) => {
    const arr=values.domain_arr
    // const req=obj.domain+'_'+obj.start+'_'+obj.end
    const domains = arr.map(obj => obj.domain+'_'+(obj.start-1)+'_'+(obj.end-1)).join(',')
    const visualThreshold = values.visualThreshold
    const JobId = id
    const req={domains,visualThreshold,JobId}
    submitVisual(req)
  };


  return (
    <>
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" form={form}>

    <Form.Item name="visualThreshold" label= "Visualization Threshold" rules={[{type:"number",required:true }]} >   
        <InputNumber placeholder='0.6'/>
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
                      <Input style={{width: 95,textAlign: 'center', }} placeholder="start index"/>
                  </Form.Item>
                  
                  <Input className="site-input-split" style={{width: 30,borderLeft: 0,borderRight: 0,pointerEvents: 'none',marginBottom:'24px'}} placeholder="~" disabled/>

                  <Form.Item {...restField} name={[name, 'end']} rules={[{ required: true, message: 'Missing last name',},  ]}>
                    <Input  className="site-input-right"style={{width: 95,textAlign: 'center',}} placeholder="end index" />
                  </Form.Item>
                </div>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item style={{width:"100%",textAlign:'center'}}>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add domain
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">Change </Button>
      </Form.Item>
    </Form>
    </>
  );
};
export default Domain;