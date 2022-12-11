# Front2HPC
Scripts connecting between front-end in VM and back-end in HPC


# kernel:
URL of slurm

[https://kb.iu.edu/d/awrz](https://kb.iu.edu/d/awrz)

[https://kb.iu.edu/d/avjk](https://kb.iu.edu/d/avjk)

++++++++++++++++++++++++++

#!/bin/bash

#SBATCH -J job_name

#SBATCH -p gpu

#SBATCH -o filename_%j.txt

#SBATCH -e filename_%j.err

#SBATCH --nodes=1

#SBATCH --gpus-per-node 1

#SBATCH --time=02:00:00

#Load any modules that your program needs

module load deeplearning

#Run your program

srun python main.py

+++++++++++++++++++++++

ssh [soicwang@bigred200.uits.iu.edu](mailto:soicwang@bigred200.uits.iu.edu)

scp t1.slurm [soicwang@bigred200.uits.iu.edu](mailto:soicwang@bigred200.uits.iu.edu):~/t1

ssh [soicwang@bigred200.uits.iu.edu](mailto:soicwang@bigred200.uits.iu.edu) sbatch /N/u/soicwang/BigRed200/t1/t1.slurm





# concept

class backJobsRunner():
    filepath 
    filename
    jobid
    def submit():
        return


bjr = backJobsRunner()
bjr.setfilepath('')
bjr.set
...
bjr.submit()


# speperate progam
while(true):
    resultsBJ= bjr.getresultsBJ()
    system.sleep(60)


resultsBJ.getMatrix(jobid)
resultsBJ.getImage(jobid)
resultsBJ.getPaths(jobid) #dict

# output directory



# interaction
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