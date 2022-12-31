import seaborn as sns
import matplotlib.pyplot as plt
plt.switch_backend('agg')
import numpy as np
import pandas as pd
import os
import argparse

class AnalysisVisual:
    parser = argparse.ArgumentParser(
        'Visualize the distribution of learned edges between residues.')
    parser.add_argument('--save-folder', type=str, default='ml/jobs/jobid',
                        help='Where to save the trained model, leave empty to not save anything.')
    parser.add_argument('--num-residues', type=int, default=77,
                        help='Number of residues of the PDB.')
    parser.add_argument('--windowsize', type=int, default=56,
                        help='window size')
    parser.add_argument('--threshold', type=float, default=0.6,
                        help='threshold for plotting')
    parser.add_argument('--dist-threshold', type=int, default=12,
                        help='threshold for shortest distance')
    # parser.add_argument('--trainfile-path', type=str, default='ml/jobs/jobid/logs/out_probs_train.npy',
    #                     help='File name of the probs file.')
    args = parser.parse_args(args=[])
    save_folder=args.save_folder
    threshold=args.threshold
    num_residues=args.num_residues
    windowsize=args.windowsize
    dist_threshold=args.dist_threshold

    def getEdgeResults(self,thresholdB,threshold,trainfile_path,num_residues,windowsize):
        a = np.load(trainfile_path)
        b = a[:, :, 1]
        c = a[:, :, 2]
        d = a[:, :, 3]

        # There are four types of edges, eliminate the first type as the non-edge
        probs = b+c+d
        # For default residue number 77, residueR2 = 77*(77-1)=5852
        residueR2 = num_residues*(num_residues-1)
        probs = np.reshape(probs, (windowsize, residueR2))

        # Calculate the occurence of edges
        edges_train = probs/windowsize

        results = np.zeros((residueR2))
        for i in range(windowsize):
            results = results+edges_train[i, :]

        if thresholdB:
            # threshold, default 0.6
            index = results < (threshold)
            results[index] = 0

        # Calculate prob for figures
        edges_results = np.zeros((num_residues, num_residues))
        count = 0
        for i in range(num_residues):
            for j in range(num_residues):
                if not i == j:
                    edges_results[i, j] = results[count]
                    count += 1
                else:
                    edges_results[i, j] = 0

        return edges_results


    def getDomainEdges(self,edges_results, domainName):

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

    def visual(self,
    save_folder=save_folder,
    threshold=threshold,
    num_residues=num_residues,
    windowsize=windowsize):
        trainfile_path=save_folder+'/logs/out_probs_train.npy'
        # Load distribution of learned edges
        edges_results_visual = AnalysisVisual.getEdgeResults(self,thresholdB=True,threshold=threshold,trainfile_path=trainfile_path,num_residues=num_residues,windowsize=windowsize)
        # Step 1: Visualize results
        labels=np.arange(1,edges_results_visual.shape[0]+1)
        df = pd.DataFrame(edges_results_visual)
        df.index = labels
        df.columns = labels
        ax = sns.heatmap(df, linewidth=0.5,cmap="Blues", vmax=1.0, vmin=0.0)
        ax.set_xlabel('Residues')
        ax.set_ylabel('Residues')
        ax.set_title('Heatmap of the Inferred Interactions')
        plt.savefig('{}/analysis/probs.png'.format(save_folder), dpi=600)
        # plt.show()
        plt.close()

        # Step 2: Get domain specific results
        # According to the distribution of learned edges between residues, we integrated adjacent residues as blocks for a more straightforward observation of the interactions.
        # For example, the residues in SOD1 structure are divided into seven domains (β1, diml, disl, zl, β2, el, β3).

        edges_results = AnalysisVisual.getEdgeResults(self,thresholdB=False,threshold=threshold,trainfile_path=trainfile_path,num_residues=num_residues,windowsize=windowsize)
        # SOD1 specific:
        b1 = AnalysisVisual.getDomainEdges(self,edges_results, 'b1')
        diml = AnalysisVisual.getDomainEdges(self,edges_results, 'diml')
        disl = AnalysisVisual.getDomainEdges(self,edges_results, 'disl')
        zl = AnalysisVisual.getDomainEdges(self,edges_results, 'zl')
        b2 = AnalysisVisual.getDomainEdges(self,edges_results, 'b2')
        el = AnalysisVisual.getDomainEdges(self,edges_results, 'el')
        b3 = AnalysisVisual.getDomainEdges(self,edges_results, 'b3')
        edges_results = np.vstack((b1, diml, disl, zl, b2, el, b3))
        # print(edges_results)
        edges_results_T = edges_results.T
        index = edges_results_T < (threshold)
        edges_results_T[index] = 0

        # Visualize
        ax = sns.heatmap(edges_results_T, linewidth=1,
                        cmap="Blues", vmax=1.0, vmin=0.0)
        labels=np.arange(1,8)
        ax.set_xticklabels(labels)
        ax.set_yticklabels(labels)
        ax.set_xlabel('Domains')
        ax.set_ylabel('Domains')
        ax.set_title('Heatmap of the Inferred Interactions between Domains')
        plt.savefig('{}/analysis/edges_domain.png'.format(save_folder), dpi=600)
        # plt.show()
        plt.close()
