## Use cron in linux of front end
#
# Check cron jobs
# crontab -l
#
# Edit cron jobs
# crontab -e
# 1. Every 5 minutes to check the status. (NRI-MD_daemon_communication.py)
# */5 * * * * /home/exouser/anaconda3/bin/python /home/exouser/NRIproject/Front2HPC/NRI-MD_daemon_communication.py >> ~/daemonlog.txt 2>&1
#
# 2. Delete results in 14 days
# find /path/to/directory/ -mindepth 1 -mtime +14 -delete
## Check: find /path/to/directory/ -mindepth 1 -mtime +14 -depth -print
#

import datetime,os
# print ('Test')

##################### 
# Params setting
#
# Only change here if needed
#####################
transferDir = "/N/u/soicwang/BigRed200/transfer/"
targetDir = '/media/volume/sdb/jobs/jobs/'
deployedDir = '/N/u/soicwang/BigRed200/projects/Front2HPC/'


# main
# Check the status of the jobs
cmd = 'ssh soicwang@bigred200.uits.iu.edu bash '+ deployedDir +'HPC_NRI-MD_check.sh'
os.system(cmd)
# Debug:
print(datetime.datetime.now())
print(cmd)

# Copy the files from HPC to the frontend
cmd =  'scp -r soicwang@bigred200.uits.iu.edu:'+transferDir+' '+targetDir
os.system(cmd)
# Debug:
print(datetime.datetime.now())
print(cmd)

# Update the sql?
#TODO by Yi He
