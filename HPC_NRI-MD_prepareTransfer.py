## Prepare a folder only for transfering
## It should located on the HPC

import sys,os,shutil

jobidList = []

# Read diff.txt
with open('diff.txt','r') as f:
    lines = f.readlines()
    for line in lines:
        line = line.strip()
        if line.startswith('>'):
            words = line.split()
            if words[3]=='gpu' and words[6]=='COMPLETED':
                jobidList.append(words[2])

# move according results to the folder
os.remove("my_file_path")
os.makedirs("my_file_path")
for jobid in jobidList:
    shutil.copy2("source_file_path", "destination_directory_path")