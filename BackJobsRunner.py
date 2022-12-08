import sys,resource,os

class BackJobsRunner:
    """ Basic Runner from the front-end """

    def __init__(self,jobid,filepath,filename,params):
        self.jobid = jobid
        self.filepath = filepath
        self.filename = filename
        self.params = params
        self.slurmFolder = './'

    def generateSlurm(self):
        """ Generate slurm script for BigRed 200"""

        slurmFileName = self.slurmFolder + self.jobid+'.slurm'
        fileStr = '#!/bin/bash\n'
        +'#SBATCH -J '+self.jobid+'\n'
        +'#SBATCH -p gpu\n'
        +'#SBATCH -o '+self.jobid+'_%j.txt\n'
        +'#SBATCH -e '+self.jobid+'_%j.err\n'
        +'#SBATCH --nodes=1\n'
        +'#SBATCH --gpus-per-node 1\n'
        +'#SBATCH --time=24:00:00\n\n'
        +'module load deeplearning\n'
        +'srun python convert_dataset.py\n'
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

        hpcFolder = '/N/u/soicwang/BigRed200/NRI-MDtransfer/'
        ## 1. Generate slurm script
        self.generateSlurm()

        ## 2. Copy slurm script to HPC
        cmd =  'scp '+self.slurmFolder+self.jobid+'.slurm soicwang@bigred200.uits.iu.edu:'+hpcFolder
        os.system(cmd)

        ## 3. Copy input to HPC
        cmd =  'scp '+self.slurmFolder+self.jobid+'.pdb soicwang@bigred200.uits.iu.edu:'+hpcFolder
        os.system(cmd)

        ## 4. Submit slurm script
        cmd = 'ssh soicwang@bigred200.uits.iu.edu sbatch '+hpcFolder+self.jobid+'.slurm'
        os.system(cmd)

        ## Finished




