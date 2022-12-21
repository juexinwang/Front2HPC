## Put this into the HPC

# Check status
sacct -S 2022-12-21 -u soicwang > status_current.txt
diff status_old.txt status_current.txt > diff.txt
# Read and dealwith diff.txt
python3 /N/u/soicwang/BigRed200/projects/Front2HPC/HPC_NRI-MD_prepareTransfer.py
mv status_current.txt status_old.txt