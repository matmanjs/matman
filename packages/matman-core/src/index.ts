import Nightmare from 'nightmare';
import puppeteer from 'puppeteer';
import MatmanConfig from './config/MatmanConfig';
import DeviceConfig, {DeviceConfigOpts} from './config/DeviceConfig';
import ScreenshotConfig, {ScreenOpts} from './config/ScreenshotConfig';
import CoverageConfig, {CoverageOpts} from './config/CoverageConfig';
import MatmanResultConfig, {ResultOpts} from './config/MatmanResultConfig';
import {MATMAN_CONFIG_FILE} from './config';
import {Master} from './typings/master';
import {PageDriver} from './typings/pageDriver';
import {MatmanResult} from './typings/matmanResult';
import {NightmareOpts} from './types';

import {getAbsolutePath, findMatmanConfig, searchFilePath} from './util';
import {requireAsync, requireSync} from './util/require-file';

export {
  Nightmare,
  puppeteer,
  MatmanConfig,
  MATMAN_CONFIG_FILE,
  getAbsolutePath,
  searchFilePath,
  findMatmanConfig,
  requireAsync,
  requireSync,
  Master,
  PageDriver,
  NightmareOpts,
  DeviceConfig,
  DeviceConfigOpts,
  ScreenshotConfig,
  ScreenOpts,
  CoverageConfig,
  CoverageOpts,
  MatmanResultConfig,
  ResultOpts,
  MatmanResult,
};
