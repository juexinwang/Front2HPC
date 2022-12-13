## Put this into the root of the HPC under username of soicwang

# Check status
sacct -S 2022-12-13 -u soicwang > status_current.txt
diff status_old.txt status_current.txt > diff.txt
# Read and dealwith diff.txt
python HPC_NRI-MD_prepareTransfer.py
mv status_current.txt status_old.txt