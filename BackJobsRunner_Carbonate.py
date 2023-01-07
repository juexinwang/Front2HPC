## For submiting jobs from front-end in Django
## Carbonate as the backup

import os

class BackJobsRunner_Carbonate:
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
        self.slurmHPCDir = '/N/u/soicwang/Carbonate/inputslurmDir/'
        self.inputHPCDir = '/N/u/soicwang/Carbonate/inputPDBDir/'
        self.codeDir = '/N/u/soicwang/Carbonate/projects/NRI-MD/'    

    def generateSlurm(self):
        """ Generate slurm script for Carbonate"""

        ## Find the appropriate params of number of reisdues and number of models
        words = self.filename.split('_')
        num_residues = words[1]
        num_models = words[2]

        slurmFileName = self.slurmDir + self.jobid+'.slurm'
        fileStr = '#!/bin/bash\n'\
                '#SBATCH -J ' + self.jobid + '\n'\
                '#SBATCH -p gpu\n'\
                '#SBATCH -o ' + self.jobid + '_%j.txt\n'\
                '#SBATCH -e ' + self.jobid + '_%j.err\n'\
                '#SBATCH --nodes=1\n'\
                '#SBATCH --account r00086\n'\
                '#SBATCH --gpus-per-node v100:1\n'\
                '#SBATCH --time=24:00:00\n\n'\
                'module load deeplearning\n'\
                'echo Start at `date`\n'\
                'srun python ' + self.codeDir + 'preprocess_dataset.py' # Generate data in specific format at HPC

        fileStr = fileStr + ' --MDfolder ' + self.inputHPCDir\
        + ' --inputFile ' + self.jobid+'.pdb' \
        + ' --datafolder '+ self.inputHPCDir + self.jobid + '/data/' #'/N/u/soicwang/Carbonate/inputPDBDir/1213AAAA/data/'

        ## Add params of preprocess_dataset.py
        fileStr = fileStr + ' --start ' + str(self.params['start'])\
        + ' --end ' + str(self.params['end'])\
        + ' --timestep-size ' + str(self.params['timestep_size'])\
        + ' --train-interval ' + str(self.params['train_interval'])\
        + ' --validate-interval ' + str(self.params['validate_interval'])\
        + ' --test-interval ' + str(self.params['test_interval'])
        fileStr = fileStr + '\n'

        fileStr = fileStr + 'srun python ' + self.codeDir + 'main.py'
        ## Add params of main.py from input
        #inputdir: /N/u/soicwang/Carbonate/inputPDBDir/1213AAAA/data/
        fileStr = fileStr + ' --jobid ' + self.jobid \
        + ' --inputdir ' + self.inputHPCDir + self.jobid +'/data/' \
        + ' --num-residues ' + num_residues \
        + ' --timesteps ' + str(self.params['timestep_size']) \
        + ' --number-expstart ' + str(int(self.params['start'])-1) \
        + ' --number-exp ' + str(self.params['end']) \
        ## Add params of main.py

        fileStr = fileStr + ' --seed ' + str(self.params['seed'])\
        + ' --epochs ' + str(self.params['epochs'])\
        + ' --lr ' + str(self.params['lr'])\
        + ' --encoder-hidden ' + str(self.params['encoder_hidden'])\
        + ' --decoder-hidden ' + str(self.params['decoder_hidden'])\
        + ' --encoder ' + str(self.params['encoder'])\
        + ' --decoder ' + str(self.params['decoder'])\
        + ' --encoder-dropout ' + str(self.params['encoder_dropout'])\
        + ' --decoder-dropout ' + str(self.params['decoder_dropout'])\
        + ' --lr-decay ' + str(self.params['lr_decay'])\
        + ' --gamma ' + str(self.params['gamma'])\
        + ' --var ' + str(self.params['var'])
        fileStr = fileStr + '\n'        

        fileStr = fileStr + 'srun python ' + self.codeDir + 'postanalysis_path.py'\
        + ' --num-residues ' + num_residues \
        + ' --windowsize ' + str(int(self.params['end'])-int(str(self.params['start']))+1) \
        + ' --filename ' + self.codeDir + 'logs/' + self.jobid + '/logs/out_probs_train.npy' \
        + ' --PDBfilename ' + self.inputHPCDir + self.jobid + '.pdb' \
        + ' --outputDir ' + self.codeDir + 'logs/' + self.jobid + '/analysis/' \

        # filename: '/N/u/soicwang/Carbonate/projects/NRI-MD/logs/1213AAAA/logs/out_probs_train.npy'
        # PDBfilename: '/N/u/soicwang/Carbonate/inputPDBDir/1213AAAA.pdb'
        # outputfilename: '/N/u/soicwang/Carbonate/projects/NRI-MD/logs/1213AAAA/analysis/paths.txt'

        fileStr = fileStr + ' --dist-threshold ' + str(self.params['dist_threshold'])\
        + ' --source-node ' + str(self.params['source_node'])\
        + ' --target-node ' + str(self.params['target_node'])
        fileStr = fileStr + '\n'

        fileStr = fileStr + 'srun python ' + self.codeDir + 'postanalysis_visual.py'\
        + ' --num-residues ' + num_residues \
        + ' --windowsize ' + str(int(self.params['end'])-int(str(self.params['start']))+1) \
        + ' --fileDir ' + self.codeDir + 'logs/' + self.jobid + '/logs/' \
        + ' --outputDir ' + self.codeDir + 'logs/' + self.jobid + '/analysis/' \

        # fileDir: '/N/u/soicwang/Carbonate/projects/NRI-MD/logs/1213AAAA/logs/'
        # outputDir: '/N/u/soicwang/Carbonate/projects/NRI-MD/logs/1213AAAA/analysis/'

        fileStr = fileStr + ' --dist-threshold ' + str(self.params['dist_threshold'])\
        + ' --threshold ' + str(self.params['threshold'])\
        + ' --domainInput ' + str(self.params['domainInput'])
        fileStr = fileStr + '\n'
        fileStr = fileStr + 'echo End at `date`\n'\

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
        cmd =  'scp '+self.slurmDir+self.jobid+'.slurm soicwang@carbonate.uits.iu.edu:'+self.slurmHPCDir
        os.system(cmd)
        print(cmd)

        ## 4. Copy input to HPC
        cmd =  'scp -r '+self.filepath+self.jobid+'.pdb soicwang@carbonate.uits.iu.edu:'+self.inputHPCDir
        os.system(cmd)
        print(cmd)

        ## 5. Submit slurm script
        cmd = 'ssh soicwang@carbonate.uits.iu.edu sbatch '+self.slurmHPCDir+self.jobid+'.slurm'
        os.system(cmd)
        print(cmd)

        ## Finished




