/*
BRX Runtime (BorderExtension Runtime)
Runs Border Plugins and Themes
*/
var vm = require('node:vm');

function startExtension(fs) {
  if(!fs['manifest.json']) {
    throw new TypeError("Manifest is missing or unparsable");
  }
  if(fs['manifest.json'].isDir==true) {
    throw new TypeError("Manifest is missing or unparsable");
  }
  var manifest;
  try {
    manifest=JSON.parse(
      fs['manifest.json'].Utf8
    );
  } catch (error) {
    throw new TypeError("Manifest is missing or unparsable");
  }
  var allows;
  var defaultPermissions=[];
  if(manifest.permissions){
    if(!(manifest.permssions instanceOf Array)) {
      throw new SyntaxError("manifest.permissions must be an Array");
    }
  }
  if(manifest.permissions) {
    allows=manifest.permissions;
  } else {
    allows=defaultPermissions
  }
  if(!manifest.name) {
    throw new SyntaxError("manifest must have 'name' property");
  }
  if(!manifest.version) {
    throw new SyntaxError("manifest must have 'version' property");
  }
  var workerPath=manifest.worker;
  var getEntryFromPath(fs,workerPath, "/");
}

function getEntryFromPath(PluginDataVFS,path,cwd) {
  if(path[0]!="/"){
    path=cwd+path
  }
  path=path.slice(1);
  // to be continued...
}
