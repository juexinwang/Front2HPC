## Put this into the HPC: Carbonate as the backup

# Check status from yesterday
ttime=$(date -d "yesterday 13:00 " '+%Y-%m-%d')
sacct -S $ttime -u soicwang > status_current.txt
# sacct -S 2023-04-06 -u soicwang > status_current.txt
diff status_old.txt status_current.txt > diff.txt
# Read and dealwith diff.txt
python3 /N/u/soicwang/Carbonate/projects/Front2HPC/HPC_NRI-MD_prepareTransfer_Carbonate.py
mv status_current.txt status_old.txt