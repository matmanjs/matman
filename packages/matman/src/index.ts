import { PluginApp, PluginAppMaterial } from 'matman-plugin-app';
import { PluginMockstar, PluginMockstarMaterial } from 'matman-plugin-mockstar';
import { PluginWhistle } from 'matman-plugin-whistle';
import { PluginTest, PluginTestMochaMaterial } from 'matman-plugin-mocha';
import { DeviceMaterial, PluginPuppeteer } from 'matman-plugin-puppeteer';

import launch from './launch';
import CaseModule from './CaseModule';
import { debugCaseModule } from './debug';

export {
  PluginApp,
  PluginAppMaterial,
  PluginMockstar,
  PluginMockstarMaterial,
  PluginWhistle,
  PluginTest,
  PluginTestMochaMaterial,
  PluginPuppeteer,
  DeviceMaterial,
  launch,
  CaseModule,
  debugCaseModule,
};
