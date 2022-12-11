## For submiting jobs from front-end in Django

import os

class BackJobsRunner:
    """ Basic Runner from the front-end, used for submit jobs
    
    All the params included:
    # preprocessing
    --start
    --end
    --timestep-size
    --train-interval
    --validate-interval
    --test-interval

    # main.py
    --seed
    --epochs
    --lr
    --encoder-hidden
    --decoder-hidden
    --encoder
    --decoder
    --encoder-dropout
    --decoder-dropout
    --lr-decay
    --gamma
    --var  
    """


    def __init__(self,jobid,filepath,filename,params):
        self.jobid = jobid
        self.filepath = filepath
        self.filename = filename
        self.params = params
        self.slurmDir = './'
        self.inputDir = './'
        self.slurmHPCDir = '/N/u/soicwang/BigRed200/inputslurm/'
        self.inputHPCDir = '/N/u/soicwang/BigRed200/inputDir/'

    def generateSlurm(self):
        """ Generate slurm script for BigRed 200"""

        slurmFileName = self.slurmDir + self.jobid+'.slurm'
        fileStr = '#!/bin/bash\n'
        +'#SBATCH -J '+self.jobid+'\n'
        +'#SBATCH -p gpu\n'
        +'#SBATCH -o '+self.jobid+'_%j.txt\n'
        +'#SBATCH -e '+self.jobid+'_%j.err\n'
        +'#SBATCH --nodes=1\n'
        +'#SBATCH --gpus-per-node 1\n'
        +'#SBATCH --time=24:00:00\n\n'
        +'module load deeplearning\n'
        # +'srun python convert_dataset.py\n' # validate input in the front end
        +'srun python preprocess_dataset.py' # Generate data in specific format at HPC

        fileStr = fileStr + ' --MDfolder '+self.inputHPCDir+self.jobid+'/input/'
        + ' --inputFile fixed.pdb' #TODO
        + ' --datafolder '+self.inputHPCDir+self.jobid+'/data/'

        ## Add params of preprocess_dataset.py
        fileStr = fileStr + ' --start ' + self.params['start']
        + ' --end ' + self.params['end']
        + ' --timestep-size ' + self.params['timestep_size']
        + ' --train-interval ' + self.params['train_interval']
        + ' --validate-interval ' + self.params['validate_interval']
        + ' --test-interval ' + self.params['test_interval']
        fileStr = fileStr + '\n'

        fileStr = fileStr + 'srun python main.py'
        ## Add params of main.py
        fileStr = fileStr + ' --seed ' + self.params['seed']
        + ' --epochs ' + self.params['epochs']
        + ' --lr ' + self.params['lr']
        + ' --encoder-hidden ' + self.params['encoder_hidden']
        + ' --decoder-hidden ' + self.params['decoder_hidden']
        + ' --encoder ' + self.params['encoder']
        + ' --decoder ' + self.params['decoder']
        + ' --encoder-dropout ' + self.params['encoder_dropout']
        + ' --decoder-dropout ' + self.params['decoder_dropout']
        + ' --lr-decay ' + self.params['lr_decay']
        + ' --gamma ' + self.params['gamma']
        + ' --var ' + self.params['var']
        fileStr = fileStr + '\n'        

        #num_residues = self.params['num_residues']

        with open(slurmFileName,'w') as fw:
            fw.write(fileStr)


    def submit(self):
        """ Main entrance of the work"""
       
        ## 1. Generate slurm script
        self.generateSlurm()

        ## 2. Copy slurm script to HPC
        cmd =  'scp '+self.slurmDir+self.jobid+'.slurm soicwang@bigred200.uits.iu.edu:'+self.slurmHPCDir
        os.system(cmd)

        ## 3. Copy input to HPC
        cmd =  'scp -r '+self.inputDir+self.jobid+'/ soicwang@bigred200.uits.iu.edu:'+self.inputHPCDir
        os.system(cmd)

        ## 4. Submit slurm script
        cmd = 'ssh soicwang@bigred200.uits.iu.edu sbatch '+self.inputHPCDir+self.jobid+'.slurm'
        os.system(cmd)

        ## Finished




