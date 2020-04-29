PACGlobal Node
============

A PACGlobal full node for building applications and services with Node.js. A node is extensible and can be configured to run additional services. At the minimum a node has an interface to [PACGlobal Core (pacglobald) v0.15.0] for more advanced address queries. Additional services can be enabled to make a node more useful such as exposing new APIs, running a block explorer and wallet service.

## Usages

### As a standalone server

```bash
git clone https://github.com/koentjeappel/pacglobal-node
cd pacglobal-node
npm install
./bin/pacglobal-node start
```

When running the start command, it will seek for a .PACGlobal folder with a PACGlobal-node.json conf file.
If it doesn't exist, it will create it, with basic task to connect to pacglobald.

Some plugins are available :

- Insight-API : `./bin/pacglobal-node addservice @koentjeappel/insight-api`
- Insight-UI : `./bin/pacglobal-node addservice @koentjeappel/insight-ui`

You also might want to add these index to your pacglobal.conf file :
```
-addressindex
-timestampindex
-spentindex
```

### As a library

```bash
npm install @koentjeappel/pacglobal-node
```

```javascript
const PACGlobal = require('pacglobal-node');
const config = require('./pacglobal-node.json');

let node = pacglobal.scaffold.start({ path: "", config: config });
node.on('ready', function() {
    //PACGlobal core started
    pacglobald.on('tx', function(txData) {
        let tx = new PACGlobal.lib.Transaction(txData);
    });
});
```

## Prerequisites

- PACGlobal Core (pacglobald) (v0.13.0) with support for additional indexing *(see above)*
- Node.js v8+
- ZeroMQ *(libzmq3-dev for Ubuntu/Debian or zeromq on OSX)*
- ~20GB of disk storage
- ~1GB of RAM

## Configuration

PACGlobal includes a Command Line Interface (CLI) for managing, configuring and interfacing with your PACGlobal Node.

```bash
PACGlobal-node create -d <pacglobal-data-dir> mynode
cd mynode
PACGlobal-node install <service>
PACGlobal-node install https://github.com/yourname/helloworld
PACGlobal-node start
```

This will create a directory with configuration files for your node and install the necessary dependencies.

Please note that PACGlobal needs to be installed first.

For more information about (and developing) services, please see the [Service Documentation](docs/services.md).

## Add-on Services

There are several add-on services available to extend the functionality of Bitcore:

- [Insight API](https://github.com/koentjeappel/insight-api/tree/master)
- [Insight UI](https://github.com/koentjeappel/insight-ui/tree/master)
- [Bitcore Wallet Service](https://github.com/PACGlobal/PACGlobal-wallet-service/tree/master)

## Documentation

- [Upgrade Notes](docs/upgrade.md)
- [Services](docs/services.md)
  - [PACGlobald](docs/services/PACGlobald.md) - Interface to PACGlobal
  - [Web](docs/services/web.md) - Creates an express application over which services can expose their web/API content
- [Development Environment](docs/development.md) - Guide for setting up a development environment
- [Node](docs/node.md) - Details on the node constructor
- [Bus](docs/bus.md) - Overview of the event bus constructor
- [Release Process](docs/release.md) - Information about verifying a release and the release process.


## Setting up dev environment (with Insight)

Prerequisite : Having a pacgobald node already runing `pacglobald --daemon`.

PACGlobal-node : `git clone https://github.com/koentjeappel/PACGlobal-node -b develop`
Insight-api (optional) : `git clone https://github.com/koentjeappel/insight-api -b develop`
Insight-UI (optional) : `git clone https://github.com/koentjeappel/insight-ui -b develop`

Install them :
```
cd PACGlobal-node && npm install \
 && cd ../insight-ui && npm install \
 && cd ../insight-api && npm install && cd ..
```

Symbolic linking in parent folder :
```
npm link ../insight-api
npm link ../insight-ui
```

Start with `./bin/PACGlobal-node start` to first generate a ~/.PACGlobal/PACGlobal-node.json file.
Append this file with `"@koentjeappel/insight-ui"` and `"@koentjeappel/insight-api"` in the services array.

## Contributing

Please send pull requests for bug fixes, code optimization, and ideas for improvement. For more information on how to contribute, please refer to our  file.

## License
