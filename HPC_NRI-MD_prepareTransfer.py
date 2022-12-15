## Prepare a folder only for transfering
## It should located on the root of the HPC under username of soicwang

import sys,os,shutil

##################### 
# Params setting
#
# Only change here if needed
#####################

transferDir = "/N/u/soicwang/BigRed200/transfer/"
resultsDir = "/N/u/soicwang/BigRed200/projects/NRI-MD/logs/"

jobidList = []

# Read diff.txt, find all finished jobs at jobid
with open('diff.txt','r') as f:
    lines = f.readlines()
    for line in lines:
        line = line.strip()
        if line.startswith('>'):
            words = line.split()
            if words[3]=='gpu' and words[6]=='COMPLETED':
                jobidList.append(words[2])

# if jobidList not eq to 0, then move according results to the folder
if not len(jobidList) == 0:
    if os.path.exists(transferDir):
        shutil.rmtree(transferDir)
    else:
        os.makedirs(transferDir)
    for jobid in jobidList:
        shutil.copytree(resultsDir+jobid+'/', transferDir+jobid+'/')
    # shutil.rmtree(transferDir)
# if jobidList eq to 0, then move according results to the folder
else:
    if os.path.exists(transferDir):
        shutil.rmtree(transferDir)