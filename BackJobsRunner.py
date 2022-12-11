## For submiting jobs from front-end in Django

import os

class BackJobsRunner:
    """ Basic Runner from the front-end, used for submit jobs"""

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
        +'srun python preprocess_dataset.py\n' # Generate data in specific format at HPC
        +'srun python main.py '

        # Add params
        epochs = self.params['epochs']
        num_residues = self.params['num_residues']

        fileStr = fileStr + '--epochs '+epochs +' --num-residues ' + num_residues
        fileStr = fileStr + '\n'

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




