from BackJobsRunner import BackJobsRunner

## example of submit jobs from the front end, this is case2 of sod1 in NC paper

jobid = '0000AAAA'
filename = '0000AAAA_77_4500.pdb'
params={
    'start':1, # start from 1
    'end':96,  # start from 1
    'timestep_size':45,
    'train_interval':100,
    'validate_interval':120,
    'test_interval':150,
    'seed':42,
    'epochs':500,
    'lr':0.0005,
    'encoder_hidden':256,
    'decoder_hidden':256,
    'encoder':'mlp',
    'decoder':'rnn',
    'encoder_dropout':0.0,
    'decoder_dropout':0.0,
    'lr_decay':200,
    'gamma':0.5,
    'var':5e-5,
    # postanalysis_path.py
    'dist_threshold':12, # default is end-start+1
    'source_node':46, # start from 0
    'target_node':61, # start from 0
    # postanalysis_visual.py
    'threshold':0.5,
    #'domainInput':',',
    'domainInput':'b1_0_25,diml_25_29,disl_29_32,zl_32_43,b2_43_62,el_62_77,b3_72_77', # default: ',', # start from 0
}
bj = BackJobsRunner(jobid = jobid, filename = filename, params = params)
print('Submit:')
bj.submit()
print('Submit finished.')