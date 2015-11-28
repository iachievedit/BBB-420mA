.DEFAULT_GOAL=dtbo
node:
	curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
	apt-get install -y nodejs

npm:
	npm install spi

dtbo: BB-SPICAPE-01-00A0.dts
	dtc -O dtb -o BB-SPICAPE-01-00A0.dtbo -b 0 -@ BB-SPICAPE-01-00A0.dts 
	cp BB-SPICAPE-01-00A0.dtbo /lib/firmware

clean:
	rm -rf node_modules
	rm BB-SPICAPE-01-00A0.dtbo
