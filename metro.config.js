// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];
config.resolver.assetExts = [...config.resolver.assetExts, 'mp4'];

module.exports = config;
