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


    def __init__(self,jobid,filename,params):
        self.jobid = jobid
        self.filepath = '/media/volume/sdb/jobs/files/'
        self.filename = filename #jobid_numresidues_nummodels.pdb #TODO
        self.params = params
        self.slurmDir = '/media/volume/sdb/jobs/slurmDir/'
        self.slurmHPCDir = '/N/u/soicwang/BigRed200/inputslurmDir/'
        self.inputHPCDir = '/N/u/soicwang/BigRed200/inputPDBDir/'    

    def generateSlurm(self):
        """ Generate slurm script for BigRed 200"""

        ## Find the appropriate params of number of reisdues and number of models
        words = self.filename.split('_')
        num_residues = words[1]
        num_models = words[2]

        slurmFileName = self.slurmDir + self.jobid+'.slurm'
        fileStr = '#!/bin/bash\n'\
        +'#SBATCH -J ' + self.jobid + '\n'\
        +'#SBATCH -p gpu\n'\
        +'#SBATCH -o ' + self.jobid + '_%j.txt\n'\
        +'#SBATCH -e ' + self.jobid + '_%j.err\n'\
        +'#SBATCH --nodes=1\n'\
        +'#SBATCH --gpus-per-node 1\n'\
        +'#SBATCH --time=24:00:00\n\n'\
        +'module load deeplearning\n'\
        # +'srun python convert_dataset.py\n' # validate input in the front end
        +'srun python preprocess_dataset.py' # Generate data in specific format at HPC

        fileStr = fileStr + ' --MDfolder ' + self.inputHPCDir
        + ' --inputFile ' + self.jobid+'.pdb' 
        + ' --datafolder '+ self.inputHPCDir + self.jobid + '/data/' #'/N/u/soicwang/BigRed200/inputPDBDir/1213AAAA/data/'

        ## Add params of preprocess_dataset.py
        fileStr = fileStr + ' --start ' + self.params['start']
        + ' --end ' + self.params['end']
        + ' --timestep-size ' + self.params['timestep_size']
        + ' --train-interval ' + self.params['train_interval']
        + ' --validate-interval ' + self.params['validate_interval']
        + ' --test-interval ' + self.params['test_interval']
        fileStr = fileStr + '\n'

        fileStr = fileStr + 'srun python main.py'
        ## Add params of main.py from input
        fileStr = fileStr + ' --jobid ' + self.jobid
        + ' --inputdir ' + self.inputHPCDir + self.jobid +'/data/' #/N/u/soicwang/BigRed200/inputPDBDir/1213AAAA/data/
        + ' --num-residues ' + num_residues
        + ' --timesteps ' + self.params['timestep_size']
        + ' --number-expstart ' + self.params['start']
        + ' --number-exp ' + self.params['end']
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

        ## 1. Change the corresponding files for submitting usage
        cmd = 'mv ' + self.filepath + self.filename + ' ' + self.filepath + self.jobid +'.pdb'
        os.system(cmd)
       
        ## 2. Generate slurm script
        self.generateSlurm()

        ## 3. Copy slurm script to HPC
        cmd =  'scp '+self.slurmDir+self.jobid+'.slurm soicwang@bigred200.uits.iu.edu:'+self.slurmHPCDir
        os.system(cmd)

        ## 4. Copy input to HPC
        cmd =  'scp -r '+self.filepath+self.jobid+'.pdb soicwang@bigred200.uits.iu.edu:'+self.inputHPCDir
        os.system(cmd)

        ## 5. Submit slurm script
        cmd = 'ssh soicwang@bigred200.uits.iu.edu sbatch '+self.inputHPCDir+self.jobid+'.slurm'
        os.system(cmd)

        ## Finished




