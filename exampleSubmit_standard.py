from BackJobsRunner import BackJobsRunner

## example of submit jobs from the front end, standard

jobid = '1213AAAB'
filename = '1213AAAB_77_3000.pdb'
params={
    'start':1, # start from 1
    'end':56,  # start from 1
    'timestep_size':50,
    'train_interval':60,
    'validate_interval':80,
    'test_interval':100,
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
    'threshold':0.6,
    'domainInput':'A_0_40,B_41_70,C_71_76', # default: ',', # start from 0
}
bj = BackJobsRunner(jobid = jobid, filename = filename, params = params)
print('Submit:')
bj.submit()
print('Submit finished.')