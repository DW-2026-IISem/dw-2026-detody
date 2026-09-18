import { Sequelize } from 'sequelize-typescript';
import { IEnvConfig } from '../../../config/environment/index.js';
export declare const ALL_MODELS: any[];
export declare function sequelizeFactory(cfg: IEnvConfig): Sequelize;
