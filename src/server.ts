import path from 'path';
import './services/santaAssigner';
import { SantaAssigner } from './services/santaAssigner';
//
//
//
//
//
//
//
//
//
//
//
const DefaultCurrentFile = path.resolve('./src/data/employeeList.csv');
const DefaultPrevFile = path.resolve('./src/data/previousEmployee.csv');
console.log(DefaultCurrentFile);

const args = process.argv.slice(3);
const currentYearFile = args[0] ? args[0] : DefaultCurrentFile;
const previousYearFile = args[1] ? args[1] : DefaultPrevFile;

const santa = new SantaAssigner();
santa.assign(currentYearFile, previousYearFile);
