#!/bin/bash --login

cd /vagrant

# sudo -E apt-get install build-essential
sudo -E apt-get install -y python-software-properties python g++ make

sudo -E apt-get install -y git

curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo -E apt-get install -y nodejs

# https://docs.npmjs.com/getting-started/fixing-npm-permissions
mkdir /home/vagrant/npm-global
npm config set prefix '/home/vagrant/npm-global'
echo "export PATH=/home/vagrant/npm-global/bin:$PATH" >> /home/vagrant/.profile
source /home/vagrant/.profile

# win: move node modules outside of shared folder to overcome 260 characters path problem
mkdir /home/vagrant/npm-local-node_modules
ln -s /home/vagrant/npm-local-node_modules node_modules

# win: run vagrant up from admin cmd, or uncomment this line to disable symlink
# echo "alias npm='npm --no-bin-links'" >> /home/vagrant/.bashrc

npm install -g bower
npm install -g karma-cli

wget -O- https://toolbelt.heroku.com/install-ubuntu.sh | sh

echo "cd /vagrant" >> /home/vagrant/.bashrc
