# Front2HPC
Scripts connecting between front-end in VM and back-end in HPC

# A. Installation
## Backend:
# clean cache
conda clean --all
pip cache purge

# 1.install conda
#https://www.digitalocean.com/community/tutorials/how-to-install-the-anaconda-python-distribution-on-ubuntu-22-04

# 2.install miniconda3
## conda create -n nar python==3.7
conda create --prefix /media/volume/sdb/nar python=3.7
conda activate /media/volume/sdb/nar
pip install -r requirements.txt
=========requirements.txt=========
Django==2.2.13
django-filter==2.2.0
djangorestframework==3.10.3
joblib==0.14.0
Markdown==3.1.1
numpy==1.17.3
pandas==0.25.2
requests==2.22.0
scikit-learn==0.21.3
apscheduler==3.9.1
django-apscheduler==0.6.0
django-cors-headers==3.6.0
django-environ
matplotlib==3.2.0
===================================

conda install networkx seaborn pytorch torchvision torchaudio cudatoolkit=11.3 -c pytorch

#3.enjoy
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

#can visit in http://localhost:8000

##
sudo HTTPS=true SSL_CRT_FILE=reactcert/nrimd_luddy_iupui_edu_cert.cer SSL_KEY_FILE=reactcert/nrimd.luddy.iupui.edu.key.2022_12_19 npm start
    "start": "export HTTPS=true&&SSL_CRT_FILE=reactcert/nrimd_luddy_iupui_edu_cert.cer&&SSL_KEY_FILE=reactcert/nrimd.luddy.iupui.edu.key.2022_12_19 node scripts/start.js",
HTTPS=true&&SSL_CRT_FILE=reactcert/cert.pem&&SSL_KEY_FILE=reactcert/key.pem

## B. Frontend
1.prepare environment
sudo apt install nodejs npm yarn

# update node.js to 14.X
https://computingforgeeks.com/install-node-js-14-on-ubuntu-debian-linux/

2.create frontend project and install dependencies
$npx create-react-app frontend
$cd frontend
$npm i antd@^4.24.2 redux react-redux react-router-dom@6 axios less less-loader@6.0.0 moment --save

3.eject (must git before eject) #Question
$git init
$git config user.name heyi21
$git config user.email heyi21@mails.jlu.edu.cn
$git add .
$git commit -m 'beforeEject'
$yarn eject

4.config less and cross domain
4.1 less
add this to "frontend/config/webpack.config.js" after line 545, 
============add after config/webpack.config.js line545==========
{
  test: /\.less$/,
    use: getStyleLoaders(
      {
        //not config now
      },
      'less-loader'
    ),
},
================================================================
now can write less, attend if you want change antd css style,
you should add " @import '~antd/dist/antd.css'; " to first line of less file
4.2 cross domain
replace config/webpackDevServer.config.js line 103 with this 
=========replace config/webpackDevServer.config.js line103========
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true, //if cross domain
    pathRewrite: { '^/api': '/' }
  }
}
==================================================================
now backend 'http://127.0.0.1:8000' has a new name '^/api',
if you want create yourself axios request, you should set axiosOption={baseURL: '/api',...}, but now we provided it

4.3 set up email address
# set up gmail: 
https://www.sitepoint.com/django-send-email/
create .env in the same level of settings.py:
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=nrimdserver@gmail.com
EMAIL_HOST_PASSWORD=XXXXXXXX

Test email:
(/media/volume/sdb/nar) exouser@nrimd-frontend:~/NRIproject/Front2HPC/backend$ python manage.py shell
/home/exouser/NRIproject/Front2HPC/backend/backend
Python 3.7.15 (default, Nov 24 2022, 21:12:53) 
[GCC 11.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
(InteractiveConsole)
>>> from django.core.mail import send_mail
>>> from django.conf import settings
>>> send_mail('A cool subject', 'A stunning message', settings.EMAIL_HOST_USER, ['wang.juexin@gmail.com'])
1

5.enjoy
now you only replace src folders with our src folders
$sudo npm start
can visit in 'http://127.0.0.1:3000'

    
## C. PV
1.prepare docker # More details on that

2.create image and container
install extesion for docker in vscode
compose up 'docker-compose-dev.apache.yml' in pv folders

3.enjoy
can visit in http://localhost:9090/index.php?pdb=1ake.pdb


## Set up HPC:

Access BigRed 200
https://kb.iu.edu/d/brcc#access


Set up key
https://kb.iu.edu/d/aews

## Set up crontab:
# crontab -e
# 1. Every 5 minutes to check the status. (NRI-MD_daemon_communication.py)
# */5 * * * * /home/exouser/anaconda3/bin/python /home/exouser/NRIproject/Front2HPC/NRI-MD_daemon_communication.py >> /media/volume/sdb/daemonlog.txt 2>&1
# 2. Delete results in 14 days, but run every week
# 0 0 * * 0 find /media/volume/sdb/jobs/files -mtime +14 -type f -delete
# 0 0 * * 0 find /home/exouser/NRIproject/Front2HPC/pv/pdbs/ -mtime +14 -type f -delete
## delete on every sunday
# Details in NRI-MD_daemon_communication.py

## Moniter open ports
sudo netstat -tulpn | grep LISTEN


# kernel:
URL of slurm

[https://kb.iu.edu/d/awrz](https://kb.iu.edu/d/awrz)

[https://kb.iu.edu/d/avjk](https://kb.iu.edu/d/avjk)

++++++++++++++++++++++++++

#!/bin/bash

#SBATCH -J job_name

#SBATCH -p gpu

#SBATCH -o filename_%j.txt

#SBATCH -e filename_%j.err

#SBATCH --nodes=1

#SBATCH --gpus-per-node 1

#SBATCH --time=02:00:00

#Load any modules that your program needs

module load deeplearning

#Run your program

srun python main.py

+++++++++++++++++++++++

ssh [soicwang@bigred200.uits.iu.edu](mailto:soicwang@bigred200.uits.iu.edu)

scp t1.slurm [soicwang@bigred200.uits.iu.edu](mailto:soicwang@bigred200.uits.iu.edu):~/t1

ssh [soicwang@bigred200.uits.iu.edu](mailto:soicwang@bigred200.uits.iu.edu) sbatch /N/u/soicwang/BigRed200/t1/t1.slurm





# concept

class backJobsRunner():
    filepath 
    filename
    jobid
    def submit():
        return


bjr = backJobsRunner()
bjr.setfilepath('')
bjr.set
...
bjr.submit()


# speperate progam
while(true):
    resultsBJ= bjr.getresultsBJ()
    system.sleep(60)


resultsBJ.getMatrix(jobid)
resultsBJ.getImage(jobid)
resultsBJ.getPaths(jobid) #dict

# output directory



# interaction
# preprocessing
--start
--end
--timestep-size
--train-interval
--validate-interval
--test-interval

# main.py
--seed
--epochs
--lr
--encoder-hidden
--decoder-hidden
--encoder
--decoder
--encoder-dropout
--decoder-dropout
--lr-decay
--gamma
--var