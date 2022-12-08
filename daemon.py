## Use cron in linux
#
# Check cron jobs
# crontab -l
# Edit cron jobs, 1. Every 5 minutes to check the status. 2. Delete results in 14 days
# crontab -e
#

import sys,os

def __main_():
    # print ('Test')

    # Check the status of the jobs
    cmd = 'ssh soicwang@bigred200.uits.iu.edu shell HPC_NRI-MD_check.sh'
    os.system(cmd)

    # Copy the files from HPC to the frontend
    cmd =  'scp soicwang@bigred200.uits.iu.edu:sourcefolder target'
    os.system(cmd)

    # Update the sql?
    #TODO
