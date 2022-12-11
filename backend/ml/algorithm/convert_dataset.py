import time
import numpy as np
from copy import deepcopy
from scipy import interpolate
import argparse 
class Convert:
    parser = argparse.ArgumentParser('Preprocessing: Generate training/validation/testing features from pdb')
    parser.add_argument('--MDfolder', type=str, default="ca_01.pdb",help='folder of pdb MD')
    parser.add_argument('--save-folder', type=str, default='ml/jobs/jobid/data',
                    help='Where to save numpy array, leave empty to not save anything.')                    
    parser.add_argument('--pdb_start', type=int, default="1",
                        help='select pdb file window from start, e.g. in tutorial it is ca_1.pdb')
    parser.add_argument('--pdb_end', type=int, default="56",
                        help='select pdb file window to end')
    parser.add_argument('--num_residues', type=int, default=77,
                        help='Number of residues of the MD pdb')
    parser.add_argument('--feature_size', type=int, default=6,
                        help='The number of features used in study( position (X,Y,Z) + velocity (X,Y,Z) ).')
    parser.add_argument('--train_interval', type=int, default=60,
                        help='intervals in trajectory in training')
    parser.add_argument('--validate_interval', type=int, default=60,
                        help='intervals in trajectory in validate')
    parser.add_argument('--test_interval', type=int, default=100,
                        help='intervals in trajectory in test')
    args = parser.parse_args(args=[])
    MDfolder = args.MDfolder
    save_folder =args.save_folder
    feature_size = args.feature_size
    num_residues = args.num_residues
    pdb_start = args.pdb_start
    pdb_end = args.pdb_end
    train_interval = args.train_interval
    validate_interval = args.validate_interval
    test_interval = args.test_interval

    def __init__(self, **arg):
        self.__dict__.update(arg)

    def read_feature_MD_file_slidingwindow(self,filename, timestep_size, feature_size, num_residues, interval, window_choose, aa_start, aa_end):
        # read single expriments of all time points
        feature = np.zeros((timestep_size, feature_size, num_residues))
        flag = False
        nflag = False
        modelNum = 0
        with open(filename) as f:
            lines = f.readlines()
            for line in lines:
                line = line.strip()
                words = line.split()
                if(line.startswith("MODEL")):
                    modelNum = int(words[1])
                    if (modelNum % interval == window_choose):
                        flag = True
                    if (modelNum % interval == (window_choose+1)):
                        nflag = True
                elif(line.startswith("ATOM") and words[2] == "CA" and int(words[4]) >= aa_start and int(words[4]) <= aa_end and flag):
                    numStep = int(modelNum/interval)
                    feature[numStep, 0, int(words[4])-aa_start] = float(words[5])
                    feature[numStep, 1, int(words[4])-aa_start] = float(words[6])
                    feature[numStep, 2, int(words[4])-aa_start] = float(words[7])
                elif(line.startswith("ATOM") and words[2] == "CA" and int(words[4]) >= aa_start and int(words[4]) <= aa_end and nflag):
                    numStep = int(modelNum/interval)
                    feature[numStep, 3, int(
                        words[4])-aa_start] = float(words[5])-feature[numStep, 0, int(words[4])-aa_start]
                    feature[numStep, 4, int(
                        words[4])-aa_start] = float(words[6])-feature[numStep, 1, int(words[4])-aa_start]
                    feature[numStep, 5, int(
                        words[4])-aa_start] = float(words[7])-feature[numStep, 2, int(words[4])-aa_start]
                elif(line.startswith("ENDMDL") and flag):
                    flag = False
                elif(line.startswith("ENDMDL") and nflag):
                    nflag = False
        f.close()
        # print(feature.shape)
        return feature


    def convert_dataset_md_single(self,MDfolder, startIndex, experiment_size, timestep_size, feature_size, num_residues, interval, pdb_start, pdb_end, aa_start, aa_end):
        """
        Convert in single md file in single skeleton
        """
        features = list()
        edges = list()
        for i in range(startIndex, experiment_size+1):
            print("Start: "+str(i)+"th PDB")
            for j in range(pdb_start, pdb_end+1):
                # print(str(i)+" "+str(j))
                features.append(Convert.read_feature_MD_file_slidingwindow(self,MDfolder
                    , timestep_size, feature_size, num_residues, interval, j, aa_start, aa_end))
                edges.append(np.zeros((num_residues, num_residues)))
        print("***")
        print(len(features))
        print("###")
        features = np.stack(features, axis=0)
        edges = np.stack(edges, axis=0)

        return features, edges
    def convert(self,MDfolder=MDfolder,feature_size=feature_size,num_residues=num_residues,pdb_start=pdb_start,
        pdb_end=pdb_end,train_interval=train_interval,validate_interval=validate_interval,test_interval=test_interval,
        save_folder=save_folder):
        # Generate training/validating/testing
        print("Generate Train")
        features, edges = Convert.convert_dataset_md_single(self,MDfolder=MDfolder, startIndex=1, experiment_size=1, timestep_size=50,
                                                    feature_size=feature_size, num_residues=num_residues, interval=train_interval, pdb_start=pdb_start, pdb_end=pdb_end, aa_start=1, aa_end=num_residues)

        np.save('{}/features.npy'.format(save_folder), features)
        np.save('{}/edges.npy'.format(save_folder), edges)


        print("Generate Valid")
        features_valid, edges_valid = Convert.convert_dataset_md_single(self,MDfolder=MDfolder, startIndex=1, experiment_size=1, timestep_size=50,
                                                                feature_size=feature_size, num_residues=num_residues, interval=validate_interval, pdb_start=pdb_start, pdb_end=pdb_end, aa_start=1, aa_end=num_residues)

        np.save('{}/features_valid.npy'.format(save_folder), features_valid)
        np.save('{}/edges_valid.npy'.format(save_folder), edges_valid)


        print("Generate Test")
        features_test, edges_test = Convert.convert_dataset_md_single(self,MDfolder=MDfolder, startIndex=1, experiment_size=1, timestep_size=50,
                                                            feature_size=feature_size, num_residues=num_residues, interval=test_interval, pdb_start=pdb_start, pdb_end=pdb_end, aa_start=1, aa_end=num_residues)
                                                            
        np.save('{}/features_test.npy'.format(save_folder), features_test)
        np.save('{}/edges_test.npy'.format(save_folder), edges_test)
