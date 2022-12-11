## Use cron in linux
#
# Check cron jobs
# crontab -l
#
# Edit cron jobs
# crontab -e
# 1. Every 5 minutes to check the status. (NRI-MD_daemon_communication.py)
#
# 2. Delete results in 14 days
# find /path/to/directory/ -mindepth 1 -mtime +14 -delete
## Check: find /path/to/directory/ -mindepth 1 -mtime +14 -depth -print
#

import sys,os
# print ('Test')

##################### 
# Params setting
#
# Only change here if needed
#####################
transferDir = "/N/u/soicwang/BigRed200/transfer/"
targetDir = '~/results/'


# main
# Check the status of the jobs
cmd = 'ssh soicwang@bigred200.uits.iu.edu shell HPC_NRI-MD_check.sh'
os.system(cmd)

# Copy the files from HPC to the frontend
cmd =  'scp -r soicwang@bigred200.uits.iu.edu:'+transferDir+' '+targetDir
os.system(cmd)

# Update the sql?
#TODO by Yi He
