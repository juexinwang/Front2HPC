import argparse

parser = argparse.ArgumentParser('Preprocessing: Generate training/validation/testing features from pdb')
parser.add_argument('--MDfolder', type=str, default="./",
                    help='folder of pdb MD')
parser.add_argument('--inputFile', type=str, default="ca_1.pdb",
                    help='inputFile name')
args = parser.parse_args()


def validate_param(MDfolder, inputFile):
    '''Validate params, should work in the front end'''

    num_residues = 100000
    oriResiNum = -1
    totalModelNum = 0

    with open(MDfolder+inputFile) as f:
        lines = f.readlines()
        for line in lines:
            line = line.strip()
            words = line.split()
            if(line.startswith("MODEL")):
                modelNum = int(words[1])
                totalModelNum = modelNum
                if modelNum == 1:
                    # Do nothing
                    pass                    
                else:
                    oriResiNum = -1
                    if modelNum == 2:
                        num_residues = resiNum
                    else:
                        if not resiNum == num_residues:
                            print('Model error exists in the input:'+str(modelNum))
            elif(line.startswith("ATOM") and words[2] == "CA"):
                resiNum = int(words[1])
                if resiNum > num_residues or resiNum <= oriResiNum:
                    print('Residue error exists in the input model:'+str(modelNum))
                    return
                else:
                    oriResiNum = resiNum
    return num_residues, totalModelNum


MDfolder = args.MDfolder
inputFile = args.inputFile


## Validate
num_residues, totalModelNum = validate_param(MDfolder, inputFile)
print('Num of residues:'+str(num_residues)+'\t Num of models:'+str(totalModelNum))


