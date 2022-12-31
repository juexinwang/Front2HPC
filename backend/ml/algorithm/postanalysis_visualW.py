import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import os
import argparse

class AnalysisVisualInResult():
    parser = argparse.ArgumentParser(
        'Visualize the distribution of learned edges between residues. Running on both backend and frontend')
    parser.add_argument('--num-residues', type=int, default=77,
                        help='Number of residues of the PDB.')
    parser.add_argument('--windowsize', type=int, default=56,
                        help='window size')
    parser.add_argument('--threshold', type=float, default=0.6,
                        help='threshold for plotting')
    parser.add_argument('--dist-threshold', type=int, default=12,
                        help='threshold for shortest distance')
    parser.add_argument('--fileDir', type=str, default='/N/u/soicwang/BigRed200/projects/NRI-MD/logs/1213AAAA/logs/',
                        help='File name of the probs file.')
    parser.add_argument('--outputDir', type=str, default='/N/u/soicwang/BigRed200/projects/NRI-MD/logs/1213AAAA/analysis/',
                        help='File of shortest path from source to targets')
    parser.add_argument('--domainInput', type=str, default='domainA_1_10,domainB_11_20,domainC_21_77',
                        help='Set domain, only calculate domain information if domainInput has information ')
    args = parser.parse_args(args=[])


    def __init__(self,
            num_residues=args.num_residues,
            windowsize=args.windowsize,
            threshold=args.threshold,
            dist_threshold=args.dist_threshold,
            fileDir=args.fileDir,
            outputDir=args.outputDir,
            domainInput=args.domainInput,
                ):
        self.num_residues=num_residues
        self.windowsize=windowsize
        self.threshold=threshold
        self.dist_threshold=dist_threshold
        self.fileDir=fileDir
        self.outputDir=outputDir
        self.domainInput=domainInput


    def getEdgeResults(self,threshold=False):
        a = np.load(self.fileDir+'out_probs_train.npy')
        b = a[:, :, 1]
        c = a[:, :, 2]
        d = a[:, :, 3]

        # There are four types of edges, eliminate the first type as the non-edge
        probs = b+c+d
        # For default residue number 77, residueR2 = 77*(77-1)=5852
        residueR2 = self.num_residues*(self.num_residues-1)
        probs = np.reshape(probs, (self.windowsize, residueR2))

        # Calculate the occurence of edges
        edges_train = probs/self.windowsize

        results = np.zeros((residueR2))
        for i in range(self.windowsize):
            results = results+edges_train[i, :]

        if threshold:
            # threshold, default 0.6
            index = results < (self.threshold)
            results[index] = 0

        # Calculate prob for figures
        edges_results = np.zeros((self.num_residues, self.num_residues))
        count = 0
        for i in range(self.num_residues):
            for j in range(self.num_residues):
                if not i == j:
                    edges_results[i, j] = results[count]
                    count += 1
                else:
                    edges_results[i, j] = 0

        return edges_results


    def getDomainEdgesSpec(self,edges_results, domainName):
        '''For SOD1 study, not use any more
        '''

        if domainName == 'b1':
            startLoc = 0
            endLoc = 25
        elif domainName == 'diml':
            startLoc = 25
            endLoc = 29
        elif domainName == 'disl':
            startLoc = 29
            endLoc = 32
        elif domainName == 'zl':
            startLoc = 32
            endLoc = 43
        elif domainName == 'b2':
            startLoc = 43
            endLoc = 62
        elif domainName == 'el':
            startLoc = 62
            endLoc = 72
        elif domainName == 'b3':
            startLoc = 72
            endLoc = 77

        edges_results_b1 = edges_results[:25, startLoc:endLoc]
        edges_results_diml = edges_results[25:29, startLoc:endLoc]
        edges_results_disl = edges_results[29:32, startLoc:endLoc]
        edges_results_zl = edges_results[32:43, startLoc:endLoc]
        edges_results_b2 = edges_results[43:62, startLoc:endLoc]
        edges_results_el = edges_results[62:72, startLoc:endLoc]
        edges_results_b3 = edges_results[72:-1, startLoc:endLoc]

        edge_num_b1 = edges_results_b1.sum(axis=0)
        edge_num_diml = edges_results_diml.sum(axis=0)
        edge_num_disl = edges_results_disl.sum(axis=0)
        edge_num_zl = edges_results_zl.sum(axis=0)
        edge_num_b2 = edges_results_b2.sum(axis=0)
        edge_num_el = edges_results_el.sum(axis=0)
        edge_num_b3 = edges_results_b3.sum(axis=0)

        if domainName == 'b1':
            edge_average_b1 = 0
        else:
            edge_average_b1 = edge_num_b1.sum(axis=0)/(25*(endLoc-startLoc))
        if domainName == 'diml':
            edge_average_diml = 0
        else:
            edge_average_diml = edge_num_diml.sum(axis=0)/(4*(endLoc-startLoc))
        if domainName == 'disl':
            edge_average_disl = 0
        else:
            edge_average_disl = edge_num_disl.sum(axis=0)/(3*(endLoc-startLoc))
        if domainName == 'zl':
            edge_average_zl = 0
        else:
            edge_average_zl = edge_num_zl.sum(axis=0)/(11*(endLoc-startLoc))
        if domainName == 'b2':
            edge_average_b2 = 0
        else:
            edge_average_b2 = edge_num_b2.sum(axis=0)/(19*(endLoc-startLoc))
        if domainName == 'el':
            edge_average_el = 0
        else:
            edge_average_el = edge_num_el.sum(axis=0)/(10*(endLoc-startLoc))
        if domainName == 'b3':
            edge_average_b3 = 0
        else:
            edge_average_b3 = edge_num_b3.sum(axis=0)/(6*(endLoc-startLoc))

        edges_to_all = np.hstack((edge_average_b1, edge_average_diml, edge_average_disl,
                                edge_average_zl, edge_average_b2, edge_average_el, edge_average_b3))
        return edges_to_all


    def getDomainEdges(self,edges_results, domainName,startLocDict,endLocDict,domainNameList):

        startLoc = startLocDict[domainName]
        endLoc = endLocDict[domainName]

        edge_num_List = []
        for domain in domainNameList:
            edge_num_List.append(edges_results[startLocDict[domain]:endLocDict[domain]+1, startLoc:endLoc].sum(axis=0))

        edge_average_List = []
        count = 0
        for domain in domainNameList:
            if domain == domainName:
                edge_average_List.append(0)
            else:
                edge_average_List.append(edge_num_List[count].sum(axis=0)/((int(endLocDict[domain]-startLocDict[domain])+1)*(endLoc-startLoc)))
            count += 1

        edges_to_all = np.hstack(edge_average_List)
        return edges_to_all

    def compute(self):
        if not os.path.exists(self.outputDir):
            os.makedirs(self.outputDir)
        out_file = self.outputDir+'probs.png'

        # Load distribution of learned edges
        edges_results_visual = self.getEdgeResults(threshold=True)
        # Step 1: Visualize results
        ax = sns.heatmap(edges_results_visual, linewidth=0.5,cmap="Blues", vmax=1.0, vmin=0.0)
        labels=np.arange(1,edges_results_visual.shape[0]+1)
        ax.set_xticks(labels)
        ax.set_yticks(labels)
        # ax.set_xticklabels(labels)
        # ax.set_yticklabels(labels)
        ax.set_xlabel('Residues')
        ax.set_ylabel('Residues')
        ax.set_title('Heatmap of the Inferred Interactions')
        # plt.tight_layout(pad=0, w_pad=0, h_pad=0)
        plt.savefig(out_file, dpi=600)
        # plt.show()
        plt.close()

        imgpaths = []
        imgpaths.append(self.outputDir+'probs.png')
        # Step 2: Get domain specific results
        # Ad hoc usage in original study
        # According to the distribution of learned edges between residues, we integrated adjacent residues as blocks for a more straightforward observation of the interactions.
        # For example, the residues in SOD1 structure are divided into seven domains (β1, diml, disl, zl, β2, el, β3).
        # Here we used web server version of the domain calculation
        ##

        if not self.domainInput == ',':
            edges_results = self.getEdgeResults(threshold=False)
            ################# Ad hoc solution #######
            # SOD1 specific:
            # b1 = getDomainEdgesSpec(edges_results, 'b1')
            # diml = getDomainEdgesSpec(edges_results, 'diml')
            # disl = getDomainEdgesSpec(edges_results, 'disl')
            # zl = getDomainEdgesSpec(edges_results, 'zl')
            # b2 = getDomainEdgesSpec(edges_results, 'b2')
            # el = getDomainEdgesSpec(edges_results, 'el')
            # b3 = getDomainEdgesSpec(edges_results, 'b3')
            # edges_results = np.vstack((b1, diml, disl, zl, b2, el, b3))
            # print(edges_results)
            #########################################

            startLocDict = {}
            endLocDict = {}
            domainList = self.domainInput.split(',')
            domainNameList = []
            for domainInfo in domainList:
                words = domainInfo.split('_')
                startLocDict[words[0]]=int(words[1])
                endLocDict[words[0]]=int(words[2])
                domainNameList.append(words[0])

            tlist = []
            for domain in domainNameList:
                tlist.append(self.getDomainEdges(edges_results, domain,startLocDict,endLocDict,domainNameList))
            edges_results = np.vstack(tlist)

            edges_results_T = edges_results.T
            index = edges_results_T < (self.threshold)
            edges_results_T[index] = 0

            # Visualize
            ax = sns.heatmap(edges_results_T, linewidth=1,
                            cmap="Blues", vmax=1.0, vmin=0.0)
            labels=domainNameList
            ax.set_xticklabels(labels)
            ax.set_yticklabels(labels)
            ax.set_xlabel('Domains')
            ax.set_ylabel('Domains')
            ax.set_title('Heatmap of the Inferred Interactions between Domains')
            plt.savefig(self.outputDir+'edges_domain.png', dpi=600)
            # plt.show()
            plt.close()
            imgpaths.append(self.outputDir+'edges_domain.png')
        print(imgpaths)
        return imgpaths
