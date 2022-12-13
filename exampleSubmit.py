from BackJobsRunner import BackJobsRunner

## example of submit jobs

jobid = '1213AAAA'
filename = '1213AAAA_77_3000.pdb'
params={
    'start':1,
    'end':56,
    'timestep_size':50,
    'train_interval':60,
    'validate_interval':80,
    'test_interval':100,
    'seed':42,
    'epochs':10,
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
}
bj = BackJobsRunner(jobid = '1213AAAA', filename = '1213AAAA_77_3000.pdb',params = params)
print('Submit:')
bj.submit()
print('Submit finished.')