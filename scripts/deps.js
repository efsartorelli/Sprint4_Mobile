const m = require("../node_modules/expo/bundledNativeModules.json");
const pkgs = [
"react-native-gesture-handler",
"react-native-screens",
"react-native-safe-area-context",
"@react-native-async-storage/async-storage",
"expo-constants",
];
const cmd = "npm i " + pkgs.map(p => p + "@" + m[p]).join(" ");
console.log(cmd);