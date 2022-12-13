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

# move according results to the folder
if os.path.exists(transferDir):
    os.rmdir(transferDir)
else:
    os.makedirs(transferDir)
for jobid in jobidList:
    shutil.copy2(resultsDir+jobid+'/', transferDir)