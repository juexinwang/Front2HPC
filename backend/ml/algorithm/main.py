import time
import argparse
import pickle
import os
import datetime
import torch
import torch.optim as optim
from torch.optim import lr_scheduler
from ml.algorithm.utils import *
from ml.algorithm.modules import *

class Compute:
    parser = argparse.ArgumentParser(
        'Neral relational inference for molecular dynamics simulations')
    parser.add_argument('--num-residues', type=int, default=77,
                        help='Number of residues of the PDB.')
    parser.add_argument('--save-folder', type=str, default='ml/jobs/jobid/logs',
                        help='Where to save the trained model, leave empty to not save anything.')
    parser.add_argument('--dataset-folder', type=str, default='ml/jobs/jobid',
                        help='Where to save file, leave empty to not save anything.')
    parser.add_argument('--load-folder', type=str, default='',
                        help='Where to load the trained model if finetunning. ' +
                            'Leave empty to train from scratch')
    parser.add_argument('--edge-types', type=int, default=4,
                        help='The number of edge types to infer.')
    parser.add_argument('--dims', type=int, default=6,
                        help='The number of input dimensions used in study( position (X,Y,Z) + velocity (X,Y,Z) ). ')
    parser.add_argument('--timesteps', type=int, default=50,
                        help='The number of time steps per sample. Actually is 50')
    parser.add_argument('--prediction-steps', type=int, default=1, metavar='N',
                        help='Num steps to predict before re-using teacher forcing.')
    parser.add_argument('--no-cuda', action='store_true', default=False,
                        help='Disables CUDA training.')
    parser.add_argument('--seed', type=int, default=42, help='Random seed.')
    parser.add_argument('--epochs', type=int, default=500,
                        help='Number of epochs to train.')
    parser.add_argument('--batch-size', type=int, default=1,
                        help='Number of samples per batch.')
    parser.add_argument('--lr', type=float, default=0.0005,
                        help='Initial learning rate.')
    parser.add_argument('--encoder-hidden', type=int, default=256,
                        help='Number of hidden units in encoder.')
    parser.add_argument('--decoder-hidden', type=int, default=256,
                        help='Number of hidden units in decoder.')
    parser.add_argument('--temp', type=float, default=0.5,
                        help='Temperature for Gumbel softmax.')
    parser.add_argument('--encoder', type=str, default='mlp',
                        help='Type of path encoder model (mlp or cnn).')
    parser.add_argument('--decoder', type=str, default='rnn',
                        help='Type of decoder model (mlp, rnn, or sim).')
    parser.add_argument('--no-factor', action='store_true', default=False,
                        help='Disables factor graph model.')
    parser.add_argument('--encoder-dropout', type=float, default=0.0,
                        help='Dropout rate (1 - keep probability) in encoder.')
    parser.add_argument('--decoder-dropout', type=float, default=0.0,
                        help='Dropout rate (1 - keep probability) in decoder.')
    parser.add_argument('--lr-decay', type=int, default=200,
                        help='After how epochs to decay LR by a factor of gamma.')
    parser.add_argument('--gamma', type=float, default=0.5,
                        help='LR decay factor.')
    parser.add_argument('--skip-first', action='store_true', default=True,
                        help='Skip first edge type in decoder, i.e. it represents no-edge.')
    parser.add_argument('--var', type=float, default=5e-5,
                        help='Output variance.')
    parser.add_argument('--hard', action='store_true', default=True,
                        help='Uses discrete samples in training forward pass.')
    parser.add_argument('--prior', action='store_true', default=True,
                        help='Whether to use sparsity prior.')
    parser.add_argument('--dynamic-graph', action='store_true', default=True,
                        help='Whether test with dynamically re-computed graph.')
    parser.add_argument('--number-expstart', type=int, default=0,
                        help='start number of experiments.')
    parser.add_argument('--number-exp', type=int, default=56,
                        help='number of experiments.')
    args = parser.parse_args(args=[])
    num_residues = args.num_residues
    save_folder = args.save_folder
    dataset_folder = args.dataset_folder
    load_folder = args.load_folder
    edge_types = args.edge_types
    dims = args.dims
    timesteps = args.timesteps
    prediction_steps = args.prediction_steps
    no_cuda = args.no_cuda
    seed = args.seed
    epochs = args.epochs
    batch_size = args.batch_size
    lr = args.lr
    encoder_hidden = args.encoder_hidden
    decoder_hidden = args.decoder_hidden
    temp  = args.temp
    args_encoder = args.encoder
    args_decoder =args.decoder
    no_factor = args.no_factor
    encoder_dropout =args.encoder_dropout
    decoder_dropout = args.decoder_dropout
    lr_decay =args.lr_decay
    gamma =args.gamma
    skip_first = args.skip_first
    var =args.var
    hard =args.hard
    args_prior = args.prior
    dynamic_graph = args.dynamic_graph
    number_expstart = args.number_expstart
    number_exp = args.number_exp

    args.cuda = not no_cuda and torch.cuda.is_available()
    cuda  = args.cuda
    args.factor = not no_factor
    factor = args.factor
    # print all arguments
    # print(args)

    def compute(self,seed=seed,
    cuda=cuda,
    dynamic_graph=dynamic_graph,
    save_folder=save_folder,
    args=args,
    dataset_folder=dataset_folder,
    batch_size=batch_size,
    number_exp=number_exp,
    number_expstart=number_expstart,
    dims=dims,
    num_residues=num_residues,
    args_encoder=args_encoder,
    args_decoder=args_decoder,
    timesteps=timesteps,
    encoder_hidden=encoder_hidden,
    edge_types=edge_types,
    encoder_dropout=encoder_dropout,
    factor=factor,
    decoder_hidden=decoder_hidden,
    decoder_dropout=decoder_dropout,
    skip_first=skip_first,
    load_folder=load_folder,
    gamma=gamma,
    lr_decay=lr_decay,
    lr=lr,
    args_prior=args_prior,
    epochs=epochs,
    temp=temp,
    hard=hard,
    prediction_steps=prediction_steps,
    var=var,):
        np.random.seed(seed)
        torch.manual_seed(seed)

        if cuda:
            torch.cuda.manual_seed(seed)

        if dynamic_graph:
            print("Testing with dynamically re-computed graph.")

        # Save model and meta-data. Always saves in a new sub-folder.
        if save_folder:
            exp_counter = 0
            now = datetime.datetime.now()
            timestamp = now.isoformat()
            save_folder = save_folder+'/'
            if not os.path.isdir(save_folder):
                os.mkdir(save_folder)
            meta_file = os.path.join(save_folder, 'metadata.pkl')
            encoder_file = os.path.join(save_folder, 'encoder.pt')
            decoder_file = os.path.join(save_folder, 'decoder.pt')

            log_file = os.path.join(save_folder, 'log.txt')
            log = open(log_file, 'w')

            pickle.dump({'args': args}, open(meta_file, "wb"))
        else:
            print("WARNING: No save_folder provided!" +
                "Testing (within this script) will throw an error.")

        # load data
        train_loader, valid_loader, test_loader, loc_max, loc_min, vel_max, vel_min = load_dataset_train_valid_test(
            dataset_folder, batch_size, number_exp, number_expstart, dims)


        # Generate off-diagonal interaction graph
        off_diag = np.ones([num_residues, num_residues]
                        ) - np.eye(num_residues)

        rel_rec = np.array(encode_onehot(np.where(off_diag)[1]), dtype=np.float32)
        rel_send = np.array(encode_onehot(np.where(off_diag)[0]), dtype=np.float32)
        rel_rec = torch.FloatTensor(rel_rec)
        rel_send = torch.FloatTensor(rel_send)

        if args_encoder == 'mlp':
            encoder = MLPEncoder(timesteps * dims, encoder_hidden,
                                edge_types,
                                encoder_dropout, factor)
        elif args_encoder == 'cnn':
            encoder = CNNEncoder(dims, encoder_hidden,
                                edge_types,
                                encoder_dropout, factor)

        if args_decoder == 'mlp':
            decoder = MLPDecoder(n_in_node=dims,
                                edge_types=edge_types,
                                msg_hid=decoder_hidden,
                                msg_out=decoder_hidden,
                                n_hid=decoder_hidden,
                                do_prob=decoder_dropout,
                                skip_first=skip_first)
        elif args_decoder == 'rnn':
            decoder = RNNDecoder(n_in_node=dims,
                                edge_types=edge_types,
                                n_hid=decoder_hidden,
                                do_prob=decoder_dropout,
                                skip_first=skip_first)
        elif args_decoder == 'sim':
            decoder = SimulationDecoder(
                loc_max, loc_min, vel_max, vel_min, args.suffix)

        if load_folder:
            encoder_file = os.path.join(load_folder, 'encoder.pt')
            encoder.load_state_dict(torch.load(encoder_file))
            decoder_file = os.path.join(load_folder, 'decoder.pt')
            decoder.load_state_dict(torch.load(decoder_file))
            save_folder = False

        optimizer = optim.Adam(list(encoder.parameters()) + list(decoder.parameters()),
                            lr=lr)
        scheduler = lr_scheduler.StepLR(optimizer, step_size=lr_decay,
                                        gamma=gamma)

        # Linear indices of an upper triangular mx, used for acc calculation
        triu_indices = get_triu_offdiag_indices(num_residues)
        tril_indices = get_tril_offdiag_indices(num_residues)

        if args_prior:
            prior = np.array([0.91, 0.03, 0.03, 0.03])  # TODO: hard coded for now
            print("Using prior")
            print(prior)
            log_prior = torch.FloatTensor(np.log(prior))
            log_prior = torch.unsqueeze(log_prior, 0)
            log_prior = torch.unsqueeze(log_prior, 0)
            log_prior = Variable(log_prior)

            if cuda:
                log_prior = log_prior.cuda()

        if cuda:
            encoder.cuda()
            decoder.cuda()
            rel_rec = rel_rec.cuda()
            rel_send = rel_send.cuda()
            triu_indices = triu_indices.cuda()
            tril_indices = tril_indices.cuda()

        rel_rec = Variable(rel_rec)
        rel_send = Variable(rel_send)

            # Train model
        print("Start Training...")
        t_total = time.time()
        best_val_loss = np.inf
        best_epoch = 0
        for epoch in range(epochs):
            # encoder, decoder, edges_train, probs_train, val_loss = Compute.train(self,epoch, best_val_loss)
            t = time.time()
            nll_train = []
            acc_train = []
            kl_train = []
            mse_train = []
            edges_train = []
            probs_train = []

            encoder.train()
            decoder.train()

            for batch_idx, (data, relations) in enumerate(train_loader):

                if cuda:
                    data, relations = data.cuda(), relations.cuda()
                data, relations = Variable(data), Variable(relations)

                optimizer.zero_grad()

                logits = encoder(data, rel_rec, rel_send)
                edges = gumbel_softmax(logits, tau=temp, hard=hard)
                prob = my_softmax(logits, -1)

                if decoder == 'rnn':
                    output = decoder(data, edges, rel_rec, rel_send, 50,
                                    burn_in=True,
                                    burn_in_steps=timesteps - prediction_steps)
                else:
                    output = decoder(data, edges, rel_rec, rel_send,
                                    prediction_steps)

                target = data[:, :, 1:, :]

                loss_nll = nll_gaussian(output, target, var)

                if args_prior:
                    loss_kl = kl_categorical(prob, log_prior, num_residues)
                else:
                    loss_kl = kl_categorical_uniform(prob, num_residues,
                                                    edge_types)

                loss = loss_nll + loss_kl

                acc = edge_accuracy(logits, relations)
                acc_train.append(acc)

                loss.backward()
                optimizer.step()

                mse_train.append(F.mse_loss(output, target).item())
                nll_train.append(loss_nll.item())
                kl_train.append(loss_kl.item())
                _, edges_t = edges.max(-1)
                edges_train.append(edges_t.data.cpu().numpy())
                probs_train.append(prob.data.cpu().numpy())

            scheduler.step()
            nll_val = []
            acc_val = []
            kl_val = []
            mse_val = []

            encoder.eval()
            decoder.eval()

            for batch_idx, (data, relations) in enumerate(valid_loader):
                if cuda:
                    data, relations = data.cuda(), relations.cuda()
                with torch.no_grad():

                    logits = encoder(data, rel_rec, rel_send)
                    edges = gumbel_softmax(logits, tau=temp, hard=True)
                    prob = my_softmax(logits, -1)

                    # validation output uses teacher forcing
                    output = decoder(data, edges, rel_rec, rel_send, 1)

                    target = data[:, :, 1:, :]
                    loss_nll = nll_gaussian(output, target, var)
                    loss_kl = kl_categorical_uniform(
                        prob, num_residues, edge_types)

                acc = edge_accuracy(logits, relations)
                acc_val.append(acc)

                mse_val.append(F.mse_loss(output, target).item())
                nll_val.append(loss_nll.item())
                kl_val.append(loss_kl.item())

            print('Epoch: {:04d}'.format(epoch),
                'nll_train: {:.10f}'.format(np.mean(np.array(nll_train))),
                'kl_train: {:.10f}'.format(np.mean(np.array(kl_train))),
                'mse_train: {:.10f}'.format(np.mean(np.array(mse_train))),
                'acc_train: {:.10f}'.format(np.mean(np.array(acc_train))),
                'nll_val: {:.10f}'.format(np.mean(np.array(nll_val))),
                'kl_val: {:.10f}'.format(np.mean(np.array(kl_val))),
                'mse_val: {:.10f}'.format(np.mean(np.array(mse_val))),
                'acc_val: {:.10f}'.format(np.mean(np.array(acc_val))),
                'time: {:.4f}s'.format(time.time() - t))
            edges_train = np.concatenate(edges_train)
            probs_train = np.concatenate(probs_train)
            if save_folder and np.mean(np.array(nll_val)) < best_val_loss:
                torch.save(encoder.state_dict(), encoder_file)
                torch.save(decoder.state_dict(), decoder_file)
                print('Best model so far, saving...')
                print('Epoch: {:04d}'.format(epoch),
                    'nll_train: {:.10f}'.format(np.mean(np.array(nll_train))),
                    'kl_train: {:.10f}'.format(np.mean(np.array(kl_train))),
                    'mse_train: {:.10f}'.format(np.mean(np.array(mse_train))),
                    'acc_train: {:.10f}'.format(np.mean(np.array(acc_train))),
                    'nll_val: {:.10f}'.format(np.mean(np.array(nll_val))),
                    'kl_val: {:.10f}'.format(np.mean(np.array(kl_val))),
                    'mse_val: {:.10f}'.format(np.mean(np.array(mse_val))),
                    'acc_val: {:.10f}'.format(np.mean(np.array(acc_val))),
                    'time: {:.4f}s'.format(time.time() - t), file=log)
                log.flush()
                val_loss = np.mean(np.array(nll_val))    
            
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                best_epoch = epoch
        np.save(str(save_folder)+'/out_edges_train.npy', edges_train)
        np.save(str(save_folder)+'/out_probs_train.npy', probs_train)
        print("Optimization Finished!")
        print("Best Epoch: {:04d}".format(best_epoch))
        if save_folder:
            print("Best Epoch: {:04d}".format(best_epoch), file=log)
            log.flush()

        # Test
        # edges_test, probs_test = Compute.test()
        acc_test = []
        nll_test = []
        kl_test = []
        mse_test = []
        edges_test = []
        probs_test = []
        tot_mse = 0
        counter = 0

        encoder.eval()
        decoder.eval()
        encoder.load_state_dict(torch.load(encoder_file))
        decoder.load_state_dict(torch.load(decoder_file))

        for batch_idx, (data, relations) in enumerate(test_loader):
            if cuda:
                data, relations = data.cuda(), relations.cuda()

            with torch.no_grad():
                #        assert (data.size(2) - args.timesteps) >= args.timesteps
                assert (data.size(2)) >= timesteps

                data_encoder = data[:, :, :timesteps, :].contiguous()
                data_decoder = data[:, :, -timesteps:, :].contiguous()

                logits = encoder(data_encoder, rel_rec, rel_send)
                edges = gumbel_softmax(logits, tau=temp, hard=True)

                prob = my_softmax(logits, -1)

                output = decoder(data_decoder, edges, rel_rec, rel_send, 1)

                target = data_decoder[:, :, 1:, :]
                loss_nll = nll_gaussian(output, target, var)
                loss_kl = kl_categorical_uniform(
                    prob, num_residues, edge_types)

                acc = edge_accuracy(logits, relations)
                acc_test.append(acc)

                mse_test.append(F.mse_loss(output, target).item())
                nll_test.append(loss_nll.item())
                kl_test.append(loss_kl.item())
                _, edges_t = edges.max(-1)
                edges_test.append(edges_t.data.cpu().numpy())
                probs_test.append(prob.data.cpu().numpy())

                # For plotting purposes
                if decoder == 'rnn':
                    if dynamic_graph:
                        output = decoder(data, edges, rel_rec, rel_send, 50,
                                        burn_in=False, burn_in_steps=timesteps,
                                        dynamic_graph=True, encoder=encoder,
                                        temp=temp)
                    else:
                        output = decoder(data, edges, rel_rec, rel_send, 50,
                                        burn_in=True, burn_in_steps=timesteps)

                    target = data[:, :, 1:, :]

                else:
                    data_plot = data[:, :, 0:0 + 21,
                                    :].contiguous()
                    output = decoder(data_plot, edges, rel_rec, rel_send, 20)
                    target = data_plot[:, :, 1:, :]

                mse = ((target - output) ** 2).mean(dim=0).mean(dim=0).mean(dim=-1)
                tot_mse += mse.data.cpu().numpy()
                counter += 1

        mean_mse = tot_mse / counter
        mse_str = '['
        for mse_step in mean_mse[:-1]:
            mse_str += " {:.12f} ,".format(mse_step)
        mse_str += " {:.12f} ".format(mean_mse[-1])
        mse_str += ']'

        print('--------------------------------')
        print('--------Testing-----------------')
        print('--------------------------------')
        print('nll_test: {:.10f}'.format(np.mean(nll_test)),
            'kl_test: {:.10f}'.format(np.mean(kl_test)),
            'mse_test: {:.10f}'.format(np.mean(mse_test)),
            'acc_test: {:.10f}'.format(np.mean(acc_test)))
        print('MSE: {}'.format(mse_str))
        edges_test = np.concatenate(edges_test)
        probs_test = np.concatenate(probs_test)

        if save_folder:
            print('--------------------------------', file=log)
            print('--------Testing-----------------', file=log)
            print('--------------------------------', file=log)
            print('nll_test: {:.10f}'.format(np.mean(nll_test)),
                'kl_test: {:.10f}'.format(np.mean(kl_test)),
                'mse_test: {:.10f}'.format(np.mean(mse_test)),
                'acc_test: {:.10f}'.format(np.mean(acc_test)),
                file=log)
            print('MSE: {}'.format(mse_str), file=log)
            log.flush()
        if log is not None:
            print(save_folder)
            log.close()

    # def train(self, epoch, best_val_loss,encoder,decoder,train_loader,cuda,optimizer,rel_rec,rel_send,temp,hard,timesteps,prediction_steps
    #             ,var,prior,log_prior,num_residues,edge_types,scheduler,valid_loader,save_folder,encoder_file,decoder_file,log):
    #     t = time.time()
    #     nll_train = []
    #     acc_train = []
    #     kl_train = []
    #     mse_train = []
    #     edges_train = []
    #     probs_train = []

    #     encoder.train()
    #     decoder.train()

    #     for batch_idx, (data, relations) in enumerate(train_loader):

    #         if cuda:
    #             data, relations = data.cuda(), relations.cuda()
    #         data, relations = Variable(data), Variable(relations)

    #         optimizer.zero_grad()

    #         logits = encoder(data, rel_rec, rel_send)
    #         edges = gumbel_softmax(logits, tau=temp, hard=hard)
    #         prob = my_softmax(logits, -1)

    #         if decoder == 'rnn':
    #             output = decoder(data, edges, rel_rec, rel_send, 50,
    #                             burn_in=True,
    #                             burn_in_steps=timesteps - prediction_steps)
    #         else:
    #             output = decoder(data, edges, rel_rec, rel_send,
    #                             prediction_steps)

    #         target = data[:, :, 1:, :]

    #         loss_nll = nll_gaussian(output, target, var)

    #         if prior:
    #             loss_kl = kl_categorical(prob, log_prior, num_residues)
    #         else:
    #             loss_kl = kl_categorical_uniform(prob, num_residues,
    #                                             edge_types)

    #         loss = loss_nll + loss_kl

    #         acc = edge_accuracy(logits, relations)
    #         acc_train.append(acc)

    #         loss.backward()
    #         optimizer.step()

    #         mse_train.append(F.mse_loss(output, target).item())
    #         nll_train.append(loss_nll.item())
    #         kl_train.append(loss_kl.item())
    #         _, edges_t = edges.max(-1)
    #         edges_train.append(edges_t.data.cpu().numpy())
    #         probs_train.append(prob.data.cpu().numpy())

    #     scheduler.step()
    #     nll_val = []
    #     acc_val = []
    #     kl_val = []
    #     mse_val = []

    #     encoder.eval()
    #     decoder.eval()

    #     for batch_idx, (data, relations) in enumerate(valid_loader):
    #         if cuda:
    #             data, relations = data.cuda(), relations.cuda()
    #         with torch.no_grad():

    #             logits = encoder(data, rel_rec, rel_send)
    #             edges = gumbel_softmax(logits, tau=temp, hard=True)
    #             prob = my_softmax(logits, -1)

    #             # validation output uses teacher forcing
    #             output = decoder(data, edges, rel_rec, rel_send, 1)

    #             target = data[:, :, 1:, :]
    #             loss_nll = nll_gaussian(output, target, var)
    #             loss_kl = kl_categorical_uniform(
    #                 prob, num_residues, edge_types)

    #         acc = edge_accuracy(logits, relations)
    #         acc_val.append(acc)

    #         mse_val.append(F.mse_loss(output, target).item())
    #         nll_val.append(loss_nll.item())
    #         kl_val.append(loss_kl.item())

    #     print('Epoch: {:04d}'.format(epoch),
    #         'nll_train: {:.10f}'.format(np.mean(np.array(nll_train))),
    #         'kl_train: {:.10f}'.format(np.mean(np.array(kl_train))),
    #         'mse_train: {:.10f}'.format(np.mean(np.array(mse_train))),
    #         'acc_train: {:.10f}'.format(np.mean(np.array(acc_train))),
    #         'nll_val: {:.10f}'.format(np.mean(np.array(nll_val))),
    #         'kl_val: {:.10f}'.format(np.mean(np.array(kl_val))),
    #         'mse_val: {:.10f}'.format(np.mean(np.array(mse_val))),
    #         'acc_val: {:.10f}'.format(np.mean(np.array(acc_val))),
    #         'time: {:.4f}s'.format(time.time() - t))
    #     edges_train = np.concatenate(edges_train)
    #     probs_train = np.concatenate(probs_train)
    #     if save_folder and np.mean(np.array(nll_val)) < best_val_loss:
    #         torch.save(encoder.state_dict(), encoder_file)
    #         torch.save(decoder.state_dict(), decoder_file)
    #         print('Best model so far, saving...')
    #         print('Epoch: {:04d}'.format(epoch),
    #             'nll_train: {:.10f}'.format(np.mean(np.array(nll_train))),
    #             'kl_train: {:.10f}'.format(np.mean(np.array(kl_train))),
    #             'mse_train: {:.10f}'.format(np.mean(np.array(mse_train))),
    #             'acc_train: {:.10f}'.format(np.mean(np.array(acc_train))),
    #             'nll_val: {:.10f}'.format(np.mean(np.array(nll_val))),
    #             'kl_val: {:.10f}'.format(np.mean(np.array(kl_val))),
    #             'mse_val: {:.10f}'.format(np.mean(np.array(mse_val))),
    #             'acc_val: {:.10f}'.format(np.mean(np.array(acc_val))),
    #             'time: {:.4f}s'.format(time.time() - t), file=log)
    #         log.flush()
    #         val_loss = np.mean(np.array(nll_val))


    #     return encoder, decoder, edges_train, probs_train, np.mean(np.array(nll_val))


    # def test(self,encoder,decoder,encoder_file,decoder_file,test_loader,cuda,timesteps,rel_rec,rel_send,temp,var,
    #             num_residues,edge_types,dynamic_graph,save_folder,log):
    #     acc_test = []
    #     nll_test = []
    #     kl_test = []
    #     mse_test = []
    #     edges_test = []
    #     probs_test = []
    #     tot_mse = 0
    #     counter = 0

    #     encoder.eval()
    #     decoder.eval()
    #     encoder.load_state_dict(torch.load(encoder_file))
    #     decoder.load_state_dict(torch.load(decoder_file))

    #     for batch_idx, (data, relations) in enumerate(test_loader):
    #         if cuda:
    #             data, relations = data.cuda(), relations.cuda()

    #         with torch.no_grad():
    #             #        assert (data.size(2) - args.timesteps) >= args.timesteps
    #             assert (data.size(2)) >= timesteps

    #             data_encoder = data[:, :, :timesteps, :].contiguous()
    #             data_decoder = data[:, :, -timesteps:, :].contiguous()

    #             logits = encoder(data_encoder, rel_rec, rel_send)
    #             edges = gumbel_softmax(logits, tau=temp, hard=True)

    #             prob = my_softmax(logits, -1)

    #             output = decoder(data_decoder, edges, rel_rec, rel_send, 1)

    #             target = data_decoder[:, :, 1:, :]
    #             loss_nll = nll_gaussian(output, target, var)
    #             loss_kl = kl_categorical_uniform(
    #                 prob, num_residues, edge_types)

    #             acc = edge_accuracy(logits, relations)
    #             acc_test.append(acc)

    #             mse_test.append(F.mse_loss(output, target).item())
    #             nll_test.append(loss_nll.item())
    #             kl_test.append(loss_kl.item())
    #             _, edges_t = edges.max(-1)
    #             edges_test.append(edges_t.data.cpu().numpy())
    #             probs_test.append(prob.data.cpu().numpy())

    #             # For plotting purposes
    #             if decoder == 'rnn':
    #                 if dynamic_graph:
    #                     output = decoder(data, edges, rel_rec, rel_send, 50,
    #                                     burn_in=False, burn_in_steps=timesteps,
    #                                     dynamic_graph=True, encoder=encoder,
    #                                     temp=temp)
    #                 else:
    #                     output = decoder(data, edges, rel_rec, rel_send, 50,
    #                                     burn_in=True, burn_in_steps=timesteps)

    #                 target = data[:, :, 1:, :]

    #             else:
    #                 data_plot = data[:, :, 0:0 + 21,
    #                                 :].contiguous()
    #                 output = decoder(data_plot, edges, rel_rec, rel_send, 20)
    #                 target = data_plot[:, :, 1:, :]

    #             mse = ((target - output) ** 2).mean(dim=0).mean(dim=0).mean(dim=-1)
    #             tot_mse += mse.data.cpu().numpy()
    #             counter += 1

    #     mean_mse = tot_mse / counter
    #     mse_str = '['
    #     for mse_step in mean_mse[:-1]:
    #         mse_str += " {:.12f} ,".format(mse_step)
    #     mse_str += " {:.12f} ".format(mean_mse[-1])
    #     mse_str += ']'

    #     print('--------------------------------')
    #     print('--------Testing-----------------')
    #     print('--------------------------------')
    #     print('nll_test: {:.10f}'.format(np.mean(nll_test)),
    #         'kl_test: {:.10f}'.format(np.mean(kl_test)),
    #         'mse_test: {:.10f}'.format(np.mean(mse_test)),
    #         'acc_test: {:.10f}'.format(np.mean(acc_test)))
    #     print('MSE: {}'.format(mse_str))
    #     edges_test = np.concatenate(edges_test)
    #     probs_test = np.concatenate(probs_test)

    #     if save_folder:
    #         print('--------------------------------', file=log)
    #         print('--------Testing-----------------', file=log)
    #         print('--------------------------------', file=log)
    #         print('nll_test: {:.10f}'.format(np.mean(nll_test)),
    #             'kl_test: {:.10f}'.format(np.mean(kl_test)),
    #             'mse_test: {:.10f}'.format(np.mean(mse_test)),
    #             'acc_test: {:.10f}'.format(np.mean(acc_test)),
    #             file=log)
    #         print('MSE: {}'.format(mse_str), file=log)
    #         log.flush()
    #     return edges_test, probs_test



